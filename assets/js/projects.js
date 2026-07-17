$(document).ready(() => {
    render_projects('featured');
})


let render_projects = (slug) => {
    let projects_area = $('.projects-wrapper');

    $('.white-button').removeClass('white-button-hover');
    $(`#${slug}`).addClass('white-button-hover');

    let projects_obj = [
        {
            images: ['assets/images/watermarkerExmpl.png'],
            link: 'https://codeberg.org/cieldeb/watermarker',
            title: 'Watermarker',
            demo: false,
            technologies: ['Golang', 'Wails', 'YAML'],
            description: "Outil en ligne de commande pour ajouter un filigrane à mes prises de vue pour les diffuser sur internet (<a href=\"https://cieldeb.github.io/portfolio/\">Exemple</a>). Les prochaines fonctionnalités ajoutées seront une interface graphique et des profils enregistrés dans la configuration de l'application.",
            categories: ['featured', 'dev']
        },
        {
            images: ['assets/images/dirtree.png'],
            link: 'https://codeberg.org/cieldeb/dirtree',
            title: 'Dirtree',
            demo: false,
            technologies: ['Golang', 'YAML'],
            description: "Outil en ligne de commande pour décrire l'arborescence d'un dossier dans le terminal, dans un fichier texte ou au format JSON, en ayant le contrôle sur divers paramètres comme la description récursive des dossiers, l'ensemble de caractères dessinant l'arbre ou encore l'ordre de description des éléments.",
            categories: ['featured', 'dev']
        },
        {
            images: ['assets/images/commander.png'],
            link: 'https://codeberg.org/cieldeb/fablab',
            title: 'Plateforme du FabLab',
            demo: false,
            technologies: ['NodeJS', 'PostgreSQL', 'HTML', 'CSS', 'JS'],
            description: "Une plateforme pour gérer les commandes passées au FabLab de mon association étudiante, avec un suivi de l'état des commandes et une messagerie pour chaque commande.",
            categories: ['featured', 'webdev']
        },
        {
            images: ['assets/images/ProjetFinanceActions.png'],
            link: 'https://github.com/cieldeb/Projet_Finance',
            title: 'Application de gestion de portefeuille financier',
            demo: false,
            technologies: ['Java', 'JavaFX', 'JSON'],
            description: "Une application de gestion de portefeuille financier avec visualisation de donnes. Développée en Java avec une interface graphique basée sur JavaFX.",
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
    projects_area.hide().html(projects).fadeIn();
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
    let slides = track.find('.carousel-slide');
    let currentIndex = slides.index(slides.filter('.active'));
    let nextIndex = (currentIndex + direction + slides.length) % slides.length;
    slides.removeClass('active');
    slides.eq(nextIndex).addClass('active');
}

$(document).on('click', '.carousel-prev', function(e) {
    e.preventDefault();
    navigate_carousel($(this).siblings('.carousel-track'), -1);
});

$(document).on('click', '.carousel-next', function(e) {
    e.preventDefault();
    navigate_carousel($(this).siblings('.carousel-track'), 1);
});