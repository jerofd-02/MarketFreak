document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('photo-row', 'photo_row')

    const data = await fetchData('wishlist');
    if (!data) return;
    
    document.querySelector('.wish_bar input').placeholder = data.searchPlaceholder;

    const select = document.querySelector('#opciones');
    select.innerHTML = data.sortOptions
        .map(option => `<option value="${option.value}">${option.label}</option>`)
        .join('');
});