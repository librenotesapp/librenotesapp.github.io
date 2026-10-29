  // Copiar o endereço Bitcoin.
  document.getElementById("copy-btc").addEventListener("click", async () => {
    const addr = document.getElementById("btc-addr").textContent.trim();
    try {
      await navigator.clipboard.writeText(addr);
    } catch {
      const r = document.createRange();
      r.selectNodeContents(document.getElementById("btc-addr"));
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      document.execCommand("copy");
    }
    const ok = document.getElementById("copied");
    ok.classList.add("show");
    setTimeout(() => ok.classList.remove("show"), 1800);
  });

  // Sistema do visitante: a linha e o cartão dele ficam em destaque (primeiro).
  const ua = navigator.userAgent;
  const plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
  const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const os = mobile ? null
    : /Win/i.test(plat) || /Windows/i.test(ua) ? "windows"
    : /Mac/i.test(plat) || /Mac OS X/i.test(ua) ? "mac"
    : /Linux|X11|CrOS/i.test(plat + ua) ? "linux" : null;
  if (os) {
    document.getElementById("os-" + os)?.classList.add("current");
    const row = document.getElementById("hero-" + os);
    if (row) { row.classList.add("current"); row.parentNode.prepend(row); }
  }

  // Links sempre na última Release (se a API responder): cada link sabe o
  // final do nome do arquivo (data-asset) e o href fixo é só o reserva.
  fetch("https://api.github.com/repos/librenotesapp/librenotesapp.github.io/releases/latest")
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(rel => {
      document.getElementById("version").textContent = rel.tag_name.replace(/^v/, "");
      const assets = rel.assets || [];
      document.querySelectorAll("[data-asset]").forEach(a => {
        const found = assets.find(x => x.name.endsWith(a.dataset.asset));
        if (found) { a.href = found.browser_download_url; return; }
        // Fora desta versão, mas o href fixo aponta para uma anterior: fica nele.
        if (!("soon" in a.dataset)) return;
        // Arquivo ainda não saiu em versão nenhuma: avisa em vez de dar erro.
        a.href = rel.html_url;
        a.classList.add("soon");
        a.removeAttribute("download");
        a.title = document.documentElement.lang.startsWith("pt") ? "Em breve" : "Coming soon";
        a.append(document.documentElement.lang.startsWith("pt") ? " · em breve" : " · coming soon");
      });
    })
    .catch(() => {});
