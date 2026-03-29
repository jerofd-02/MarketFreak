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

// Carrousel con animaciones
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
    await loadTemplate('product-information', 'product_info');
    await loadTemplate('photo-row', 'photo_row');

    const [data, productsData] = await Promise.all([
        fetchData('product-page'),
        fetchData('products')
    ]);
    if (!data || !productsData) return;

    document.getElementById('related_title').textContent = data.ui.relatedTitle;

    const id = getProductId();
    const product = productsData.products.find(p => p.id === id);

    if (!product) {
        console.error('Producto no encontrado:', id);
        return;
    }

    document.querySelector('.user_reference a').textContent = `${product.seller}`;
    document.querySelector('.user_reference a').href = `profile.html?seller=${product.seller}`;

    const user = getLoggedUser();
    const productButtons = document.querySelector('.product_buttons');

    if (user && user.seller === product.seller) {
        productButtons.innerHTML = `
            <a class="edit_button" href="upload-product.html?id=${product.id}">Editar producto</a>
        `;
    } else {
        document.querySelector('.wishlist_button').textContent = data.ui.wishlistButton;
        document.querySelector('.buy_button').textContent = data.ui.buyButton;
        document.querySelector('.buy_button').href = `payment-page.html?id=${product.id}`;
    }

    fillProductInfo(document.getElementById('product_info'), product);
    fillCarousel(document.getElementById('carousel'), product);
    fillRelatedProducts(document.querySelector('.photo_row'), productsData.products, product);
});