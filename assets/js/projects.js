document.addEventListener('DOMContentLoaded', () => {
    render_projects('featured');
});

let render_projects = (slug) => {
    document.querySelectorAll('.white-button').forEach(button => button.classList.remove('white-button-hover'));
    document.getElementById(slug)?.classList.add('white-button-hover');

    document.querySelectorAll('.projects-wrapper > .wrapper').forEach(card => {
        let categories = card.dataset.categories.split(' ');
        let visible = slug === 'all' || categories.includes(slug);
        card.classList.toggle('project-hidden', !visible);
    });
}

let selected = (slug) => {
    render_projects(slug);
}
