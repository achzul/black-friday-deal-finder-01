/* FridayFinds — one clear job: searching, filtering and sorting the deal list. */
import { discountPct, saved } from "./format.js";

export const VERDICT_RANK = { "new-low": 0, strong: 1, routine: 2, inflated: 3 };

export function uniqueValues(deals, key) {
  return [...new Set(deals.map((d) => d[key]))].sort((a, b) => a.localeCompare(b));
}

export function applyFilters(deals, f) {
  const q = (f.q || "").trim().toLowerCase();
  return deals.filter((d) => {
    if (f.category && d.category !== f.category) return false;
    if (f.store && d.store !== f.store) return false;
    if (discountPct(d) < (f.minoff || 0)) return false;
    if (f.onlyReal && !(d.verdict === "new-low" || d.verdict === "strong")) return false;
    if (q) {
      const hay = `${d.title} ${d.store} ${d.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function applySort(deals, mode) {
  const list = [...deals];
  switch (mode) {
    case "savings":
      return list.sort((a, b) => saved(b) - saved(a));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "verdict":
      return list.sort(
        (a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || discountPct(b) - discountPct(a),
      );
    case "discount":
    default:
      return list.sort((a, b) => discountPct(b) - discountPct(a) || saved(b) - saved(a));
  }
}

export function bestDeals(deals, n) {
  return applySort(deals, "verdict").slice(0, n);
}
