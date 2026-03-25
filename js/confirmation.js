document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();
    document.body.style.display = '';
    await loadCommonTemplates();
});