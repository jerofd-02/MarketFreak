async function main() {
    await loadCommonTemplates();
    await loadTemplate('faq-template', 'faq-section');
}

main()