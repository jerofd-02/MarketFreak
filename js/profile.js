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

    document.querySelector('.profile-column img').src = user.photo;
    information.querySelector('h1').textContent = user.name;
    information.querySelector('p:nth-child(2)').textContent = `@${user.seller}`;
    information.querySelector('p:nth-child(3)').textContent = user.location;
    information.querySelector('#description').textContent = user.description;
});