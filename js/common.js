// Cargar templates
async function loadTemplate(templateName, targetElementId) {
    try {
        const response = await fetch(`templates/${templateName}.html`);
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
    }
}

// Cargar las templates comunes
async function loadCommonTemplates() {
    await loadTemplate('header', 'header');
    await loadTemplate('footer', 'footer');

    const data = await fetchData('common');
    if (!data) return false;

    document.querySelector('.logo img').src = data.header.image.src;
    document.querySelector('.logo img').alt = data.header.image.alt;
    document.querySelector('.nav_bar input').placeholder = data.header.nav_bar;
    document.querySelector('.login_button').textContent = data.header.login_button.label;
    document.querySelector('.register_button').textContent = data.header.register_button.label;

    const searchInput = document.querySelector('.nav_bar input');

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) searchInput.value = decodeURIComponent(query);

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            window.location.href = `search-product.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
    });

    const user = getLoggedUser();

    const loginButton = document.querySelector('.login_button');
    const registerButton = document.querySelector('.register_button');
    const profileButton = document.querySelector('.header_profile_photo');

    if (user) {
        loginButton.style.display = 'none';

        profileButton.src = user.photo || '../images/placeholder.png';
        profileButton.style.display = 'inline-block';
        profileButton.title = user.name;

        registerButton.textContent = 'Cerrar sesión';
        registerButton.href = '#';

        registerButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        loginButton.style.display = 'inline-block';
        loginButton.textContent = 'Iniciar sesión';
        loginButton.href = 'login.html';

        registerButton.textContent = 'Registrarse';
        registerButton.href = 'register.html';

        profileButton.style.display = 'none';
    }

    const footer = document.getElementById('footer');

    data.footer.social.forEach((item, index) => {
        const items = footer.querySelectorAll('.footer_item');
        items[index].querySelector('i').className = item.icon;
        items[index].querySelector('a').textContent = item.name;
        items[index].querySelector('a').href = item.url;
    });

    const columns = footer.querySelectorAll('.column:not(:first-child)');
    data.footer.columns.forEach((column, index) => {
        columns[index].querySelector('h1').textContent = column.title;
        columns[index].querySelector('a').textContent = column.links[0].label;
        columns[index].querySelector('a').href = column.links[0].url;
    });
}

// Obtener datos del JSON
async function fetchData(jsonName) {
    try {
        const response = await fetch(`../data/${jsonName}.json`);
        const data = await response.json();

        // Si hemos creado productos en localStorage, se mezclarán con los del products.json
        if (jsonName === 'products') {
            const stored = JSON.parse(localStorage.getItem('products') || '[]');
            data.products = [...data.products, ...stored];
        }

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function getLoggedUser() {
    return JSON.parse(sessionStorage.getItem('loggedUser'));
}

function logout() {
    sessionStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
}

function requireAuth() {
    const user = getLoggedUser();
    if (!user) {
        window.location.href = 'login.html';
    }
}

function checkAuth() {
    if(!getLoggedUser()) {
        window.location.href = 'login.html';
    }
}

// Control de errores
function showError(input, message) {
    clearError(input);
    const error = document.createElement('span');
    error.classList = 'input_error';
    error.textContent = message;
    input.classList.add('input_error_active');
    input.insertAdjacentElement('afterend', error);
}

function clearError(input) {
    const existing = input.parentElement.querySelector('.input_error');
    if (existing) existing.remove();
    input.classList.remove('input_error_active');
}