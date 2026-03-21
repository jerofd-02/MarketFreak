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
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            window.location.href = `search-product.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
    });

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
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}


