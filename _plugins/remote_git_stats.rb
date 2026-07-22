require "net/http"
require "uri"
require "json"
require "fileutils"
require "cgi"

# Fetches small bits of live data at build time so they don't have to be
# hand-typed and kept in sync in _data/*.yml:
#
#   - _data/opensource.yml: each contribution's PR "status" (merged/open/closed)
#     is looked up from the PR itself (GitHub/Codeberg only), unless the entry
#     sets `kind: translation` (nothing to look up there, e.g. Weblate).
#   - _data/projects.yml: a project with `stats: [commits]` gets its commit
#     count on the default branch fetched from its `link` repo URL (GitHub/
#     Codeberg only); `stats: [downloads]` gets its download count fetched
#     from Printables or Cults3D.
#
# Any request that fails — offline build, rate limit, unsupported host — is
# left untouched rather than breaking the build; a value fetched successfully
# in the past keeps being shown (stale) until a fetch succeeds again, so a
# flaky/offline deploy never makes a stat disappear once it's been seen. A
# transient network error (timeout, connection reset) gets one retry before
# falling back. Results are cached on disk for CACHE_TTL seconds (a day, by
# default) so redeploys don't hammer the API or require network access every
# time — see the Dockerfile/docker-compose.yml for how the cache survives
# rebuilds.
#
# GitHub's unauthenticated API is limited to 60 requests/hour per IP, shared
# across every repo fetched here; set a GITHUB_TOKEN env var (no special
# scope needed, just a plain personal access token) to raise that to 5000/hour.
# Cults3D always needs auth: set CULTS_USERNAME (your account nick) and
# CULTS_API_KEY (generated from your account's API settings) — without both,
# Cults3D downloads are silently skipped like any other unconfigured stat.
module RemoteGitStats
  CACHE_TTL = 24 * 60 * 60
  TIMEOUT = 8
  MAX_ATTEMPTS = 2

  GITHUB_REPO_RE = %r{\Ahttps?://github\.com/([^/]+)/([^/]+?)(?:\.git)?/?\z}
  GITHUB_PR_RE = %r{\Ahttps?://github\.com/([^/]+)/([^/]+)/pull/(\d+)}
  CODEBERG_REPO_RE = %r{\Ahttps?://codeberg\.org/([^/]+)/([^/]+?)(?:\.git)?/?\z}
  CODEBERG_PR_RE = %r{\Ahttps?://codeberg\.org/([^/]+)/([^/]+)/pulls/(\d+)}
  PRINTABLES_RE = %r{\Ahttps?://(?:www\.)?printables\.com/model/(\d+)}
  CULTS_RE = %r{\Ahttps?://(?:www\.)?cults3d\.com/.+/([^/]+?)/?\z}

  class Cache
    def initialize(path)
      @path = path
      @data = File.exist?(path) ? (JSON.parse(File.read(path)) rescue {}) : {}
    end

    def fetch(key)
      entry = @data[key]
      return entry["value"] if entry && (Time.now.to_i - entry["fetched_at"]) < CACHE_TTL

      value = yield
      @data[key] = { "value" => value, "fetched_at" => Time.now.to_i } unless value.nil?
      value.nil? && entry ? entry["value"] : value # fall back to a stale value over nothing
    end

    def save
      FileUtils.mkdir_p(File.dirname(@path))
      File.write(@path, JSON.generate(@data))
    end
  end

  # Runs the request, retrying once on a transient network error (timeout,
  # connection reset...) before giving up on this attempt.
  def self.perform(uri, req)
    attempts = 0
    begin
      attempts += 1
      Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: TIMEOUT, read_timeout: TIMEOUT) do |http|
        http.request(req)
      end
    rescue StandardError
      retry if attempts < MAX_ATTEMPTS
      raise
    end
  end

  def self.get_json(uri)
    uri = URI(uri)
    req = Net::HTTP::Get.new(uri)
    req["User-Agent"] = "portfolioTech-build"
    req["Accept"] = "application/vnd.github+json"
    req["Authorization"] = "Bearer #{ENV['GITHUB_TOKEN']}" if !ENV["GITHUB_TOKEN"].to_s.empty? && uri.host == "api.github.com"

    res = perform(uri, req)
    unless res.is_a?(Net::HTTPSuccess)
      if res["X-RateLimit-Remaining"] == "0"
        Jekyll.logger.warn "RemoteGitStats:", "rate-limited fetching #{uri} — set a GITHUB_TOKEN env var to raise the limit"
      else
        Jekyll.logger.warn "RemoteGitStats:", "#{uri} returned #{res.code}"
      end
      return nil
    end

    [JSON.parse(res.body), res]
  rescue StandardError => e
    Jekyll.logger.warn "RemoteGitStats:", "#{uri} failed (#{e.message})"
    nil
  end

  def self.post_json(uri, body, basic_auth: nil)
    uri = URI(uri)
    req = Net::HTTP::Post.new(uri)
    req["User-Agent"] = "portfolioTech-build"
    req["Content-Type"] = "application/json"
    req.basic_auth(*basic_auth) if basic_auth
    req.body = JSON.generate(body)

    res = perform(uri, req)
    unless res.is_a?(Net::HTTPSuccess)
      Jekyll.logger.warn "RemoteGitStats:", "#{uri} returned #{res.code}"
      return nil
    end

    JSON.parse(res.body)
  rescue StandardError => e
    Jekyll.logger.warn "RemoteGitStats:", "#{uri} failed (#{e.message})"
    nil
  end

  # Last page number in a paginated GitHub/Gitea Link header == total item
  # count, since both list commits with one item per "page" when per_page=1.
  def self.total_from_link_header(res)
    link = res["Link"]
    return nil unless link

    match = link.match(/[?&]page=(\d+)>; rel="last"/)
    match && match[1].to_i
  end

  def self.commit_count(url)
    if (m = url.match(GITHUB_REPO_RE))
      owner, repo = m[1], m[2]
      json, res = get_json("https://api.github.com/repos/#{owner}/#{repo}/commits?per_page=1") || [nil, nil]
      return nil unless res

      total_from_link_header(res) || (json ? json.size : nil)
    elsif (m = url.match(CODEBERG_REPO_RE))
      owner, repo = m[1], m[2]
      json, res = get_json("https://codeberg.org/api/v1/repos/#{owner}/#{repo}/commits?limit=1") || [nil, nil]
      return nil unless res

      (res["X-Total-Count"] && res["X-Total-Count"].to_i) || total_from_link_header(res) || (json ? json.size : nil)
    end
  end

  def self.download_count(url)
    if (m = url.match(PRINTABLES_RE))
      id = m[1]
      result = post_json("https://api.printables.com/graphql/", { query: "query { print(id: #{id}) { downloadCount } }" })
      result&.dig("data", "print", "downloadCount")
    elsif (m = url.match(CULTS_RE))
      return nil if ENV["CULTS_USERNAME"].to_s.empty? || ENV["CULTS_API_KEY"].to_s.empty?

      slug = CGI.unescape(m[1])
      body = {
        query: "query($slug: String!) { creation(slug: $slug) { downloadsCount } }",
        variables: { slug: slug },
      }
      result = post_json("https://cults3d.com/graphql", body, basic_auth: [ENV["CULTS_USERNAME"], ENV["CULTS_API_KEY"]])
      result&.dig("data", "creation", "downloadsCount")
    end
  end

  def self.pr_status(url)
    if (m = url.match(GITHUB_PR_RE))
      owner, repo, number = m[1], m[2], m[3]
      json, = get_json("https://api.github.com/repos/#{owner}/#{repo}/pulls/#{number}") || [nil]
      pr_state(json)
    elsif (m = url.match(CODEBERG_PR_RE))
      owner, repo, number = m[1], m[2], m[3]
      json, = get_json("https://codeberg.org/api/v1/repos/#{owner}/#{repo}/pulls/#{number}") || [nil]
      pr_state(json)
    end
  end

  def self.pr_state(json)
    return nil unless json

    return "merged" if json["merged"]

    json["state"] == "open" ? "open" : "closed"
  end
end

class RemoteGitStatsGenerator < Jekyll::Generator
  priority :low

  def generate(site)
    cache = RemoteGitStats::Cache.new(File.join(site.source, ".cache", "remote-git-stats.json"))

    Array(site.data.dig("opensource", "contributions")).each do |c|
      next if c["kind"] == "translation" || !c["url"]

      status = cache.fetch("pr:#{c['url']}") { RemoteGitStats.pr_status(c["url"]) }
      c["status"] = status if status
    end

    Array(site.data.dig("projects", "projects")).each do |entry|
      entry.each_value do |project|
        next unless project.is_a?(Hash) && project["link"]

        stats = Array(project["stats"])

        if stats.include?("commits")
          count = cache.fetch("commits:#{project['link']}") { RemoteGitStats.commit_count(project["link"]) }
          project["commit_count"] = count if count
        end

        if stats.include?("downloads")
          count = cache.fetch("downloads:#{project['link']}") { RemoteGitStats.download_count(project["link"]) }
          project["download_count"] = count if count
        end
      end
    end

    cache.save
  end
end
