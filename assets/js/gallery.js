let galleryImages = [];
let galleryIndex = 0;

function openGallery(images) {
    galleryImages = images;
    galleryIndex = 0;
    updateGalleryImage();
    document.getElementById('gallery-modal').classList.add('open');
    document.body.classList.add('gallery-open');
}

function closeGallery() {
    document.getElementById('gallery-modal').classList.remove('open');
    document.body.classList.remove('gallery-open');
}

function galleryPrev() {
    galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryImage();
}

function galleryNext() {
    galleryIndex = (galleryIndex + 1) % galleryImages.length;
    updateGalleryImage();
}

function updateGalleryImage() {
    let img = document.getElementById('gallery-modal-image');
    img.src = galleryImages[galleryIndex];
}

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('gallery-modal')?.classList.contains('open')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') galleryPrev();
    if (e.key === 'ArrowRight') galleryNext();
});

document.getElementById('gallery-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'gallery-modal') closeGallery();
});
