document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('form-style-page', 'upload_form')

    const data = await fetchData('upload-product');
    if (!data) return;

    const field = data.form.fields;

    document.querySelector('#field_2').type = 'number';
    document.querySelector('#field_2').min = '0';
    document.querySelector('#field_2').step = '0.01';

    document.querySelector('#field_3').closest('.element').remove();

    document.querySelector('label[for="field_1"]').textContent = field.product_name.label;
    document.querySelector('label[for="field_2"]').textContent = field.price.label;
    document.querySelector('label[for="field_4"]').textContent = field.category.label;
    document.querySelector('label[for="field_5"]').textContent = field.description.label;

    document.querySelector('#field_1').placeholder = field.product_name.placeholder;
    document.querySelector('#field_2').placeholder = field.price.placeholder;
    document.querySelector('#field_5').placeholder = field.description.placeholder;

    const select = document.querySelector('#field_4');
    select.innerHTML = field.category.options
        .map(o => `<option value="${o.value}" ${o.disabled ? 'disabled selected' : ''}>${o.label}</option>`)
        .join('');

    document.querySelector('.form_group .button').textContent = data.form.submitButton;

    // Preview de imágenes
    const fileInput = document.getElementById('file_input');
    const preview = document.getElementById('file_preview');

    fileInput.addEventListener('change', () => {
        preview.innerHTML = '';

        Array.from(fileInput.files).forEach((file, i) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'preview_item';
                wrapper.innerHTML = `
                    <img src="${e.target.result}" alt="Imagen ${i + 1}">
                    <button type="button" class="remove_btn" data-index="${i}">✕</button>
                `;
                preview.appendChild(wrapper);
            };

            reader.readAsDataURL(file);
        });
    });

    preview.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove_btn')) {
            e.target.closest('.preview_item').remove();
        }
    });

    document.querySelector('.form_group').addEventListener('submit', (e) => {
        e.preventDefault();

        const previews = preview.querySelectorAll('.preview_item');
        if (previews.length === 0) {
            alert('Debes subir al menos una imagen.');
            return;
        }

        const product = {
            id: Date.now(), // Sugerencia: El id a futuro podría ser según la hora concreta de subida
            name: document.querySelector('#field_1').value.trim(),
            price: parseFloat(document.querySelector('#field_2').value).toFixed(2).replace('.', ',') + '€',
            category: document.querySelector('#field_4').options[document.querySelector('#field_4').selectedIndex].text,
            description: document.querySelector('#field_5').value.trim(),
            images: Array.from(previews).map(item => item.querySelector('img').src),
            image: previews[0].querySelector('img').src,
            dateAdded: new Date().toISOString().split('T')[0],
            seller: (getLoggedUser().seller).toString(),
            alt: document.querySelector('#field_1').value.trim()
        };

        if (!product.name || !product.price || !product.description) {
            alert('Por favor rellena todos los campos.');
            return;
        }

        if (isNaN(parseFloat(product.price)) || parseFloat(product.price) < 0) {
            alert('El precio debe ser un número válido.');
            return;
        }

        const stored = JSON.parse(localStorage.getItem('products') || '[]');
        stored.push(product);
        localStorage.setItem('products', JSON.stringify(stored));

        window.location.href = `product-page.html?id=${product.id}`;
    });

});