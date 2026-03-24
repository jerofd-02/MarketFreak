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

    let users = [];
    try {
        const res = await fetch('../data/users.json');
        if (!res.ok) throw new Error('No se pudo cargar users.json');
        const usersData = await res.json();
        users = usersData.users;
    } catch (error) {
        console.error('Error al cargar usuarios: ', error);
    }

    const form = container.querySelector('.form_group');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = container.querySelector('input[name="email"]').value.trim();
        const passwordInput = container.querySelector('input[name="password"]').value.trim();

        if (!emailInput || !passwordInput) {
            showError(form, "Completa todos los campos");
            return;
        }

        const user = users.find(u => u.email === emailInput && u.password === passwordInput);

        if (user) {
            sessionStorage.setItem('loggedUser', JSON.stringify(user));

            window.location.href = user.redirect || 'index.html';
        } else {
            showError(form, data.login.errorMessage || 'Email o contraseña incorrectos.');
        }
    });
});