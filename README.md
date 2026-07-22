# Portfolio — @cieldeb

Source of my personal portfolio site, showcasing what I build and tinker with outside of school and work: software projects, 3D printing, open source contributions, and more.

- [About](#about)
- [Sections](#sections)
- [Tech stack](#tech-stack)
- [Running locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Scripts](#scripts)
- [Credits](#credits)

### About
This site is a single-page overview of what I've explored and built — a complement to my résumé rather than a replacement for it.

### Sections
- **À propos** — a short introduction
- **Développement** — coding projects, with links to my [GitHub](https://github.com/cieldeb) and [Codeberg](https://codeberg.org/cieldeb)
- **Impression 3D** — 3D printing designs and prints, with links to my [Printables](https://www.printables.com/@un_ours_blanc), [Thingiverse](https://www.thingiverse.com/un_ours_blanc/designs) and [Cults3D](https://cults3d.com/fr/utilisateurs/un_ours_blanc/fichiers-3d) profiles
- **Logiciel libre** — open source contributions and pull requests across various projects
- **Projets** — filterable project gallery (Web, Logiciel, 3D printing and maker)
- **Liens utiles** — quick links to all my profiles ([LinkedIn](https://www.linkedin.com/in/jeanmanoury), [photography](https://cieldeb.github.io/photography/), [Weblate](https://hosted.weblate.org/user/Ciel.deb/), etc.)

### Tech stack
Static site built with Jekyll and vanilla CSS/JS. Content lives in `_includes/`, layout in `_layouts/default.html`, and personal details/links are configured in `_config.yml`. The "Développement" / "Impression 3D" / "Photographie" sections (profile links + photo mosaic) share a single template, `_includes/mosaic-section.html`, driven by `_data/mosaic_sections.yml` — add a new section by adding an entry there and one `{% include mosaic-section.html key="..." bg="white|blur" %}` call in `_layouts/default.html` (the background is controlled from the layout, not the data file).

Most content that changes over time lives in `_data/` rather than in the templates themselves:
- `_data/projects.yml` — the "Projets" cards. A project can declare `stats: [commits]` to show its commit count on the default branch, fetched live at build time from its `link` (GitHub/Codeberg only).
- `_data/opensource.yml` — the "Logiciel libre" entries. The Pull requests/Mergées/Projets touchés/Issues ouvertes counters and each entry's badge are derived from this list, not hand-typed; for GitHub/Codeberg PR urls the badge status (merged/open/closed) is also fetched live at build time rather than set by hand (the `status:` field is just the fallback used if that lookup fails).
- `_data/links.yml` — the "Liens utiles" grid.

Live lookups for the two points above are done by `_plugins/remote_git_stats.rb`, a small build-time Jekyll generator — so `jekyll build`/`jekyll serve` needs network access the first time (or after the cache expires) to reach the GitHub/Codeberg/Printables/Cults3D APIs. Results are cached for 24 hours in `.cache/remote-git-stats.json` (gitignored); if a lookup fails (offline, rate-limited, unrecognized host) the build falls back to a stale cached value or the YAML default instead of failing, and a single transient network error gets one automatic retry.

GitHub's unauthenticated API is capped at 60 requests/hour per IP; Cults3D's download counts need account API credentials regardless of rate limits. Copy `.env.example` to `.env` and fill in `GITHUB_TOKEN`/`CULTS_USERNAME`/`CULTS_API_KEY` to cover both — see that file for where to get them. Running locally, these are picked up from your shell environment; with Docker, `docker-compose.yml` passes them through as build args automatically if `.env` exists.

When deploying with Docker, the Dockerfile mounts `.cache/` as a BuildKit cache mount so fetched commit/download counts survive across `docker compose up -d --build` runs instead of re-fetching on every deploy (requires BuildKit, the default on any reasonably recent Docker install).

CSS is split by section/component under `assets/css/` (`base.css`, `header.css`, `skills.css`, `mosaic.css`, `projects.css`, `card.css`, `opensource.css`, `links.css`, `footer.css`, plus `legacy.css` for rules with no matching class left in any template) — see `_includes/head.html` for the load order.

### Running locally
```bash
bundle install
bundle exec jekyll serve
```
Then open `http://localhost:4000`.

### Running with Docker
For quick deployment on a home server or LAN:
```bash
docker compose up -d --build
```
Then open `http://<host>:8080`. This builds the Jekyll site and serves the static output via nginx. Change the exposed port in `docker-compose.yml` if needed.

### Deploying to GitHub Pages
This site uses a custom plugin (`_plugins/remote_git_stats.rb`), so it can't use GitHub Pages' built-in Jekyll build (that build runs in "safe mode" and ignores custom plugins entirely). Instead, `.github/workflows/deploy.yml` builds the site with GitHub Actions and publishes the result:

1. In the repo's Settings → Pages, set **Source** to **GitHub Actions**.
2. Push to `master` (or run the workflow manually from the Actions tab) — it builds with `bundle exec jekyll build` and deploys the `_site` output.
3. Optional: to avoid GitHub API rate limits and enable Cults3D download counts in that build, add repo secrets (Settings → Secrets and variables → Actions) named `CULTS_USERNAME` and `CULTS_API_KEY` — `GITHUB_TOKEN` is provided automatically by Actions, no setup needed for that one.

### Scripts
- `scripts/resize-images.sh <folder> [max-edge] [quality]` — shrinks every image in a folder in place (only ever shrinks, never upscales), detecting each file's real format rather than trusting its extension. Example: `scripts/resize-images.sh assets/images/3dprinting 1920 82`.

### Credits
Originally based on [abhn/portfolio](https://github.com/abhn/portfolio), a lightweight single-page portfolio template

### License
GPL
