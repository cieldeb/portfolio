# Portfolio — Jean MANOURY (@cieldeb)

Source of my personal portfolio site, showcasing what I build and tinker with outside of school and work: software projects, 3D printing, open source contributions, and more.

- [About](#about)
- [Sections](#sections)
- [Tech stack](#tech-stack)
- [Running locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Credits](#credits)

### About
Diplômé de l'[ISEP](https://www.isep.fr/), I'm curious by nature and passionate about anything tech-related. This site is a single-page overview of what I've explored and built — a complement to my résumé rather than a replacement for it.

### Sections
- **À propos** — a short introduction
- **Développement** — coding projects, with links to my [GitHub](https://github.com/cieldeb) and [Codeberg](https://codeberg.org/cieldeb)
- **Impression 3D** — 3D printing designs and prints, with links to my [Printables](https://www.printables.com/@un_ours_blanc), [Thingiverse](https://www.thingiverse.com/un_ours_blanc/designs) and [Cults3D](https://cults3d.com/fr/utilisateurs/un_ours_blanc/fichiers-3d) profiles
- **Logiciel libre** — open source contributions and pull requests across various projects
- **Projets** — filterable project gallery (Web, Logiciel, DIY)
- **Liens utiles** — quick links to all my profiles ([LinkedIn](https://www.linkedin.com/in/jeanmanoury), [photography](https://cieldeb.github.io/photography/), [Weblate](https://hosted.weblate.org/user/Ciel.deb/), etc.)

### Tech stack
Static site built with Jekyll, vanilla CSS/JS and a bit of jQuery. Content lives in `_includes/`, layout in `_layouts/default.html`, and personal details/links are configured in `_config.yml`. The "Développement" / "Impression 3D" / "Photographie" sections (profile links + photo mosaic) share a single template, `_includes/mosaic-section.html`, driven by `_data/mosaic_sections.yml` — add a new section by adding an entry there and one `{% include mosaic-section.html key="..." bg="white|blur" %}` call in `_layouts/default.html` (the background is controlled from the layout, not the data file).

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

### Credits
Originally based on [abhn/portfolio](https://github.com/abhn/portfolio), a lightweight single-page portfolio template — thanks to [@abhn](https://github.com/abhn) for the starting point. It's since been reworked and re-themed to fit my own content and sections.

### License
GPL