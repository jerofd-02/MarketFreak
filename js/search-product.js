async function main() {
    await loadCommonTemplates();
    await loadTemplate('photo-row', 'photo_row')
}

main()