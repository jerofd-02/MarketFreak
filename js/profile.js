document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('photo-row', 'products');
    await loadTemplate('product-information', 'information');
});