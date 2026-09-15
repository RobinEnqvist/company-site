// Wraps each language source in a full HTML document.
//   src/homepage.html     → index.html     (sv, noindex)
//   src/homepage.en.html  → en/index.html  (en, indexed)
// Usage: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://robinenqvist.github.io/company-site"; // change when the real domain is live

const wrap = (src, { lang, index, url, description }) => {
  const cut = src.indexOf("</style>") + "</style>".length;
  const head = [
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width,initial-scale=1">`,
    index ? `<meta name="robots" content="index,follow">` : `<meta name="robots" content="noindex,nofollow">`,
    index ? `<link rel="canonical" href="${url}">` : "",
    description ? `<meta name="description" content="${description}">` : "",
    index ? `<meta property="og:type" content="website">` : "",
    index ? `<meta property="og:url" content="${url}">` : "",
    index ? `<meta property="og:site_name" content="Wers">` : "",
    index && description ? `<meta property="og:description" content="${description}">` : "",
    `<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>`,
  ].filter(Boolean).join("\n");
  let out = `<!doctype html><html lang="${lang}"><head>\n${head}\n` + src.slice(0, cut) + `\n</head><body>` + src.slice(cut) + `</body></html>\n`;
  if (index) { // og:title mirrors the <title>
    const t = /<title>([^<]*)<\/title>/.exec(src)?.[1];
    if (t) out = out.replace("</title>", `</title>\n<meta property="og:title" content="${t}">`);
  }
  return out;
};

const sv = wrap(readFileSync("src/homepage.html", "utf8"), { lang: "sv", index: false });
const en = wrap(readFileSync("src/homepage.en.html", "utf8"), {
  lang: "en", index: true, url: `${SITE}/en/`,
  description: "20 video ads per batch, tested in your account, with a report on what won and the next hypothesis. The creative engine for performance agencies with e-commerce clients on Meta and TikTok.",
});
mkdirSync("en", { recursive: true });
writeFileSync("index.html", sv);
writeFileSync("en/index.html", en);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/en/</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod></url>\n</urlset>\n`);
console.log("index.html (sv, noindex) · en/index.html (en, indexed) · robots.txt · sitemap.xml");
