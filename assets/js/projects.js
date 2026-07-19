document.addEventListener('DOMContentLoaded', () => {
    render_projects('featured');
});


let fade_in = (el, html) => {
    el.style.transition = 'none';
    el.style.opacity = 0;
    el.innerHTML = html;
    requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.4s';
        el.style.opacity = 1;
    });
}

let render_projects = (slug) => {
    let projects_area = document.querySelector('.projects-wrapper');

    document.querySelectorAll('.white-button').forEach(button => button.classList.remove('white-button-hover'));
    document.getElementById(slug)?.classList.add('white-button-hover');

    let techLinks = {
        golang: ["https://go.dev/", "Golang"],
        wails: ["https://wails.io/", "Wails"],
        yaml: ["https://yaml.org/", "YAML"],
        pgsql: ["https://postgresql.org/", "PostgreSQL"],
        nodejs: ["https://nodejs.org/", "NodeJS"],
        html: ["https://developer.mozilla.org/en-US/docs/Web/HTML", "HTML"],
        css: ["https://developer.mozilla.org/en-US/docs/Web/CSS", "CSS"],
        js: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript", "JS"],
        json: ["https://www.json.org/", "JSON"],
        java: ["https://www.java.com/", "Java"],
        javafx: ["https://openjfx.io/", "JavaFX"],
        docker: ["https://www.docker.com/", "Docker"],
        nixos: ["https://nixos.org/", "NixOs"],
        jekyll: ["https://jekyllrb.com/", "Jekyll"],
        FDM: ["https://en.wikipedia.org/wiki/Fused_filament_fabrication", "Impression 3D FDM"],
        autodeskFusion: ["https://www.autodesk.com/fr/products/fusion-360/overview", "Autodesk Fusion"],
    };

    let techTag = (key) => `<a href="${techLinks[key][0]}" target="_blank" rel="noopener noreferrer">${techLinks[key][1]}</a>`;

    let projects_obj = [
        {
            images: ['assets/images/ProjetFinanceActions.png'],
            link: 'https://github.com/cieldeb/Projet_Finance',
            title: 'Application de gestion de portefeuille financier',
            demo: false,
            technologies: [techTag('java'), techTag('javafx'), techTag('json')],
            description: "Une application de gestion de portefeuille financier avec visualisation de donnes. Développée en Java avec une interface graphique basée sur JavaFX.",
            categories: ['dev']
        },
        {
            images: ['assets/images/3dprinting/cochonmc.png'],
            link: 'https://www.printables.com/model/114839-minecraft-pig',
            title: 'Cochon Minecraft',
            demo: false,
            technologies: [techTag('FDM')],
            description: "Figurine d'un cochon de Minecraft imprimée en 3D.",
            categories: ['diy']
        },
        {
            images: ['assets/images/3dprinting/katarmini.png'],
            link: 'https://cults3d.com/fr/mod%C3%A8le-3d/gadget/corsair-katar-pro-wireless-light-and-fingertip-case',
            title: 'Coque allégée pour souris Corsair Katar Pro Wireless',
            demo: false,
            technologies: [techTag('autodeskFusion'), techTag('FDM')],
            description: "Coque pour prise en main \"fingertip\" imprimée en 3D pour alléger la souris Corsair Katar Pro Wireless, modélisée après prise de mesure précise des composants (électroniques ou pas).",
            categories: ['featured', 'diy']
        },
        {
            images: ['assets/images/dirtree.png'],
            link: 'https://codeberg.org/cieldeb/dirtree',
            title: 'Dirtree',
            demo: false,
            technologies: [techTag('golang'), techTag('yaml')],
            description: "Outil en ligne de commande pour décrire l'arborescence d'un dossier dans le terminal, dans un fichier texte ou au format JSON, en ayant le contrôle sur divers paramètres comme la description récursive des dossiers, l'ensemble de caractères dessinant l'arbre ou encore l'ordre de description des éléments.",
            categories: ['dev']
        },
        {
            images: ['assets/images/commander.png'],
            link: 'https://codeberg.org/cieldeb/fablab',
            title: 'Plateforme du FabLab',
            demo: false,
            technologies: [techTag('nodejs'), techTag('pgsql'), techTag('html'), techTag('css'), techTag('js')],
            description: "Une plateforme pour gérer les commandes passées au FabLab de mon association étudiante, avec un suivi de l'état des commandes et une messagerie pour chaque commande.",
            categories: ['webdev']
        },
        {
            images: ['assets/images/photospersos/DSC00749.jpg'],
            link: 'https://cieldeb.github.io/photography/',
            title: 'Portfolio photographique',
            demo: false,
            technologies: [techTag('html'), techTag('css')],
            description: "Galerie photographique personnelle mettant en avant mes prises de vue de paysages et de nature.",
            categories: ['webdev']
        },
        {
            images: ['assets/images/portfolioTech.png'],
            link: 'https://github.com/cieldeb/portfolioTech',
            title: 'Portfolio technique',
            demo: false,
            technologies: [techTag('jekyll'), techTag('html'), techTag('css'), techTag('js'), techTag('docker')],
            description: "Site vitrine présentant mes projets techniques, impressions 3D et contributions open source, avec un déploiement Docker prêt à l'emploi pour une utilisation sur réseau local.",
            categories: ['featured', 'webdev']
        },
        {
            images: ['assets/images/courpaserverHomepage.jpg'],
            link: "https://codeberg.org/cieldeb/smallServer.git",
            title: 'Serveur local',
            demo: false,
            technologies: [techTag('docker'), techTag('nixos')],
            description: "Un serveur local permettant un partage sur le LAN (réseau local) de fichiers avec filebrowser et hébergeant un serveur minecraft",
            categories: ['featured', 'dev']
        },
        {
            images: ['assets/images/3dprinting/keycapsset.png'],
            link: 'https://www.printables.com/model/263910-keycaps-set-for-mechanical-keyboard-cherrycross-st',
            title: 'Set de keycaps pour clavier mécanique',
            demo: false,
            technologies: [techTag('autodeskFusion'), techTag('FDM')],
            description: "Ensemble de touches (keycaps) imprimées en 3D, compatibles avec les switchs avec empreinte \"Cherry\"/\"Cross\", pour clavier mécanique.",
            categories: ['diy']
        },
        {
            images: ['assets/images/3dprinting/rollholder.png'],
            link: 'https://www.printables.com/model/266892-parametric-roll-holder',
            title: 'Support à rouleau paramétrique',
            demo: false,
            technologies: [techTag('autodeskFusion'), techTag('FDM')],
            description: "Support de rouleau (papier essuie-tout) généré paramétriquement, incluant des aimants pour se fixer notamment à un frigo et imprimé en 3D.",
            categories: ['diy']
        },
        {
            images: ['assets/images/3dprinting/totoche.png'],
            link: 'https://www.printables.com/model/229333-totoche-3d-printed-blow-horn-for-scouting-hunting-',
            title: "Totoche : corne d'appel imprimée en 3D",
            demo: false,
            technologies: [techTag('autodeskFusion'), techTag('FDM')],
            description: "Corne d'appel (« totoche ») imprimée en 3D, utilisée en scoutisme et pour la chasse, selon le besoin.",
            categories: ['diy']
        },
        {
            images: ['assets/images/watermarkerExmpl.png'],
            link: 'https://codeberg.org/cieldeb/watermarker',
            title: 'Watermarker',
            demo: false,
            technologies: [techTag('golang'), techTag('wails'), techTag('yaml')],
            description: "Outil en ligne de commande pour ajouter un filigrane à mes prises de vue pour les diffuser sur internet (<a href=\"https://cieldeb.github.io/portfolio/\">Exemple</a>). Les prochaines fonctionnalités ajoutées seront une interface graphique et des profils enregistrés dans la configuration de l'application.",
            categories: ['featured', 'dev']
        },
    ]

    let projects = [];
    if(slug == 'all') {
        projects = projects_obj.map(project_mapper);
    }
    else {
        projects = projects_obj.filter(project => project.categories.includes(slug)).map(project_mapper);
    }
    fade_in(projects_area, projects.join(''));
}

let project_mapper = project => {
    return `
        <div class="wrapper">

            <div class="card radius shadowDepth1">

                ${project.images && project.images.length ?
                    `<div class="card__image border-tlr-radius">
                        <div class="carousel">
                            <div class="carousel-track">
                                ${project.images.map((image, i) =>
                                    `<img src="${image}" alt="${project.title}" class="carousel-slide border-tlr-radius ${i === 0 ? 'active' : ''}">`
                                ).join('')}
                            </div>
                            ${project.images.length > 1 ?
                                `<button type="button" class="carousel-arrow carousel-prev" aria-label="Photo précédente"><i class="fas fa-chevron-left"></i></button>
                                <button type="button" class="carousel-arrow carousel-next" aria-label="Photo suivante"><i class="fas fa-chevron-right"></i></button>`
                            : ''}
                        </div>
                    </div>`
                : ''}


                <div class="card__content card__padding">

                    <div class="card__header">
                        <h2 class="card__title">${project.title}</h2>
                        <a class="card__external-link" href="${project.link}" target="_blank" rel="noopener noreferrer" aria-label="Voir le projet : ${project.title}">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>

                    <article class="card__article">
                        <p class="paragraph-text-normal">${project.description} ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer">Demo</a>` : ''}</p>
                    </article>


                    <div class="card__meta">
                        ${project.technologies.map(tech =>
                            `<span class="project-technology paragraph-text-normal">${tech}</span>`
                        ).join('')}
                    </div>

                </div>
            </div>
        </div>
    `
}

let selected = (slug) => {
    render_projects(slug);
}

let navigate_carousel = (track, direction) => {
    let slides = [...track.querySelectorAll('.carousel-slide')];
    let currentIndex = slides.findIndex(slide => slide.classList.contains('active'));
    let nextIndex = (currentIndex + direction + slides.length) % slides.length;
    slides.forEach(slide => slide.classList.remove('active'));
    slides[nextIndex].classList.add('active');
}

document.addEventListener('click', (e) => {
    let button = e.target.closest('.carousel-prev, .carousel-next');
    if (!button) return;
    e.preventDefault();
    let direction = button.classList.contains('carousel-prev') ? -1 : 1;
    navigate_carousel(button.closest('.carousel').querySelector('.carousel-track'), direction);
});