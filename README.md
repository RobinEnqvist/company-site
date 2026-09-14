# company-site

Homepage for the company. Work in progress — unlisted (noindex), reachable by URL only.

- `src/homepage.html` — Swedish source (edit this)
- `src/homepage.en.html` — English source (edit this)
- `build.mjs` — wraps the source in a full document and writes `index.html`
- `index.html`, `en/index.html` — the published pages (never edit by hand)

## Rebuild after editing

```bash
node build.mjs
```
