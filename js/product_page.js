async function main() {
    await loadCommonTemplates();
    await loadTemplate('carousel', 'carousel');
    await loadTemplate('product_information', 'product_info')
    await loadTemplate('photo_row', 'photo_row')
}

main()