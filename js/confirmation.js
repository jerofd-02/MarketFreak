document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();
    document.body.style.display = '';
    await loadCommonTemplates();

    const orderData = JSON.parse(sessionStorage.getItem('orderData'));
    if (!orderData) {
        window.location.href = 'index.html';
        return false;
    }

    const usersData = await fetchData("users");
    const seller = usersData?.users.find(u => u.seller === orderData.seller);

    const info = document.querySelector('.product_information');
    info.querySelector('h1').textContent = orderData.productName;
    const ps = info.querySelectorAll('p');
    ps[0].textContent = orderData.productPrice;
    ps[1].textContent = orderData.productCategory;
    info.querySelector('#description').textContent = orderData.productDescription;
    info.querySelector('.photo img').src = orderData.productImage;
    info.querySelector('.photo img').alt = orderData.productAlt;

    document.querySelector('.payment_method .category_title').textContent = "Método de pago";
    document.querySelector('.payment_method p:nth-child(2)').textContent = orderData.payment;

    document.querySelector('.shipment_method .category_title').textContent = "Método de envío";
    document.querySelector('.shipment_method p:nth-child(2)').textContent = orderData.shipment;

    if (seller) {
        const sellerInfo = document.querySelector('.seller_information');
        sellerInfo.querySelector('.category_title').textContent = "Información del vendedor";
        const ps = sellerInfo.querySelectorAll('p');
        ps[1].textContent = seller.name;
        ps[2].textContent = `@${seller.seller}`;
        ps[3].textContent = seller.location ?? '';
    }

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('orderData');
        window.location.href = 'index.html';
    });
});