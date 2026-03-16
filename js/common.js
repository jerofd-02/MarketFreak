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
}

