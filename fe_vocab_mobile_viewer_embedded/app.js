const statusEl = document.getElementById("status");
const searchInput = document.getElementById("searchInput");
const fieldFilter = document.getElementById("fieldFilter");
const cardModeBtn = document.getElementById("cardModeBtn");
const listModeBtn = document.getElementById("listModeBtn");
const cardMode = document.getElementById("cardMode");
const listMode = document.getElementById("listMode");
const termCard = document.getElementById("termCard");
const termList = document.getElementById("termList");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const counter = document.getElementById("counter");

let rows = [];
let filtered = [];
let currentIndex = 0;

const columnMap = {
  term: ["用語", "語句", "単語", "term", "word"],
  field: ["分野", "category", "field"],
  short: ["一言説明", "短い説明", "概要", "summary"],
  detail: ["詳細説明", "説明", "detail", "description"],
  related: ["関連語", "関連", "related"],
  importance: ["重要度", "importance"]
};

document.addEventListener("DOMContentLoaded", () => {
  const parsed = parseCSV(window.FE_CSV_TEXT || "");
  rows = normalizeRows(parsed);
  filtered = rows;
  currentIndex = 0;
  buildFieldFilter();
  applyFilters();
  statusEl.textContent = `${rows.length}語を読み込み済み`;
});

searchInput.addEventListener("input", applyFilters);
fieldFilter.addEventListener("change", applyFilters);
prevBtn.addEventListener("click", prevCard);
nextBtn.addEventListener("click", nextCard);
cardModeBtn.addEventListener("click", () => setMode("card"));
listModeBtn.addEventListener("click", () => setMode("list"));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevCard();
  if (e.key === "ArrowRight") nextCard();
});

let touchStartX = 0;
let touchStartY = 0;
termCard.addEventListener("touchstart", (e) => {
  const t = e.changedTouches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

termCard.addEventListener("touchend", (e) => {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0) nextCard();
    else prevCard();
  }
}, { passive: true });

function parseCSV(text) {
  text = text.replace(/^\uFEFF/, "");
  const result = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell);
      if (row.some(v => v.trim() !== "")) result.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some(v => v.trim() !== "")) result.push(row);
  if (result.length === 0) return [];
  const headers = result[0].map(h => h.trim());
  return result.slice(1).map(values => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = (values[i] ?? "").trim());
    return obj;
  });
}

function pick(row, names) {
  const key = names.find(name => Object.prototype.hasOwnProperty.call(row, name));
  return key ? String(row[key] ?? "").trim() : "";
}

function normalizeRows(rawRows) {
  return rawRows.map(row => ({
    term: pick(row, columnMap.term),
    field: pick(row, columnMap.field),
    short: pick(row, columnMap.short),
    detail: pick(row, columnMap.detail),
    related: pick(row, columnMap.related),
    importance: pick(row, columnMap.importance)
  })).filter(row => row.term);
}

function buildFieldFilter() {
  const fields = [...new Set(rows.map(r => r.field).filter(Boolean))].sort();
  fieldFilter.innerHTML = `<option value="">すべての分野</option>`;
  fields.forEach(field => {
    const option = document.createElement("option");
    option.value = field;
    option.textContent = field;
    fieldFilter.appendChild(option);
  });
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const field = fieldFilter.value;
  filtered = rows.filter(row => {
    const text = Object.values(row).join(" ").toLowerCase();
    return (!q || text.includes(q)) && (!field || row.field === field);
  });
  currentIndex = Math.min(currentIndex, Math.max(filtered.length - 1, 0));
  renderCard();
  renderList();
}

function renderCard() {
  if (filtered.length === 0) {
    termCard.innerHTML = `<p class="empty">該当する用語がありません。</p>`;
    counter.textContent = `0 / 0`;
    return;
  }
  const row = filtered[currentIndex];
  const relatedItems = splitRelated(row.related);
  termCard.innerHTML = `
    <h1 class="term-title">${escapeHTML(row.term)}</h1>
    <div class="meta-row">
      ${row.field ? `<span class="badge">${escapeHTML(row.field)}</span>` : ""}
      ${row.importance ? `<span class="badge">重要度 ${escapeHTML(row.importance)}</span>` : ""}
    </div>
    ${section("一言説明", row.short)}
    ${section("詳細説明", row.detail)}
    ${relatedItems.length ? `<section class="section"><h2>関連語</h2><div class="related">${relatedItems.map(v => `<span>${escapeHTML(v)}</span>`).join("")}</div></section>` : ""}
  `;
  counter.textContent = `${currentIndex + 1} / ${filtered.length}`;
}

function renderList() {
  termList.innerHTML = "";
  filtered.forEach((row, index) => {
    const button = document.createElement("button");
    button.className = "list-item";
    button.innerHTML = `<div class="list-title">${escapeHTML(row.term)}</div><div class="list-sub">${escapeHTML(row.short || row.detail || row.field || "")}</div>`;
    button.addEventListener("click", () => {
      currentIndex = index;
      setMode("card");
      renderCard();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    termList.appendChild(button);
  });
}

function section(title, value) {
  if (!value) return "";
  return `<section class="section"><h2>${escapeHTML(title)}</h2><p>${escapeHTML(value)}</p></section>`;
}

function splitRelated(value) {
  if (!value) return [];
  return value.split(/[;；,、]/).map(v => v.trim()).filter(Boolean);
}

function nextCard() {
  if (filtered.length === 0) return;
  currentIndex = (currentIndex + 1) % filtered.length;
  renderCard();
}

function prevCard() {
  if (filtered.length === 0) return;
  currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
  renderCard();
}

function setMode(mode) {
  const isCard = mode === "card";
  cardMode.classList.toggle("hidden", !isCard);
  listMode.classList.toggle("hidden", isCard);
  cardModeBtn.classList.toggle("active", isCard);
  listModeBtn.classList.toggle("active", !isCard);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
