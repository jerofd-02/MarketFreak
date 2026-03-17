async function main() {
    await loadCommonTemplates();
    await loadTemplate('register-template', 'register');
}

main()