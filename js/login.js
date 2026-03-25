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

    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    users = [...users, ...localUsers];

    const form = container.querySelector('.form_group');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value.trim();

        let valid = true;

        if (!emailVal) {
            showError(emailInput, "El email es obligatorio.");
            valid = false;
        }
        if (!passwordVal) {
            showError(passwordInput, "La contraseña es obligatoria.");
            valid = false;
        } else if (passwordVal.length < 8) {
            showError(passwordInput, "La contraseña debe tener al menos 8 caracteres.");
            valid = false;
        }

        if (!valid) return false;

        const user = users.find(u => u.email === emailVal && u.password === passwordVal);

        if (user) {
            sessionStorage.setItem('loggedUser', JSON.stringify(user));

            window.location.href = user.redirect || 'index.html';
        } else {
            showError(passwordInput, "Email o contraseña incorrectos.");
        }
    });
});