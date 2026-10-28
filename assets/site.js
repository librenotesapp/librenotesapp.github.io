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

  // Versão e link direto do arquivo da última Release (se a API responder).
  fetch("https://api.github.com/repos/librenotesapp/librenotesapp.github.io/releases/latest")
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(rel => {
      document.getElementById("version").textContent = rel.tag_name.replace(/^v/, "");
      const asset = (rel.assets || []).find(a => a.name.endsWith(".tar.gz"));
      if (asset) document.getElementById("download").href = asset.browser_download_url;
    })
    .catch(() => {});
