(async function () {
  const storage = await chrome.storage.sync.get(["enabled", "excludeWords"]);
  let enabled = storage.enabled ?? true;
  let excludeWords = storage.excludeWords ?? ["-ai"];
  if (!Array.isArray(excludeWords)) excludeWords = ["-ai"];

  // 常に正規化（+や-が入力されても -〇〇 に直す）
  const normalizeWords = words => {
    return words.map(w => {
      w = w.replace(/^[-+]+/, "").trim(); // +や-を削除
      return w.length > 0 ? "-" + w : "";
    }).filter(Boolean);
  };

  function updateUrlIfNeeded() {
    if (!enabled) return;

    const url = new URL(window.location.href);
    const q = url.searchParams.get("q") || "";
    const queryWords = q.trim().split(/\s+/);

    const normalizedExcludeWords = normalizeWords(excludeWords);

    // 通常のキーワードだけを抽出
    const baseWords = queryWords.filter(w => !w.startsWith("-"));

    // 重複を除いて最終クエリにまとめる
    const finalQuery = [...new Set([...baseWords, ...normalizedExcludeWords])].join(" ");
    if (finalQuery !== q.trim()) {
      url.searchParams.set("q", finalQuery);
      window.location.replace(url.toString());
    }
  }

  function createUI() {
    const container = document.createElement("div");
    container.id = "ai-blocker-ui";
    container.style.position = "fixed";
    container.style.top = "12px";
    container.style.right = "12px";
    container.style.zIndex = 999999;
    container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "8px";

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "ai-blocker-toggle";
    toggleBtn.textContent = enabled ? "ON" : "OFF";
    toggleBtn.style.border = "none";
    toggleBtn.style.borderRadius = "5px";
    toggleBtn.style.padding = "6px 14px";
    toggleBtn.style.fontWeight = "600";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.userSelect = "none";
    toggleBtn.style.minWidth = "64px"; // ← 約80%に短縮
    toggleBtn.style.transition = "background-color 0.3s ease";
    toggleBtn.style.backgroundColor = enabled ? "#3179ed" : "#eaeaea";
    toggleBtn.style.color = enabled ? "#fff" : "#000";

    const settingsBtn = document.createElement("button");
    settingsBtn.id = "ai-blocker-settings";
    settingsBtn.title = "設定";
    settingsBtn.textContent = "⚙️";
    settingsBtn.style.border = "none";
    settingsBtn.style.borderRadius = "5px";
    settingsBtn.style.padding = "6px 12px";
    settingsBtn.style.fontWeight = "600";
    settingsBtn.style.cursor = "pointer";
    settingsBtn.style.userSelect = "none";
    settingsBtn.style.backgroundColor = "#eaeaea";
    settingsBtn.style.color = "#000";
    settingsBtn.style.minWidth = "36px";
    settingsBtn.style.fontSize = "18px";
    settingsBtn.style.lineHeight = "1";

    container.appendChild(toggleBtn);
    container.appendChild(settingsBtn);
    document.body.appendChild(container);

    const settingsPanel = document.createElement("div");
    settingsPanel.id = "ai-blocker-settings-panel";
    settingsPanel.style.position = "fixed";
    settingsPanel.style.top = "50px";
    settingsPanel.style.right = "12px";
    settingsPanel.style.zIndex = 999999;
    settingsPanel.style.backgroundColor = "#fff";
    settingsPanel.style.border = "1px solid #ccc";
    settingsPanel.style.borderRadius = "10px";
    settingsPanel.style.padding = "12px";
    settingsPanel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    settingsPanel.style.width = "280px";
    settingsPanel.style.display = "none";
    settingsPanel.style.flexDirection = "column";
    settingsPanel.style.fontSize = "14px";
    settingsPanel.style.color = "#000";
    settingsPanel.style.fontFamily = toggleBtn.style.fontFamily;

    settingsPanel.innerHTML = [
      '<h2 style="margin-top:0;margin-bottom:8px;font-size:16px;">除外ワード設定</h2>',
      '<textarea id="ai-blocker-exclude-input" rows="3" style="width:100%;font-size:14px;border-radius:8px;border:1px solid #ccc;padding:6px 8px;resize:vertical;box-sizing:border-box;"></textarea>',
      '<div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">',
      '<button id="ai-blocker-save" style="padding:6px 14px; border:none; border-radius:14px; background:#3179ed; color:#fff; cursor:pointer;">保存</button>',
      '<button id="ai-blocker-close" style="padding:6px 14px; border:none; border-radius:14px; background:#eaeaea; color:#000; cursor:pointer;">閉じる</button>',
      '</div>',
      '<p style="font-size:11px;color:#666;margin-top:8px;">Google検索時に自動でこれらのワードを除外キーワードとして追加します。<br>半角スペース区切りで複数指定可（例：ai gemini）</p>'
    ].join('');
    document.body.appendChild(settingsPanel);

    const excludeInput = settingsPanel.querySelector("#ai-blocker-exclude-input");
    excludeInput.value = excludeWords.map(w => w.replace(/^[-+]+/, "")).join(" ");

    toggleBtn.addEventListener("click", async () => {
      enabled = !enabled;
      await chrome.storage.sync.set({ enabled });
      toggleBtn.textContent = enabled ? "ON" : "OFF";
      toggleBtn.style.backgroundColor = enabled ? "#3179ed" : "#eaeaea";
      toggleBtn.style.color = enabled ? "#fff" : "#000";
      if (enabled) updateUrlIfNeeded();
    });

    settingsBtn.addEventListener("click", () => {
      settingsPanel.style.display = settingsPanel.style.display === "none" ? "flex" : "none";
    });

    settingsPanel.querySelector("#ai-blocker-save").addEventListener("click", async () => {
      const inputWords = excludeInput.value.trim().split(/\s+/).filter(w => w.length > 0);
      excludeWords = normalizeWords(inputWords);
      await chrome.storage.sync.set({ excludeWords });
      settingsPanel.style.display = "none";
      if (enabled) updateUrlIfNeeded();
    });

    settingsPanel.querySelector("#ai-blocker-close").addEventListener("click", () => {
      settingsPanel.style.display = "none";
    });
  }

  createUI();
  updateUrlIfNeeded();

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      if (enabled) updateUrlIfNeeded();
    }
  }).observe(document, { subtree: true, childList: true });
})();
