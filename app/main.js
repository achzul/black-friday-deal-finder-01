/* FridayFinds — one clear job: boot the app, wire the controls, route hash pages. */
import { deals } from "./data.js";
import { applyFilters, applySort, uniqueValues } from "./filters.js";
import { renderList, renderDetail, renderNotFound } from "./views.js";

const root = document.getElementById("app");
const q = document.getElementById("q");
const sortSel = document.getElementById("sort");
const catSel = document.getElementById("category");
const storeSel = document.getElementById("store");
const minoffSel = document.getElementById("minoff");
const onlyReal = document.getElementById("only-real");
const clearBtn = document.getElementById("clear");
const stats = document.getElementById("stats");
const controls = document.querySelector(".controls");

function fillSelect(sel, values) {
  for (const v of values) {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  }
}
fillSelect(catSel, uniqueValues(deals, "category"));
fillSelect(storeSel, uniqueValues(deals, "store"));

// A filter link can pre-set the controls, e.g. ?category=Audio&minoff=50 — handy for
// sharing a slice of the board, and the same state the controls themselves produce.
const params = new URLSearchParams(location.search);
if (params.get("q")) q.value = params.get("q");
if (params.get("category") && [...catSel.options].some((o) => o.value === params.get("category"))) {
  catSel.value = params.get("category");
}
if (params.get("store") && [...storeSel.options].some((o) => o.value === params.get("store"))) {
  storeSel.value = params.get("store");
}
if (["0", "25", "40", "50", "60"].includes(params.get("minoff") || "")) minoffSel.value = params.get("minoff");
if (["discount", "savings", "price-asc", "price-desc", "verdict"].includes(params.get("sort") || "")) {
  sortSel.value = params.get("sort");
}
if (params.get("onlyReal") === "1") onlyReal.checked = true;

function readFilters() {
  return {
    q: q.value,
    category: catSel.value,
    store: storeSel.value,
    minoff: Number(minoffSel.value),
    onlyReal: onlyReal.checked,
    sort: sortSel.value,
  };
}

function render() {
  const hash = location.hash || "#/";
  const match = hash.match(/^#\/deal\/([\w-]+)$/);
  if (match) {
    controls.style.display = "none";
    const deal = deals.find((d) => d.id === match[1]);
    if (deal) renderDetail(root, deal, deals);
    else renderNotFound(root, match[1]);
    window.scrollTo(0, 0);
    return;
  }
  controls.style.display = "";
  const f = readFilters();
  const filtered = applySort(applyFilters(deals, f), f.sort);
  stats.textContent =
    `${filtered.length} of ${deals.length} deals · checked 27 Nov 2026 · ` +
    `prices in USD, verify at the store before you buy`;
  renderList(root, filtered, deals.length);
}

for (const el of [q, sortSel, catSel, storeSel, minoffSel, onlyReal]) {
  el.addEventListener("input", render);
}
clearBtn.addEventListener("click", () => {
  q.value = "";
  sortSel.value = "discount";
  catSel.value = "";
  storeSel.value = "";
  minoffSel.value = "0";
  onlyReal.checked = false;
  render();
});
window.addEventListener("hashchange", render);
render();
