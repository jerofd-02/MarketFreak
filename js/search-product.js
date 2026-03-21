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

    const data = await fetchData('products');
    if (!data) return;

    const row = document.querySelector('.photo_row');

    // Limpieza de los photo_item
    row.innerHTML = '';

    // Leeemos el parámetro de la query
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q')?.toLowerCase().trim() || '';

    // Filtramos si existe query, en caso contrario mostraremos todos
    const results = query
        ? data.products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.seller.toLowerCase().includes(query)
        )
        : data.products;

    if (results.length === 0) {
        row.innerHTML = `<p class="no_results">No se encontraron resultados para "<strong>${query}</strong>"</p>`;
        return;
    }

    // Generamos un anuncio para cada resultado obtenido
    results.forEach(product => {
        row.appendChild(createProductItem(product));
    });
});