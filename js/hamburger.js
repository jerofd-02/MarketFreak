document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.createElement("button");
    hamburger.classList.add("hamburger_btn");
    hamburger.setAttribute("aria-label", "Abrir menú");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';

    const overlay = document.createElement("div");
    overlay.classList.add("menu_overlay");

    const mobileMenu = document.createElement("nav");
    mobileMenu.classList.add("mobile_menu");
    mobileMenu.innerHTML = `
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="login.html">Iniciar sesión</a></li>
            <li><a href="register.html">Registrarse</a></li>
        </ul>
    `;

    const observer = new MutationObserver(() => {
        const registrationDiv = document.querySelector(".registration_login");
        if (registrationDiv) {
            observer.disconnect();
            registrationDiv.prepend(hamburger);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.body.appendChild(overlay);
    document.body.appendChild(mobileMenu);

    function openMenu() {
        mobileMenu.classList.add("open");
        overlay.classList.add("visible");
        hamburger.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
        hamburger.querySelector("i").classList.replace("fa-bars", "fa-times");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        mobileMenu.classList.remove("open");
        overlay.classList.remove("visible");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.querySelector("i").classList.replace("fa-times", "fa-bars");
        document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("open");
        isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });
});