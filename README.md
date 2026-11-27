![black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)
![rank](https://make.fun/badge/black-friday-deal-finder-01/achzul/black-friday-deal-finder-01/rank.svg)
![reward](https://make.fun/badge/black-friday-deal-finder-01/achzul/black-friday-deal-finder-01/reward.svg)

# FridayFinds — Black Friday Deal Finder

A deal finder for shoppers hunting real Black Friday and Cyber Monday bargains. It lists 36 deals its maker found and checked by hand on Friday 27 November 2026 — each with the product, the store, a link to the product at that store, the sale price, the usual price, the discount, the exact time the price was checked, the page where the price was read, and an honest verdict on whether it is really a deal (new low, strong price, routine sale, or inflated).

## What it does

- **Search** any product, brand or store.
- **Filter** by category, store and minimum discount, plus a switch for only real deals (new low or strong).
- **Sort** by biggest discount, most money saved, price, or best verdict.
- **Deal pages** on hash routes (`#/deal/<id>`) with the full verdict, the evidence behind it, the check time and source, and a link to buy at the store.
- Works on desktop and on a phone, from plain static files with no network request.

## How the deals were checked

Every price was read on 27 November 2026 on the store's own product page or in a deals roundup that names the store and both prices. The site says when each price was checked and where it was read, so a shopper can re-check it. Prices change fast on Black Friday — the site says so on every page.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080.

## Competition

https://make.fun/bounty/black-friday-deal-finder-01

## License

MIT — see [LICENSE](LICENSE).
