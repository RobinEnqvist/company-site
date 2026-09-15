# Go-live checklist (run when the domain is bought)

Nothing below is done yet. Do it in this order.

1. **Buy the domain** — wersworks.com (recommended) and wers.co (email). Check `wers.co` MX so hej@wers.co actually receives mail.
2. **Point the domain at GitHub Pages** — at the registrar: `A` records to GitHub Pages IPs (185.199.108–111.153) or `CNAME www → robinenqvist.github.io`. In this repo: add a `CNAME` file containing the domain. Enable "Enforce HTTPS" in repo Settings → Pages.
3. **Change `SITE` in `build.mjs`** to the real domain, rebuild, push. This fixes canonical, OG url, robots.txt and sitemap.xml. Do this *before* Google indexes the github.io address.
4. **Google Search Console** — verify the domain, submit `sitemap.xml`.
5. **Decide on the Swedish page** — it is `noindex`. Flip `index: false` in `build.mjs` if it should rank too, and add hreflang links between `/` and `/en/`.
6. **Replace placeholders** — `wers-brief.pdf` in the repo root; the 20 batch tiles with real example ads.
7. **Remove `noindex` and test the form** end to end from a phone and a desktop without a mail client.
