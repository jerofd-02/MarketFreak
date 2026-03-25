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

    const nameInput = container.querySelector('input[name="name"]');
    const usernameInput = container.querySelector('input[name="username"]');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const passwordConfirmInput = container.querySelector('input[name="password_confirm"]');

    container.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        [nameInput, usernameInput, emailInput, passwordInput, passwordConfirmInput].forEach(clearError);

        let valid = true;

        if (!nameInput.value.trim()) {
            showError(nameInput, "El nombre es obligatorio.");
            valid = false;
        }

        if (!usernameInput.value.trim()) {
            showError(usernameInput, "El nombre de usuario es obligatorio.")
            valid = false;
        }

        if (!emailInput.value.trim()) {
            showError(emailInput, "El email es obligatorio.");
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            showError(emailInput, "El email no es válido.");
            valid = false;
        }

        if (!passwordInput.value.trim()) {
            showError(passwordInput, "La contraseña es obligatoria.");
            valid = false;
        } else if (!passwordInput.value.trim() || !passwordConfirmInput.value.trim()) {
            showError(passwordInput, "La contraseña debe tener al menos 8 caracteres.");
            valid = false;
        }

        if (!passwordConfirmInput.value.trim()) {
            showError(passwordConfirmInput, "Confirma tu contraseña.");
            valid = false;
        } else if (passwordInput.value.trim() !== passwordConfirmInput.value.trim()) {
            showError(passwordConfirmInput, "Las contraseñas no coinciden.");
            valid = false;
        }

        if (!valid) return false;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === emailInput.value.trim())) {
            showError(emailInput, "Ya existe una cuenta con ese email.");
            return false;
        }

        if (users.some(u => u.seller === usernameInput.value.trim())) {
            showError(usernameInput, "Ese nombre de usuario ya existe.");
            return false;
        }

        const newUser = {
            seller: usernameInput.value.trim(),
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
            photo: '../images/placeholder_image.png',
            location: '',
            description: '',
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        sessionStorage.setItem('loggedUser', JSON.stringify(users));
        window.location.href = 'index.html';
    })
});