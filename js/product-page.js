// Obtenemos el id de la URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Rellenamos la template de información
function fillProductInfo(container, product) {
    container.querySelector('h1').textContent = product.name;
    const paragraphs = container.querySelectorAll('p');
    paragraphs[0].textContent = product.price;
    paragraphs[1].textContent = product.category ?? '';
    container.querySelector('#description').textContent = product.description;
}

// Rellenamos el carrusel con las imagenes
function fillCarousel(container, product) {
    const slides = container.querySelectorAll('.carousel_slide');
    const navButtons = container.querySelectorAll('.carousel_navigation-button');

    product.images.forEach((imgSrc, i) => {
        if (!slides[i]) return;
        slides[i].querySelector('img').src = imgSrc;
        slides[i].querySelector('img').alt = product.alt;
    });
}

// Rellenamos los otros productos del vendedor
function fillRelatedProducts(container, products, currentProduct) {
    container.innerHTML = '';
    products
        .filter(p => p.id !== currentProduct.id && p.seller === currentProduct.seller)
        .slice(0, 4)
        .forEach(product => {
            const item = document.createElement('div');
            item.className = 'photo_item';
            item.innerHTML = `
        <a href="product-page.html?id=${product.id}" class="img">
          <img src="${product.image}" alt="${product.alt}">
        </a>
        <p class="text_element">${product.name}</p>
        <p class="price_element">${product.price}</p>
      `;
            container.appendChild(item);
        });

    // Si no hay productos relacionados mostramos un mensaje que lo indique
    if (container.innerHTML === '') {
        container.innerHTML = '<p>Esto está un poco vacío...</p>';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('carousel', 'carousel');
    await loadTemplate('product-information', 'product_info')
    await loadTemplate('photo-row', 'photo_row')

    const data = await fetchData('product-page');
    if (!data) return;

    document.querySelector('.wishlist_button').textContent = data.ui.wishlistButton;
    document.querySelector('.buy_button').textContent = data.ui.buyButton;
    document.getElementById('related_title').textContent = data.ui.relatedTitle;

    const productsData = await fetchData('products');
    if (!productsData) return;

    const id = getProductId();
    const product = productsData.products.find(p => p.id === id);

    if (!product) {
        console.error('Producto no encontrado:', id);
        return;
    }

    document.querySelector('.user_reference a').textContent = `@${product.seller}`;
    document.querySelector('.user_reference a').href = `profile.html?seller=${product.seller}`;

    fillProductInfo(document.getElementById('product_info'), product);
    fillCarousel(document.getElementById('carousel'), product);
    fillRelatedProducts(document.querySelector('.photo_row'), productsData.products, product);
});