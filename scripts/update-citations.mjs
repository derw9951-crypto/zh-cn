import { readFile, writeFile, mkdir } from "node:fs/promises";

const MAILTO = process.env.CROSSREF_MAILTO || "daofuwu@163.com";
const UA = `AcademicHomepage/1.0 (mailto:${MAILTO})`;
const raw = JSON.parse(await readFile("data/dois.json", "utf8"));

const initials = (given = "") =>
  given.split(/[\s.-]+/).filter(Boolean).map(s => `${s[0].toUpperCase()}.`).join(" ");

const bibKey = (family, year, title) =>
  `${(family || "anon").toLowerCase()}${year}${(title.match(/[a-z0-9]+/i)?.[0] || "ref").toLowerCase()}`;

async function fetchWork(doi) {
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`CrossRef ${res.status} for ${doi}`);
  return (await res.json()).message;
}

function buildFormats(m, doi) {
  const authors = (m.author || []).map(a => ({
    family: a.family || a.name || "",
    given: a.given || "",
  }));
  const year =
    m.issued?.["date-parts"]?.[0]?.[0] ||
    m["published-print"]?.["date-parts"]?.[0]?.[0] ||
    m["published-online"]?.["date-parts"]?.[0]?.[0] || "n.d.";
  const title = (m.title?.[0] || "Untitled").replace(/\s+/g, " ").trim();
  const journal = m["container-title"]?.[0] || "";
  const jShort = m["short-container-title"]?.[0] || journal;
  const vol = m.volume || "";
  const page = m.page || m["article-number"] || "";
  const first = authors[0] || { family: "Unknown", given: "" };

  const natAuthors = authors.length > 1
    ? `${first.family}, ${initials(first.given)} et al.`
    : `${first.family}, ${initials(first.given)}`;
  const nature = `${natAuthors} ${title}. ${jShort} ${[vol, page].filter(Boolean).join(", ")} (${year}).`.replace(/\s+/g, " ");

  const gbtAuthors = authors.slice(0, 3).map(a => `${a.family} ${initials(a.given).replace(/\./g, "")}`).join(", ") + (authors.length > 3 ? ", et al" : "");
  const gbt = `${gbtAuthors}. ${title}[J]. ${journal}, ${year}${vol ? ", " + vol : ""}${page ? ": " + page : ""}. DOI:${doi}.`;

  const bibAuthors = authors.map(a => `${a.family}, ${a.given}`).join(" and ");
  const key = bibKey(first.family, year, title);
  const bibtex = `@article{${key},\n  title  = {${title}},\n  author = {${bibAuthors}},\n  journal= {${journal}},\n${vol ? `  volume = {${vol}},\n` : ""}${page ? `  pages  = {${page}},\n` : ""}  year   = {${year}},\n  doi    = {${doi}}\n}`;

  return {
    nature,
    gbt,
    bibtex,
    meta: { title, year, journal: jShort, url: `https://doi.org/${doi}`, doi },
  };
}

const out = { generatedAt: new Date().toISOString(), items: {} };
for (const pub of raw.publications) {
  try {
    const metadata = await fetchWork(pub.doi);
    out.items[pub.id] = { ...buildFormats(metadata, pub.doi), note: pub.note || "" };
    console.log(`✓ ${pub.id}  ${pub.doi}`);
  } catch (error) {
    console.error(`✗ ${pub.id}  ${error.message}`);
    process.exitCode = 1;
  }
  await new Promise(resolve => setTimeout(resolve, 800));
}

await mkdir("public", { recursive: true });
await writeFile("public/citations.json", JSON.stringify(out, null, 2));
console.log(`\n📦 已写入 public/citations.json（${Object.keys(out.items).length} 条）`);
