// Encrypts src/homepage.html with a password and writes a self-decrypting index.html.
// Usage:  SITE_PASSWORD='...' node build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const password = (process.env.SITE_PASSWORD ?? "").trim().normalize("NFC");
if (!password) { console.error("Set SITE_PASSWORD"); process.exit(1); }

const src = readFileSync("src/homepage.html", "utf8");
const cut = src.indexOf("</style>") + "</style>".length;
const page =
  `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
  `<meta name="viewport" content="width=device-width,initial-scale=1">` +
  `<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>` +
  src.slice(0, cut) + `</head><body>` + src.slice(cut) + `</body></html>`;

const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const ITER = 300000;
const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
  base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(page)));
const b64 = (u) => Buffer.from(u).toString("base64");

const gate = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Locked</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{--ground:#E4E3DE;--ink:#15161A;--soft:#72747C;--rule:#C2C1BA;--tag:#F2C400}
@media(prefers-color-scheme:dark){:root{--ground:#121316;--ink:#EDECE7;--soft:#83858D;--rule:#32343A}}
*{box-sizing:border-box}body{margin:0;background:var(--ground);color:var(--ink);font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;min-height:100vh;display:grid;place-items:center;padding:24px}
form{display:flex;flex-direction:column;gap:22px;width:min(100%,380px)}
.mark{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--soft)}
.mark .ph{border:1px dashed var(--soft);padding:2px 9px}
h1{font-family:Archivo,sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.95;font-size:34px;margin:0}
label{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--soft);display:flex;flex-direction:column;gap:8px}
input{font:inherit;font-size:16px;padding:13px 14px;background:transparent;color:var(--ink);border:1px solid var(--rule);outline:none;letter-spacing:0;text-transform:none}
input:focus{border-color:var(--ink)}
button{font-family:Archivo,sans-serif;font-weight:800;text-transform:uppercase;font-size:14px;padding:15px 20px;background:var(--tag);color:#15161A;border:1px solid var(--ink);cursor:pointer;align-self:flex-start}
button:hover{transform:translate(-2px,-2px);box-shadow:3px 3px 0 var(--ink)}
.err{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--soft);min-height:1.2em}
</style></head><body>
<form id="f" autocomplete="off">
  <div class="mark"><svg width="15" height="17" viewBox="0 0 15 17" fill="none" aria-hidden="true"><rect x="1" y="7" width="13" height="9" stroke="currentColor" stroke-width="1.6"/><path d="M4 7V4.5a3.5 3.5 0 0 1 7 0V7" stroke="currentColor" stroke-width="1.6"/><rect x="6.6" y="10" width="1.8" height="3" fill="currentColor"/></svg><span class="ph">[ name ]</span></div>
  <h1>Work in progress.</h1>
  <label>Password<input id="p" type="password" autofocus required></label>
  <button type="submit">Unlock</button>
  <p class="err" id="e"></p>
</form>
<script>
(async function(){
  var SALT="${b64(salt)}",IV="${b64(iv)}",CT="${b64(ct)}",ITER=${ITER};
  var u=function(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0)})};
  async function open(pw){
    var enc=new TextEncoder();
    var base=await crypto.subtle.importKey("raw",enc.encode(pw),"PBKDF2",false,["deriveKey"]);
    var key=await crypto.subtle.deriveKey({name:"PBKDF2",salt:u(SALT),iterations:ITER,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["decrypt"]);
    var pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:u(IV)},key,u(CT));
    var html=new TextDecoder().decode(pt);
    try{sessionStorage.setItem("k",pw)}catch(_){}
    document.open();document.write(html);document.close();
  }
  var f=document.getElementById("f"),p=document.getElementById("p"),e=document.getElementById("e");
  f.addEventListener("submit",async function(ev){
    ev.preventDefault();e.textContent="";
    try{await open(p.value.trim().normalize("NFC"))}catch(_){e.textContent="Wrong password";p.select()}
  });
  try{var k=sessionStorage.getItem("k");if(k)await open(k)}catch(_){}
})();
</script></body></html>`;
writeFileSync("index.html", gate);
console.log("index.html written:", (gate.length/1024).toFixed(1), "KB");
