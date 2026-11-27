/* FridayFinds — one clear job: turning deals into HTML (list cards and detail pages). */
import { money, discountPct, saved, checkedLabel, verdictLabel } from "./format.js";
import { bestDeals } from "./filters.js";

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function dealCard(d) {
  const pct = discountPct(d);
  return `<article class="card">
    <div class="card-top">
      <span class="store">${esc(d.store)}</span>
      <span class="cat">${esc(d.category)}</span>
    </div>
    <h3 class="card-title"><a href="#/deal/${esc(d.id)}">${esc(d.title)}</a></h3>
    <p class="price-row">
      <span class="price">${money(d.price)}</span>
      <span class="was">${money(d.was)}</span>
      <span class="off">−${pct}%</span>
    </p>
    <p class="save-line">You save ${money(saved(d))}</p>
    <p class="verdict verdict-${esc(d.verdict)}">${verdictLabel(d.verdict)}</p>
    <p class="meta">Checked ${checkedLabel(d.checked)} · ${esc(d.source)}</p>
    <div class="card-actions">
      <a class="btn" href="#/deal/${esc(d.id)}">Details</a>
      <a class="btn btn-store" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} ↗</a>
    </div>
  </article>`;
}

export function renderList(root, deals, total) {
  if (deals.length === 0) {
    root.innerHTML = `<div class="empty"><h2>No deals match those filters</h2>
      <p>Try clearing a filter or searching for something else — every deal here was checked by hand, so the list only shows what really is on sale.</p></div>`;
    return;
  }
  const best = bestDeals(deals, 3);
  const bestIds = new Set(best.map((d) => d.id));
  const rest = deals.filter((d) => !bestIds.has(d.id));
  root.innerHTML = `
    <section aria-label="Top picks">
      <h2 class="section-title">Top picks — best verdicts first</h2>
      <div class="grid grid-top">${best.map(dealCard).join("")}</div>
    </section>
    ${rest.length ? `<section aria-label="All matching deals">
      <h2 class="section-title">All matching deals (${rest.length})</h2>
      <div class="grid">${rest.map(dealCard).join("")}</div>
    </section>` : ""}
    <p class="count-line">Showing ${deals.length} of ${total} checked deals.</p>`;
}

export function renderDetail(root, deal, all) {
  const pct = discountPct(deal);
  const siblings = all.filter((d) => d.category === deal.category && d.id !== deal.id).slice(0, 3);
  root.innerHTML = `<article class="detail">
    <p><a class="back" href="#/">← All deals</a></p>
    <div class="card-top">
      <span class="store">${esc(deal.store)}</span>
      <span class="cat">${esc(deal.category)}</span>
    </div>
    <h2 class="detail-title">${esc(deal.title)}</h2>
    <p class="price-row price-row-big">
      <span class="price">${money(deal.price)}</span>
      <span class="was">${money(deal.was)}</span>
      <span class="off">−${pct}%</span>
    </p>
    <p class="save-line">You save ${money(saved(deal))} off the usual price of ${money(deal.was)}.</p>
    <div class="verdict-box verdict-${esc(deal.verdict)}">
      <strong>Verdict: ${verdictLabel(deal.verdict)}</strong>
      <p>${esc(deal.evidence)}</p>
    </div>
    ${deal.note ? `<p class="note"><strong>Good to know:</strong> ${esc(deal.note)}</p>` : ""}
    <dl class="facts">
      <div><dt>Store</dt><dd>${esc(deal.store)}</dd></div>
      <div><dt>Category</dt><dd>${esc(deal.category)}</dd></div>
      <div><dt>Price checked</dt><dd>${checkedLabel(deal.checked)}</dd></div>
      <div><dt>Price read at</dt><dd>${esc(deal.source)}</dd></div>
    </dl>
    <p><a class="btn btn-store btn-big" href="${esc(deal.url)}" target="_blank" rel="noopener">Buy at ${esc(deal.store)} ↗</a></p>
    <p class="meta">Prices change fast on Black Friday — confirm the price at the store before you buy.</p>
    ${siblings.length ? `<h3 class="section-title">More ${esc(deal.category)} deals</h3>
    <div class="grid">${siblings.map(dealCard).join("")}</div>` : ""}
  </article>`;
}

export function renderNotFound(root, id) {
  root.innerHTML = `<div class="empty"><h2>Deal not found</h2>
    <p>There is no deal with the address “${esc(id)}”. <a href="#/">Back to all deals</a>.</p></div>`;
}
