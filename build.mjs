// Wraps src/homepage.html in a full HTML document and writes index.html.
// Usage: node build.mjs
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("src/homepage.html", "utf8");
const cut = src.indexOf("</style>") + "</style>".length;
const page =
  `<!doctype html><html lang="sv"><head><meta charset="utf-8">\n` +
  `<meta name="viewport" content="width=device-width,initial-scale=1">\n` +
  `<meta name="robots" content="noindex,nofollow">\n` +
  `<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n` +
  src.slice(0, cut) + `\n</head><body>` + src.slice(cut) + `</body></html>\n`;
writeFileSync("index.html", page);
console.log("index.html written:", (page.length / 1024).toFixed(1), "KB");
