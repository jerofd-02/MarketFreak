function fillCarousel(container, product) {
    const slides = container.querySelectorAll('.carousel_slide');
    const navButtons = container.querySelectorAll('.carousel_navigation-button');

    product.images.forEach((imgSrc, i) => {
        if (!slides[i]) return;
        slides[i].querySelector('img').src = imgSrc;
        slides[i].querySelector('img').alt = product.alt;
    });
}

function createProductItem(product) {
    const div = document.createElement('div');
    div.className = 'photo_item';

    div.innerHTML = `
        <a href="product-page.html?id=${product.id}" class="img">
          <img src="${product.image}" alt="${product.alt}">
        </a>
        <p class="text_element">${product.name}</p>
        <p class="price_element">${product.price}</p>
    `;

    return div;
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

    const shuffled = productData.products.sort(() => Math.random() - 0.5).slice(0, 4);

    const photos = document.querySelector('.photo_row')
    photos.innerHTML = '';
    shuffled.forEach(product => {
        photos.appendChild(createProductItem(product));
    })
});