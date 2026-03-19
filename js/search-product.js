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
    await loadTemplate('photo-row', 'photo_row')

    const data = await fetchData('search-product');
    if (!data) return;

    const row = document.querySelector('.photo_row');

    // Limpieza de los photo_item
    row.innerHTML = '';

    // Generamos un anuncio para cada producto definido en el JSON
    data.products.forEach(product => {
        row.appendChild(createProductItem(product));
    });
});