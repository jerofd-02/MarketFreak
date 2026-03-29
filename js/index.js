function fillCarousel(container, product) {
    const viewport = container.querySelector('.carousel_viewport');
    const navigation = container.querySelector('.carousel_navigation');

    viewport.innerHTML = '';
    navigation.innerHTML = '';

    product.images.forEach((imgSrc, i) => {
        const slideId = `slide${i + 1}`;

        const slide = document.createElement('div');
        slide.id = slideId;
        slide.classList.add('carousel_slide');

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = product.alt;

        slide.appendChild(img);
        viewport.appendChild(slide);

        const navButton = document.createElement('a');
        navButton.href = `#${slideId}`;
        navButton.classList.add('carousel_navigation-button');
        navigation.appendChild(navButton);
    });

    const slides = container.querySelectorAll('.carousel_slide');
    const navButtons = navigation.querySelectorAll('.carousel_navigation-button');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = [...slides].indexOf(entry.target);
                navButtons.forEach((btn) => btn.classList.remove('active'));
                navButtons[index].classList.add('active');
            }
        });
    }, {
        root: viewport,
        threshold: 0.5,
    });
    slides.forEach(slide => observer.observe(slide));
    startAutoplay(viewport, slides);
}

function startAutoplay(viewport, slides, intervalMs = 3000) {
    let current = 0;

    setInterval(() => {
        current = (current + 1) % slides.length;
        viewport.scrollTo({
            left: viewport.offsetWidth * current,
            behavior: 'smooth',
        });
    }, intervalMs);
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('carousel', 'carousel');
    await loadTemplate('photo-row', 'photo_row');

    const imageData = await fetchData('index');
    if (!imageData) return;

    const images = imageData['image-loader'][0];

    fillCarousel(document.getElementById('carousel'), images);

    document.getElementById('main_title').textContent = imageData.main_title;

    const productData = await fetchData('products');
    if (!productData) return;

    const shuffled = productData.products.sort(() => Math.random() - 0.5).slice(0, 8);

    const photos = document.querySelector('.photo_row')
    photos.innerHTML = '';
    shuffled.forEach(product => {
        photos.appendChild(createProductItem(product));
    })
});