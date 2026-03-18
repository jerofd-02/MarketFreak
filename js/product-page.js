document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('carousel', 'carousel');
    await loadTemplate('product-information', 'product_info')
    await loadTemplate('photo-row', 'photo_row')
});