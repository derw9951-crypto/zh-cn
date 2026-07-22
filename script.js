const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('dw-theme');
if (savedTheme) root.dataset.theme = savedTheme;

toggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (theme === 'light') delete root.dataset.theme;
  else root.dataset.theme = theme;
  localStorage.setItem('dw-theme', theme);
});

    // 一键复制引用
    document.querySelectorAll(".cite-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const text = btn.getAttribute("data-cite");
        const txtEl = btn.querySelector(".cite-text");
        const icoEl = btn.querySelector(".cite-icon");
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // 降级方案：不支持 Clipboard API 时
          const ta = document.createElement("textarea");
          ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch {}
          document.body.removeChild(ta);
        }
        btn.classList.add("copied");
        icoEl.textContent = "✓"; txtEl.textContent = "已复制";
        setTimeout(() => {
          btn.classList.remove("copied");
          icoEl.textContent = "⧉"; txtEl.textContent = "引用";
        }, 1800);
      });
    });
 
       /* ===== 引用数据（三格式 · 含 DOI） ===== */
    const CITES = {
      p1: {
        nature: "Gao, L., Wu, D., Huang, Y., Zhang, W., Liu, Y. & Tang, X. Morphology-defect synergy in Cs2PdBr6 perovskite nanocrystals for enhanced photocatalytic CO2-to-CO conversion. eScience 100508 (2025).",
        gbt: "Gao L, Wu D, Huang Y, et al. Morphology-defect synergy in Cs2PdBr6 perovskite nanocrystals for enhanced photocatalytic CO2-to-CO conversion[J]. eScience, 2025: 100508. DOI:10.1016/j.esci.2025.100508.",
        bibtex: "@article{gao2025cs2pdbr6,\n  title  = {Morphology-defect synergy in Cs2PdBr6 perovskite nanocrystals for enhanced photocatalytic CO2-to-CO conversion},\n  author = {Gao, Liqin and Wu, Daofu and Huang, Yanyi and Zhang, Wenxia and Liu, Yongfeng and Tang, Xiaosheng},\n  journal= {eScience},\n  pages  = {100508},\n  year   = {2025},\n  doi    = {10.1016/j.esci.2025.100508}\n}"
      },
      p2: {
        nature: "Fang, J. et al. Multi-heterojunction composite material based on bottom-up liquid-phase preparation of graphene nanoribbons for photocatalytic CO2 reduction. Adv. Compos. Hybrid Mater. 8, 336 (2025).",
        gbt: "Fang J, Xu J, He X, et al. Multi-heterojunction composite material based on bottom-up liquid-phase preparation of graphene nanoribbons for photocatalytic CO2 reduction[J]. Advanced Composites and Hybrid Materials, 2025, 8: 336. DOI:10.1007/s42114-025-01400-3.",
        bibtex: "@article{fang2025gnr,\n  title  = {Multi-heterojunction composite material based on bottom-up liquid-phase preparation of graphene nanoribbons for photocatalytic CO2 reduction},\n  author = {Fang, Junan and Xu, Jingyin and He, Xuefeng and Ran, Hongmei and Chen, Wei and An, Jia and Wu, Daofu and Tang, Xiaosheng and Liu, Yufei},\n  journal= {Advanced Composites and Hybrid Materials},\n  volume = {8},\n  pages  = {336},\n  year   = {2025},\n  doi    = {10.1007/s42114-025-01400-3}\n}"
      },
      p3: {
        nature: "Ran, H. et al. Ligand-engineered Cu-based halide perovskite for highly efficient near-infrared photocatalytic CO2 reduction. Appl. Catal. B 352, 124048 (2024).",
        gbt: "Ran H, Wu D, Chen W, et al. Ligand-engineered Cu-based halide perovskite for highly efficient near-infrared photocatalytic CO2 reduction[J]. Applied Catalysis B: Environmental, 2024, 352: 124048. DOI:10.1016/j.apcatb.2024.124048.",
        bibtex: "@article{ran2024cu,\n  title  = {Ligand-engineered Cu-based halide perovskite for highly efficient near-infrared photocatalytic CO2 reduction},\n  author = {Ran, Hongmei and Wu, Daofu and Chen, Wei and Liu, Yichen and Gao, Liqin and Zhou, Jinchen and Gao, Bo and Lai, Junan and Luo, Heng and Kuang, Faguang and Mo, Min and Luo, Zhiqiong and Dong, Fan and Ma, Hao and Zhang, Qian and Ling, Faling and Sun, Baofei and Tang, Xiaosheng},\n  journal= {Applied Catalysis B: Environmental},\n  volume = {352},\n  pages  = {124048},\n  year   = {2024},\n  doi    = {10.1016/j.apcatb.2024.124048}\n}"
      },
      p4: {
        nature: "Zhou, J. et al. Enhanced photocatalytic activity of lead-free Cs2TeBr6/g-C3N4 heterojunction photocatalyst and its mechanism. Adv. Funct. Mater. 34, 2308411 (2024).",
        gbt: "Zhou J, Gao B, Wu D, et al. Enhanced photocatalytic activity of lead-free Cs2TeBr6/g-C3N4 heterojunction photocatalyst and its mechanism[J]. Advanced Functional Materials, 2024, 34: 2308411. DOI:10.1002/adfm.202308411.",
        bibtex: "@article{zhou2024cs2tebr6,\n  title  = {Enhanced photocatalytic activity of lead-free Cs2TeBr6/g-C3N4 heterojunction photocatalyst and its mechanism},\n  author = {Zhou, Jinchen and Gao, Bo and Wu, Daofu and Tian, Changqing and Ran, Hongmei and Chen, Wei and Huang, Qiang and Zhang, Wenxia and Qi, Fei and Zhang, Nan and Pu, Yayun and Qiu, Jing and Hu, Zhiping and Du, Juan and Liu, Zhengzheng and Leng, Yuxin and Tang, Xiaosheng},\n  journal= {Advanced Functional Materials},\n  volume = {34},\n  pages  = {2308411},\n  year   = {2024},\n  doi    = {10.1002/adfm.202308411}\n}"
      },
      p5: {
        nature: "Gao, B. et al. Copper modulated lead-free Cs4MnSb2Cl12 double perovskite microcrystals for photocatalytic reduction of CO2. Adv. Sci. 11, 2307543 (2024).",
        gbt: "Gao B, Tian C, Guo L, et al. Copper modulated lead-free Cs4MnSb2Cl12 double perovskite microcrystals for photocatalytic reduction of CO2[J]. Advanced Science, 2024, 11: 2307543. DOI:10.1002/advs.202307543.",
        bibtex: "@article{gao2024cs4mnsb2cl12,\n  title  = {Copper modulated lead-free Cs4MnSb2Cl12 double perovskite microcrystals for photocatalytic reduction of CO2},\n  author = {Gao, Bo and Tian, Changqing and Guo, Linfeng and Zhou, Jinchen and Wang, Zixian and Fu, Chengfan and Ran, Hongmei and Chen, Wei and Huang, Qiang and Wu, Daofu and Tang, Xiaosheng and Luo, Zhongtao},\n  journal= {Advanced Science},\n  volume = {11},\n  pages  = {2307543},\n  year   = {2024},\n  doi    = {10.1002/advs.202307543}\n}"
      }
    };

    /* ===== 复制全部 BibTeX ===== */
    const allBibBtn = document.getElementById("copy-all-bib");
    if (allBibBtn) {
      allBibBtn.addEventListener("click", async () => {
        const all = Object.keys(CITES)
          .map(k => CITES[k].bibtex)
          .join("\n\n");
        await copyText(all);
        const original = allBibBtn.textContent;
        allBibBtn.textContent = "✓ 已复制 " + Object.keys(CITES).length + " 条";
        allBibBtn.classList.add("done");
        setTimeout(() => {
          allBibBtn.textContent = original;
          allBibBtn.classList.remove("done");
        }, 1500);
      });
    }


    /* ===== 构建下拉菜单 ===== */
    const FMT = [["nature","Nature"],["bibtex","BibTeX"],["gbt","GB-T 7714"]];
    document.querySelectorAll(".publication-item[data-cite-id]").forEach(item => {
      const id = item.dataset.citeId;
      const wrap = item.querySelector(".cite-wrap");
      if (!wrap || !CITES[id]) return;
      wrap.innerHTML =
        '<button class="cite-btn" type="button" aria-haspopup="true" aria-expanded="false">' +
          '<span>⧉ 引用</span><span class="caret">▾</span></button>' +
        '<div class="cite-menu" role="menu">' +
          FMT.map(([k,label]) =>
            '<button type="button" data-fmt="'+k+'"><span>'+label+'</span><span class="tick"></span></button>'
          ).join("") +
        '</div>';

      const trigger = wrap.querySelector(".cite-btn");
      trigger.addEventListener("click", e => {
        e.stopPropagation();
        const willOpen = !wrap.classList.contains("open");
        closeAllCites();
        wrap.classList.toggle("open", willOpen);
        trigger.setAttribute("aria-expanded", willOpen);
      });

      wrap.querySelectorAll(".cite-menu button").forEach(mBtn => {
        mBtn.addEventListener("click", async e => {
          e.stopPropagation();
          const text = CITES[id][mBtn.dataset.fmt];
          await copyText(text);
          const tick = mBtn.querySelector(".tick");
          tick.textContent = "✓";
          setTimeout(() => { tick.textContent = ""; wrap.classList.remove("open"); }, 900);
        });
      });
    });

    function closeAllCites() {
      document.querySelectorAll(".cite-wrap.open").forEach(w => {
        w.classList.remove("open");
        const b = w.querySelector(".cite-btn"); if (b) b.setAttribute("aria-expanded","false");
      });
    }
    document.addEventListener("click", closeAllCites);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeAllCites(); });

    async function copyText(text) {
      try { await navigator.clipboard.writeText(text); }
      catch {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position="fixed"; ta.style.opacity="0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch {}
        document.body.removeChild(ta);
      }
    }


