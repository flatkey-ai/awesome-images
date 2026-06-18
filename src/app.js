import { demoPrompts } from "./demo-prompts.js";

const flatkeyUrl = "https://flatkey.ai?utm_source=skill";
const grid = document.querySelector("#promptGrid");
const searchInput = document.querySelector("#searchInput");
const templateCount = document.querySelector("#templateCount");
const toast = document.querySelector("#toast");
const promptInput = document.querySelector("#promptInput");
const apiKeyInput = document.querySelector("#apiKeyInput");
const sizeInput = document.querySelector("#sizeInput");
const generateButton = document.querySelector("#generateButton");
const saveKeyButton = document.querySelector("#saveKeyButton");
const generationResult = document.querySelector("#generationResult");

let query = "";

templateCount.textContent = demoPrompts.length;
apiKeyInput.value = localStorage.getItem("flatkey_image_api_key") || "";
promptInput.value = demoPrompts[0].prompt;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function promptMatches(item) {
  return [item.title, item.category, item.prompt].join(" ").toLowerCase().includes(query.toLowerCase());
}

function renderPrompts() {
  const visiblePrompts = demoPrompts.filter(promptMatches);
  grid.innerHTML = visiblePrompts
    .map(
      (item) => `
        <article class="prompt-card demo-card">
          <div class="demo-image-wrap">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span>${item.category}</span>
              <span>9:16</span>
            </div>
            <h3>${item.title}</h3>
            <details>
              <summary>查看提示词</summary>
              <pre>${item.prompt}</pre>
            </details>
            <div class="card-actions">
              <button data-use="${item.id}">用同款</button>
              <button data-copy="${item.id}">复制提示词</button>
              <a href="${flatkeyUrl}" target="_blank" rel="noreferrer">注册 API key</a>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  if (visiblePrompts.length === 0) {
    grid.innerHTML = `<p class="empty">没有匹配模板。换个关键词或分类。</p>`;
  }
}

searchInput.addEventListener("input", (event) => {
  query = event.target.value.trim();
  renderPrompts();
});

grid.addEventListener("click", async (event) => {
  const useButton = event.target.closest("[data-use]");
  const copyButton = event.target.closest("[data-copy]");
  if (useButton) {
    const item = demoPrompts.find((demo) => demo.id === useButton.dataset.use);
    promptInput.value = item.prompt;
    document.querySelector("#generator").scrollIntoView({ behavior: "smooth", block: "start" });
    promptInput.focus();
    showToast("已填入同款提示词");
  }
  if (copyButton) {
    const item = demoPrompts.find((demo) => demo.id === copyButton.dataset.copy);
    await navigator.clipboard.writeText(item.prompt);
    showToast("提示词已复制");
  }
});

saveKeyButton.addEventListener("click", () => {
  localStorage.setItem("flatkey_image_api_key", apiKeyInput.value.trim());
  showToast("API key 已保存到浏览器");
});

generateButton.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();
  if (!apiKey) {
    showToast("请先填写 API key");
    return;
  }
  if (!prompt) {
    showToast("请先填写提示词");
    return;
  }
  generateButton.disabled = true;
  generationResult.innerHTML = `<p>生成中...</p>`;
  try {
    const response = await fetch(`https://router.flatkey.ai/v1beta/models/nano-banana-pro-preview:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageGenerationConfig: { aspectRatio: aspectFromSize(sizeInput.value), imageSize: "1K" }
        }
      })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message || payload?.message || `HTTP ${response.status}`);
    const part = payload.candidates?.flatMap((candidate) => candidate?.content?.parts || [])
      .find((item) => item?.inlineData?.data);
    const src = part?.inlineData?.data
      ? `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`
      : "";
    generationResult.innerHTML = src
      ? `<img src="${src}" alt="Generated image" />`
      : `<pre>${JSON.stringify(payload, null, 2)}</pre>`;
    localStorage.setItem("flatkey_image_api_key", apiKey);
  } catch (error) {
    generationResult.innerHTML = `<p class="error">${error.message}</p>`;
  } finally {
    generateButton.disabled = false;
  }
});

renderPrompts();

function aspectFromSize(size) {
  const match = String(size).match(/^(\d+)x(\d+)$/);
  if (!match) return "1:1";
  const width = Number(match[1]);
  const height = Number(match[2]);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

function gcd(a, b) {
  return b ? gcd(b, a % b) : Math.abs(a);
}
