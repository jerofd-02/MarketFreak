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

    const params = new URLSearchParams(window.location.search);
    const seller = params.get('seller');

    const productsData = await fetchData('products');
    if (!productsData) return false;

    const sellerProducts = productsData.products.filter(p => p.seller === seller);
    const container = document.getElementById('products');

    sellerProducts.forEach(product => {
        container.appendChild(createProductItem(product));
    });

    await loadTemplate('product-information', 'information');

    const usersData = await fetchData('users');
    if (!usersData) return false;

    const user = usersData.users.find(u => u.seller === seller);
    const information = document.getElementById('information');

    information.querySelector('h1').textContent = user.name;
    information.querySelector('p:nth-child(2)').textContent = `@${user.seller}`;
    information.querySelector('p:nth-child(3)').textContent = user.location;
    information.querySelector('#description').textContent = user.description;
});