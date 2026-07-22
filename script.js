/* Dynamic citation menus fed by public/citations.json. */
const FMT = [["nature", "Nature"], ["bibtex", "BibTeX"], ["gbt", "GB/T 7714"]];

function closeAllCites() {
  document.querySelectorAll(".cite-wrap.open").forEach((wrap) => {
    wrap.classList.remove("open");
    const button = wrap.querySelector(".cite-btn");
    if (button) button.setAttribute("aria-expanded", "false");
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(textarea);
  }
}

function initCiteMenus(citations) {
  const allBibButton = document.getElementById("copy-all-bib");
  const items = citations?.items || {};

  if (allBibButton) {
    allBibButton.addEventListener("click", async () => {
      const all = Object.values(items).map((item) => item.bibtex).filter(Boolean).join("\n\n");
      if (!all) return;
      await copyText(all);
      const original = allBibButton.textContent;
      allBibButton.textContent = `✓ 已复制 ${Object.keys(items).length} 条`;
      allBibButton.classList.add("done");
      setTimeout(() => {
        allBibButton.textContent = original;
        allBibButton.classList.remove("done");
      }, 1500);
    });
  }

  document.querySelectorAll(".publication-item[data-cite-id]").forEach((item) => {
    const id = item.dataset.citeId;
    const citation = items[id];
    const wrap = item.querySelector(".cite-wrap");
    if (!wrap || !citation) return;

    wrap.innerHTML = `
      <button class="cite-btn" type="button" aria-haspopup="true" aria-expanded="false">
        <span>⧉ 引用</span><span class="caret">▾</span>
      </button>
      <div class="cite-menu" role="menu">
        ${FMT.map(([format, label]) => `<button type="button" data-fmt="${format}"><span>${label}</span><span class="tick"></span></button>`).join("")}
      </div>`;

    const trigger = wrap.querySelector(".cite-btn");
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !wrap.classList.contains("open");
      closeAllCites();
      wrap.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });

    wrap.querySelectorAll(".cite-menu button").forEach((menuButton) => {
      menuButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        const text = citation[menuButton.dataset.fmt];
        if (!text) return;
        await copyText(text);
        const tick = menuButton.querySelector(".tick");
        tick.textContent = "✓";
        setTimeout(() => {
          tick.textContent = "";
          wrap.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
        }, 900);
      });
    });
  });
}

document.addEventListener("click", closeAllCites);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAllCites();
});

fetch("public/citations.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error(`Citation data request failed: ${response.status}`);
    return response.json();
  })
  .then(initCiteMenus)
  .catch((error) => console.error("Unable to load citation data.", error));
