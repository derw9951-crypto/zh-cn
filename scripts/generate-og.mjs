import { readFile } from "node:fs/promises";
import sharp from "sharp";

const profile = JSON.parse(await readFile("data/dois.json", "utf8")).profile;
const cites = JSON.parse(await readFile("public/citations.json", "utf8"));
const items = Object.values(cites.items);
const total = items.length;
const latest = items.sort((a, b) => Number(b.meta.year) - Number(a.meta.year))[0]?.meta;
const esc = s => (s || "").replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d0d0f"/><stop offset="1" stop-color="#161422"/></linearGradient>
    <radialGradient id="glow" cx="0.8" cy="0.2" r="0.6"><stop offset="0" stop-color="#7c5cff" stop-opacity="0.35"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/><rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(90,110)" font-family="Segoe UI, Helvetica, Arial, sans-serif">
    <text x="0" y="0" fill="#7c5cff" font-size="24" letter-spacing="6" font-weight="600">ACADEMIC · RESEARCH PROFILE</text>
    <text x="0" y="90" fill="#ffffff" font-size="72" font-weight="700">${esc(profile.name)}</text>
    <text x="0" y="150" fill="#b9b6c6" font-size="30">${esc(profile.role)}</text>
    <line x1="0" y1="215" x2="360" y2="215" stroke="#2a2833" stroke-width="2"/>
    <text x="0" y="280" fill="#ffffff" font-size="88" font-weight="700">${total}</text>
    <text x="0" y="315" fill="#8a8798" font-size="24">Selected Publications</text>
    ${latest ? `<text x="0" y="400" fill="#7c5cff" font-size="22" font-weight="600">LATEST · ${latest.year}</text><text x="0" y="440" fill="#d7d5e0" font-size="26">${esc(clip(latest.title, 62))}</text><text x="0" y="475" fill="#8a8798" font-size="22" font-style="italic">${esc(latest.journal)}</text>` : ""}
  </g>
  <g transform="translate(940,300)" stroke="#7c5cff" stroke-width="3" opacity="0.55" fill="none"><path d="M0,-90 L78,-45 L78,45 L0,90 L-78,45 L-78,-45 Z"/><path d="M0,-90 L0,0 M78,-45 L0,0 M-78,-45 L0,0 M78,45 L0,0 M-78,45 L0,0 M0,90 L0,0"/></g>
  <g transform="translate(940,300)" fill="#b9a7ff"><circle cx="0" cy="-90" r="7"/><circle cx="78" cy="-45" r="7"/><circle cx="78" cy="45" r="7"/><circle cx="0" cy="90" r="7"/><circle cx="-78" cy="45" r="7"/><circle cx="-78" cy="-45" r="7"/><circle cx="0" cy="0" r="10" fill="#7c5cff"/></g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("assets/og-image.png");
await sharp(Buffer.from(await readFile("assets/favicon.svg"))).resize(180, 180).png().toFile("assets/apple-touch-icon.png");
await sharp(Buffer.from(await readFile("assets/favicon.svg"))).resize(32, 32).png().toFile("assets/favicon-32.png");
console.log("🖼️ og-image.png / apple-touch-icon.png / favicon-32.png 已生成");
