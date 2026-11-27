/* FridayFinds — one clear job: money, discount and time formatting. */

export function money(n) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
}

export function discountPct(deal) {
  if (!deal.was || deal.was <= deal.price) return 0;
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function saved(deal) {
  return Math.max(0, deal.was - deal.price);
}

/* "2026-11-27T10:05:00Z" -> "27 Nov 2026, 10:05 UTC" */
export function checkedLabel(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

export const VERDICTS = {
  "new-low": { label: "New low", hint: "Lowest price the evidence supports" },
  strong: { label: "Strong price", hint: "A genuinely good price" },
  routine: { label: "Routine sale", hint: "A normal sale price, seen before" },
  inflated: { label: "Inflated", hint: "The usual price looks padded" },
};

export function verdictLabel(v) {
  return (VERDICTS[v] || VERDICTS.routine).label;
}
