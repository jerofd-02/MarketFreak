async function main() {
    await loadCommonTemplates();
    await loadTemplate('carousel', 'section');
    await loadTemplate('photo-row', 'photo_row');
}

main()