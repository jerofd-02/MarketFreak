document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('faq-template', 'faq-section');

    const data = await fetchData('faq');
    if (!data) return false;

    const container = document.getElementById('faq-section');

    const h1s = container.querySelectorAll('h1');
    const ps = container.querySelectorAll('p');

    data.faq.items.forEach((item, index) => {
        if (h1s[index]) h1s[index].textContent = item.question;
        if (ps[index]) ps[index].textContent = item.answer;
    });
});