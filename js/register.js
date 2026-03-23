document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('register-template', 'register');

    const data = await fetchData('register');
    if (!data) return false;

    const container = document.getElementById('register');

    container.querySelector('h1').textContent = data.register.title;

    data.register.fields.forEach(field => {
        const input = container.querySelector(`input[name="${field.name}"]`);
        if (!input) return false;
        const label = container.querySelector(`label[for="${field.name}"]`);
        if (label) label.firstChild.textContent = field.label + ' ';
        if (field.placeholder) input.placeholder = field.placeholder;
    });

    container.querySelector('.button').textContent = data.register.submitLabel;
    container.querySelector('a[href="login.html"]').textContent = data.register.loginLink.linkText;
    container.querySelector('.register_password_forgot').firstChild.textContent = data.register.loginLink.text;
});