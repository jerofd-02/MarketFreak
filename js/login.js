document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('login-template', 'login');

    const data = await fetchData('login');
    if (!data) return false;

    const container = document.getElementById('login');

    container.querySelector('h1').textContent = data.login.title;

    data.login.fields.forEach(field => {
        const input = container.querySelector(`input[name="${field.name}"]`);
        if (!input) return false;
        const label = container.querySelector(`label[for="${field.name}"]`);
        if (label) label.firstChild.textContent = field.label + ' ';
        if (field.placeholder) input.placeholder = field.placeholder;
    });

    const spans = container.querySelectorAll('.register_password_forgot');

    container.querySelector('.button').textContent = data.login.submitLabel;
    spans[0].firstChild.textContent = data.login.forgotLink.text + '';
    spans[0].querySelector('a').textContent = data.login.forgotLink.linkText;
    spans[1].firstChild.textContent = data.login.registerLink.text + '';
    spans[1].querySelector('a').textContent = data.login.registerLink.linkText;
});