const knowledgeSearch = document.querySelector("[data-knowledge-search]");

if (knowledgeSearch) {
  const cards = [...document.querySelectorAll("[data-search-card]")];
  const status = document.querySelector("[data-search-status]");
  const empty = document.querySelector("[data-search-empty]");

  const applyFilter = () => {
    const query = knowledgeSearch.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const haystack = card.dataset.searchText || card.textContent.toLowerCase();
      const matches = !query || haystack.includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (status) status.textContent = query ? `${visible} matching entries` : `${cards.length} entries available`;
    if (empty) empty.hidden = visible !== 0;
  };

  knowledgeSearch.addEventListener("input", applyFilter);
}

function prefillInquiry(button) {
  const modal = document.querySelector("[data-quote-modal]");
  if (!modal) return;
  const form = modal.querySelector("form");
  if (!form) return;

  const setSelect = (name, value) => {
    const control = form.querySelector(`select[name="${name}"]`);
    if (!control || !value) return;
    const optionExists = [...control.options].some((option) => option.value === value);
    if (optionExists) {
      control.value = value;
      control.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  setSelect("product_structure", button.dataset.structure);
  setSelect("technical_function", button.dataset.function);

  const message = form.querySelector('textarea[name="message"]');
  if (message && button.dataset.question && !message.value.trim()) {
    message.value = `I would like engineering guidance related to: ${button.dataset.question}\n\nProject capacity / voltage / application:`;
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quote-prefill]");
  if (!button) return;
  window.setTimeout(() => prefillInquiry(button), 0);
});

const query = new URLSearchParams(window.location.search);
if (query.has("knowledge")) {
  const trigger = document.querySelector("[data-quote-open]");
  trigger?.click();
  window.setTimeout(() => {
    const modal = document.querySelector("[data-quote-modal]");
    const message = modal?.querySelector('textarea[name="message"]');
    if (message && !message.value.trim()) message.value = `Knowledge topic: ${query.get("knowledge")}`;
  }, 0);
}
