document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();
    document.body.style.display = '';
    await loadCommonTemplates();

    const data = await fetchData('update-profile');
    if (!data) return false;

    const form = document.querySelector('.form_group');
    const fields = data.updateProfile.fields;

    const fileLabel = form.querySelector('label');
    fileLabel.textContent = fields[0].label;

    const elements = form.querySelectorAll('.element');

    elements.forEach((element, index) => {
        const field = fields[index + 1];
        element.querySelector('label').textContent = field.label;

        if (field.type === 'select') {
            const select = element.querySelector('select');
            select.innerHTML = field.options.map(opt =>
                `<option value="${opt.value}">${opt.label}</option>`
            ).join('');
        } else {
            element.querySelector('input', 'textarea').placeholder = field.placeholder;
        }
    });

    form.querySelector('.button').textContent = data.updateProfile.submitLabel;
});