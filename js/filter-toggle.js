document.addEventListener('DOMContentLoaded', () => {

    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const btn = document.createElement('button');
    btn.className = 'filter_toggle_btn';
    btn.innerHTML = '<span>Filtros</span><span class="btn_icon">&#9660;</span>';
    sidebar.parentElement.insertBefore(btn, sidebar);

    btn.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', false);
        }
    });
});