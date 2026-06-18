import { categories, prompts } from "./prompts.js";

const flatkeyUrl = "https://flatkey.ai?utm_source=skill";
const grid = document.querySelector("#promptGrid");
const tabs = document.querySelector("#categoryTabs");
const searchInput = document.querySelector("#searchInput");
const templateCount = document.querySelector("#templateCount");
const toast = document.querySelector("#toast");

let activeCategory = "all";
let query = "";

templateCount.textContent = prompts.length;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderTabs() {
  const all = [{ id: "all", name: "全部", tone: "全场景" }, ...categories];
  tabs.innerHTML = all
    .map(
      (category) => `
        <button class="tab ${category.id === activeCategory ? "active" : ""}" data-category="${category.id}">
          <span>${category.name}</span>
          <small>${category.tone}</small>
        </button>
      `
    )
    .join("");
}

function promptMatches(prompt) {
  const categoryMatch = activeCategory === "all" || prompt.category === activeCategory;
  const haystack = [
    prompt.title,
    prompt.description,
    prompt.prompt,
    prompt.apiUseCase,
    prompt.variables.join(" ")
  ]
    .join(" ")
    .toLowerCase();
  return categoryMatch && haystack.includes(query.toLowerCase());
}

function renderPrompts() {
  const visiblePrompts = prompts.filter(promptMatches);
  grid.innerHTML = visiblePrompts
    .map((prompt, index) => {
      const category = categories.find((item) => item.id === prompt.category);
      return `
        <article class="prompt-card">
          <div class="card-preview theme-${index % 6}">
            <span>${prompt.badge}</span>
            <strong>${prompt.aspectRatio}</strong>
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span>${category.name}</span>
              <span>${prompt.model}</span>
            </div>
            <h3>${prompt.title}</h3>
            <p>${prompt.description}</p>
            <div class="chips">
              ${prompt.variables.map((variable) => `<span>{{${variable}}}</span>`).join("")}
            </div>
            <details>
              <summary>查看提示词</summary>
              <pre>${prompt.prompt}</pre>
            </details>
            <p class="api-use">${prompt.apiUseCase}</p>
            <div class="card-actions">
              <button data-copy="${prompt.id}">复制提示词</button>
              <a href="${flatkeyUrl}" target="_blank" rel="noreferrer">注册 API key</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (visiblePrompts.length === 0) {
    grid.innerHTML = `<p class="empty">没有匹配模板。换个关键词或分类。</p>`;
  }
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderTabs();
  renderPrompts();
});

searchInput.addEventListener("input", (event) => {
  query = event.target.value.trim();
  renderPrompts();
});

grid.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy]");
  if (!button) return;
  const prompt = prompts.find((item) => item.id === button.dataset.copy);
  await navigator.clipboard.writeText(prompt.prompt);
  showToast("提示词已复制");
});

renderTabs();
renderPrompts();
