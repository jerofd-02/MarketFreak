async function main() {
    await loadCommonTemplates();
    await loadTemplate('photo-row', 'products');
    await loadTemplate('product-information', 'information');
}

main()