// Wraps each language source in a full HTML document.
//   src/homepage.html     → index.html     (sv)
//   src/homepage.en.html  → en/index.html  (en)
// Usage: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const wrap = (src, lang) => {
  const cut = src.indexOf("</style>") + "</style>".length;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">\n` +
    `<meta name="robots" content="noindex,nofollow">\n` +
    `<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n` +
    src.slice(0, cut) + `\n</head><body>` + src.slice(cut) + `</body></html>\n`;
};
const sv = wrap(readFileSync("src/homepage.html", "utf8"), "sv");
const en = wrap(readFileSync("src/homepage.en.html", "utf8"), "en");
mkdirSync("en", { recursive: true });
writeFileSync("index.html", sv);
writeFileSync("en/index.html", en);
console.log("index.html", (sv.length / 1024).toFixed(1), "KB · en/index.html", (en.length / 1024).toFixed(1), "KB");
