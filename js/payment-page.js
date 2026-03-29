function fillOptions(container, name, title, options) {
    container.querySelector('.category_title').textContent = title;

    container.querySelectorAll('.checkbox_item').forEach(el => el.remove());

    options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'checkbox_item';
        div.innerHTML = `
            <input type="radio" name="${name}" id="${option.id}" value="${option.value}">
            <label for="${option.id}">${option.label}</label>
        `;
        container.appendChild(div);
    });
}

function fillProductInfo(container, product) {
    container.querySelector('h1').textContent = product.name;
    const paragraphs = container.querySelectorAll('p');
    paragraphs[0].textContent = product.price;
    paragraphs[1].textContent = product.category;
    container.querySelector('#description').textContent = product.description;
    container.querySelector('.photo img').src = product.image;
    container.querySelector('.photo img').alt = product.alt;
}

document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();
    document.body.style.display = '';
    await loadCommonTemplates();
    await loadTemplate('payment-confirmation', 'payment');

    const [pageData, productsData] = await Promise.all([
        fetchData('payment-page'),
        fetchData('products')
    ]);
    if (!pageData || !productsData) return;

    const {paymentMethods, shipmentMethods, submitButton} = pageData.payment;

    const id = parseInt(new URLSearchParams(window.location.search).get('id'));
    const product = productsData.products.find(p => p.id === id);

    if (product) {
        fillProductInfo(document.querySelector('.product_information'), product);
    }

    fillOptions(document.querySelector('.payment_method'), 'payment', paymentMethods.title, paymentMethods.options);
    fillOptions(document.querySelector('.shipment_method'), 'shipment', shipmentMethods.title, shipmentMethods.options);

    document.querySelector('.confirm_button').textContent = submitButton;

    document.querySelector("form").addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        const selectedShipment = document.querySelector('input[name="shipment"]:checked');

        if (!selectedPayment || !selectedShipment) {
            alert('Por favor selecciona un método de pago y de envío.');
            return false;
        }

        sessionStorage.setItem('orderData', JSON.stringify({
            productId: id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image,
            productAlt: product.alt,
            productDescription: product.description,
            productCategory: product.category,
            payment: document.querySelector(`label[for="${selectedPayment.id}"]`).textContent,
            shipment: document.querySelector(`label[for="${selectedShipment.id}"]`).textContent,
            seller: product.seller
        }));

        window.location.href = "confirmation.html"
    })
});