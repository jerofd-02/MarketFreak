document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('form-style-page', 'upload_form')

    const data = await fetchData('upload-product');
    if (!data) return;

    const field = data.form.fields;

    document.querySelector('#field_2').type = 'number';
    document.querySelector('#field_2').min = '0';
    document.querySelector('#field_2').step = '0.01';

    document.querySelector('#field_3').closest('.element').style.display = 'none';

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
});