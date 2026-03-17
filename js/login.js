async function main() {
    await loadCommonTemplates();
    await loadTemplate('login-template', 'login');
}

main()