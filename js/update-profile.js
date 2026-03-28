document.addEventListener("DOMContentLoaded", async () => {
    requireAuth();
    document.body.style.display = "";
    await loadCommonTemplates();

    const data = await fetchData("update-profile");
    if (!data) return false;

    const form = document.querySelector(".form_group");
    const fields = data.updateProfile.fields;

    const fileLabel = form.querySelector("label");
    fileLabel.textContent = fields[0].label;

    const avatarInput = document.getElementById("avatar");
    const avatarPreview = document.querySelector(".avatar-preview");
    const avatarIcon = document.querySelector(".add-photo i");
    const avatarText = document.querySelector(".add-photo p");

    avatarText.textContent = fields[0].placeholder ?? "Arrastra tu foto aquí o haz clic para seleccionar";
    avatarIcon.className = 'fas fa-cloud-upload';

    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0];
        if (!file) return false;

        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa">`;
            avatarIcon.style.display = 'none';
            avatarText.textContent = file.name;
        };
        reader.readAsDataURL(file);
    });

    const elements = form.querySelectorAll(".element");
    elements.forEach((element, index) => {
        const field = fields[index + 1];
        element.querySelector("label").textContent = field.label;

        if (field.type === "select") {
            const select = element.querySelector("select");
            select.innerHTML = field.options.map(opt =>
                `<option value="${opt.value}">${opt.label}</option>`
            ).join('');
        } else if (field.type === "textarea") {
            const textarea = element.querySelector("textarea");
            textarea.placeholder = field.placeholder;
        } else {
            const input = element.querySelector("input");
            input.placeholder = field.placeholder ?? "";

            if (field.value) input.value = field.value;
            if (field.readonly) input.setAttribute("readonly", true);
        }
    });

    form.querySelector(".button").textContent = data.updateProfile.submitLabel;
});