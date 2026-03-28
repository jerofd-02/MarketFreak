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
    requireAuth();
    document.body.style.display = '';
    await loadCommonTemplates();
    await loadTemplate('photo-row', 'photo_row');

    const data = await fetchData('wishlist');
    const productsData = await fetchData('products');
    if (!data || !productsData) return;

    document.querySelector('.wish_bar input').placeholder = data.searchPlaceholder;

    const select = document.querySelector('#opciones');
    select.innerHTML = data.sortOptions
        .map(option => `<option value="${option.value}">${option.label}</option>`)
        .join('');

    const currentSeller = getLoggedUser().seller;
    const userWishlist = data.wishlists.find(w => w.seller === currentSeller);
    const row = document.querySelector('.photo_row');
    row.innerHTML = '';

    if (userWishlist.products.length === 0) {
        row.innerHTML = '<p>Tu wishlist está vacía.</p>';
        return;
    }

    let wishlistProducts = productsData.products
        .filter(p => userWishlist.products.some(wp => wp.id === p.id) && p.seller !== currentSeller)
        .map(p => ({
            ...p,
            wishlistDate: userWishlist.products.find(wp => wp.id === p.id).dateAdded
        }));

    function renderProducts(products) {
        row.innerHTML = '';
        if (products.length === 0) {
            row.innerHTML = '<p>Tu wishlist está vacía.</p>';
            return;
        }
        products.forEach(product => row.appendChild(createProductItem(product)));
    }

    renderProducts(wishlistProducts);

    select.addEventListener('change', () => {
        let sorted = [...wishlistProducts];

        if (select.value === 'price_asc') {
            sorted.sort((a, b) => parseFloat(a.price.replace(',', '.')) - parseFloat(b.price.replace(',', '.')));
        } else if (select.value === 'price_desc') {
            sorted.sort((a, b) => parseFloat(b.price.replace(',', '.')) - parseFloat(a.price.replace(',', '.')));
        } else if (select.value === 'date_asc') {
            sorted.sort((a, b) => new Date(a.wishlistDate) - new Date(b.wishlistDate));
        } else if (select.value === 'date_desc') {
            sorted.sort((a, b) => new Date(b.wishlistDate) - new Date(a.wishlistDate));
        }

        renderProducts(sorted);
    });
});