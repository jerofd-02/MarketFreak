document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();

    const params = new URLSearchParams(window.location.search);
    const seller = params.get('seller');

    const profileData = await fetchData('profile');
    if (!profileData) return false;

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

    document.getElementById('products_title').textContent = profileData.profile.productsTitle;

    const profileButton = document.querySelector('.profile-button');
    profileButton.textContent = profileData.profile.editButton.label;
    profileButton.href = profileData.profile.editButton.href;

    const addProductButton = document.querySelector('.add-product-button');
    addProductButton.querySelector('i').className = profileData.profile.addProductButton.icon;
    addProductButton.childNodes[2].textContent = `${profileData.profile.addProductButton.label}`;
    addProductButton.href = profileData.profile.addProductButton.href;

    const loggedUser = getLoggedUser();
    const isOwner = loggedUser && loggedUser.seller === seller;

    if (!isOwner) {
        profileButton.style.display = 'none';
        document.querySelector('.add-product-button').closest('.photo_item').style.display = 'none';
    }
});