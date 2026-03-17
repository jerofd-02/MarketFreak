async function main() {
    await loadCommonTemplates();
    await loadTemplate('payment-confirmation', 'payment');
}

main()