# syntax=docker/dockerfile:1.7
FROM ruby:3.3-slim AS build
WORKDIR /site

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    build-essential git \
    && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

# passed through to _plugins/remote_git_stats.rb so the build-time commit/
# download count lookups aren't rate-limited or (for Cults3D) unauthenticated;
# see docker-compose.yml and .env.example
ARG GITHUB_TOKEN
ARG CULTS_USERNAME
ARG CULTS_API_KEY
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV CULTS_USERNAME=$CULTS_USERNAME
ENV CULTS_API_KEY=$CULTS_API_KEY

# cache mount (not part of the image) so the commit/download counts fetched
# by _plugins/remote_git_stats.rb survive across `docker compose build` runs
# instead of doing a fresh network round-trip on every deploy — the plugin's
# own 24h TTL then decides whether to actually reuse or refresh each value
RUN --mount=type=cache,target=/site/.cache \
    bundle exec jekyll build

FROM nginx:alpine
COPY --from=build /site/_site /usr/share/nginx/html

EXPOSE 80
