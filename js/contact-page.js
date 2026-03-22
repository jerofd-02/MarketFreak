document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('form-style-page', 'contact_form' )

    const data = await fetchData('contact-page');
    if (!data) return;

    const field = data.form.fields;
    
    document.querySelector('label[for="field_1"]').textContent = field.email.label;
    document.querySelector('label[for="field_2"]').textContent = field.name.label;
    document.querySelector('label[for="field_3"]').textContent = field.surname.label;
    document.querySelector('label[for="field_4"]').textContent = field.problem.label;
    document.querySelector('label[for="field_5"]').textContent = field.description.label;
    
    document.querySelector('#field_1').placeholder = field.email.placeholder;
    document.querySelector('#field_2').placeholder = field.name.placeholder;
    document.querySelector('#field_3').placeholder = field.surname.placeholder;
    document.querySelector('#field_5').placeholder = field.description.placeholder;
    
    const select = document.querySelector('#field_4');
    select.innerHTML = field.problem.options
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
