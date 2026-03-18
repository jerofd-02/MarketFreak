document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('carousel', 'section');
    await loadTemplate('photo-row', 'photo_row');
});