const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
if (toggle && nav) {
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("submitted");
    const existing = form.querySelector(".form-message");
    if (existing) existing.remove();
    const msg = document.createElement("p");
    msg.className = "form-message";
    msg.textContent = "Inquiry captured for this website prototype. Connect the form to CRM or email before launch.";
    form.appendChild(msg);
  });
});
