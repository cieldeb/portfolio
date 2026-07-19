document.addEventListener('DOMContentLoaded', () => {
    general_utils();
});

function general_utils() {
    // smooth scrolling for nav links
    document.querySelectorAll('.head-menu-wrap a, .extra-link a, .profile-pic-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.hash) return;
            let target = document.querySelector(link.hash);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
