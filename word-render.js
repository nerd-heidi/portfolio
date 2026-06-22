(function () {
  var css = `
  #word-section { padding: 0 0 5rem }
  .word-scroll-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0.5rem 1.5rem 2.5rem;
    cursor: grab;
    scrollbar-width: thin;
    scrollbar-color: #222 transparent;
  }
  .word-scroll-wrap:active { cursor: grabbing }
  .word-scroll-wrap::-webkit-scrollbar { height: 3px }
  .word-scroll-wrap::-webkit-scrollbar-thumb { background: #222; border-radius: 2px }
  .word-scroll {
    display: flex;
    flex-direction: row-reverse;
    gap: 3rem;
    width: max-content;
    padding: 1.5rem 1rem;
  }
  .word-item {
    writing-mode: vertical-rl;
    font-size: 1.3rem;
    line-height: 2.4;
    color: #aaa;
    cursor: pointer;
    max-height: 58vh;
    overflow: hidden;
    transition: color 0.2s, text-shadow 0.2s;
    user-select: none;
    letter-spacing: 0.07em;
    position: relative;
    flex-shrink: 0;
  }
  .word-item::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4rem;
    background: linear-gradient(transparent, #050505);
    pointer-events: none;
  }
  .word-item:hover {
    color: #d4b8ff;
    text-shadow: 0 0 28px rgba(167,128,255,0.4);
  }
  .word-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0,0,0,0.80);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.22s;
  }
  .word-overlay.open { opacity: 1; pointer-events: all }
  .word-modal {
    background: #111;
    border: 1px solid #232323;
    border-radius: 20px;
    padding: 2.5rem 2.25rem 2.25rem;
    max-width: 460px;
    width: 100%;
    position: relative;
    max-height: 88vh;
    overflow-y: auto;
    transform: translateY(16px) scale(0.97);
    transition: transform 0.22s;
  }
  .word-overlay.open .word-modal { transform: none }
  .word-modal-close {
    position: absolute; top: 1rem; right: 1.25rem;
    background: none; border: none; color: #555;
    font-size: 1.5rem; line-height: 1; cursor: pointer;
    padding: 0.2rem; transition: color 0.15s;
  }
  .word-modal-close:hover { color: #ddd }
  .word-modal-img {
    display: block; width: 72px; height: 72px;
    object-fit: cover; border-radius: 10px;
    margin-bottom: 1.25rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
  }
  .word-modal-tag {
    display: inline-block;
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.18rem 0.6rem; border-radius: 999px;
    background: rgba(167,128,255,0.12); color: #a780ff;
    margin-bottom: 0.9rem;
  }
  .word-modal-text {
    font-size: 1.1rem; line-height: 1.95;
    color: #eee; font-style: italic;
    margin-bottom: 1.5rem;
    word-break: break-word; white-space: pre-wrap;
  }
  .word-modal-source {
    display: flex; align-items: center; gap: 0.65rem;
    font-size: 0.83rem; color: #777;
    margin-bottom: 1.75rem;
  }
  .word-modal-dash {
    flex-shrink: 0; width: 1.5rem; height: 1px;
    background: linear-gradient(to right, #a780ff, transparent);
  }
  .word-modal-btns { display: flex; gap: 0.7rem; flex-wrap: wrap }
  .word-modal-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.1rem; border-radius: 8px;
    font-size: 0.8rem; font-weight: 600;
    text-decoration: none; border: none; cursor: pointer;
    transition: opacity 0.15s; white-space: nowrap;
  }
  .word-modal-btn:hover { opacity: 0.75 }
  .word-btn-x { background: #0d0d0d; color: #fff; border: 1px solid #2e2e2e }
  .word-btn-link { background: rgba(167,128,255,0.12); color: #a780ff; border: 1px solid rgba(167,128,255,0.2) }
  .word-hint { text-align: center; color: #333; font-size: 0.75rem; letter-spacing: 0.1em; padding: 0.5rem 1.25rem 1rem }
  .word-empty { text-align: center; color: #444; padding: 5rem 1.25rem; font-size: 0.9rem; letter-spacing: 0.08em }
  `;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var TAG_LABEL = { lyric: "Lyric", quote: "Quote", movie: "Movie", book: "Book", anime: "Anime", other: "Other" };

  function esc(s) {
    return s ? String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "";
  }

  var overlay = document.createElement("div");
  overlay.className = "word-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  var modal = document.createElement("div");
  modal.className = "word-modal";
  var closeBtn = document.createElement("button");
  closeBtn.className = "word-modal-close";
  closeBtn.setAttribute("aria-label", "閉じる");
  closeBtn.textContent = "×";
  var inner = document.createElement("div");
  modal.appendChild(closeBtn);
  modal.appendChild(inner);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  function openModal(item) {
    var imgHtml = item.image ? "<img class=\"word-modal-img\" src=\"" + esc(item.image) + "\" alt=\"\" loading=\"lazy\">" : "";
    var tagHtml = (item.tag && TAG_LABEL[item.tag]) ? "<div><span class=\"word-modal-tag\">" + TAG_LABEL[item.tag] + "</span></div>" : "";
    var srcHtml = item.source ? "<div class=\"word-modal-source\"><span class=\"word-modal-dash\"></span><span>" + esc(item.source) + "</span></div>" : "";
    var shareText = item.source ? "\u300C" + item.text + "\u300D\n\u2014 " + item.source : "\u300C" + item.text + "\u300D";
    var tweetHref = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent("https://nerd-heidi.com/word/");
    var linkBtn = item.link_url ? "<a class=\"word-modal-btn word-btn-link\" href=\"" + esc(item.link_url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + esc(item.link_label || "Link") + "</a>" : "";
    inner.innerHTML = imgHtml + tagHtml +
      "<p class=\"word-modal-text\">" + esc(item.text) + "</p>" +
      srcHtml +
      "<div class=\"word-modal-btns\">" +
        "<a class=\"word-modal-btn word-btn-x\" href=\"" + tweetHref + "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
        "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z\"/></svg>" +
        "X\u3067\u30b7\u30a7\u30a2</a>" + linkBtn +
      "</div>";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeModal(); });

  async function load() {
    var section = document.getElementById("word-section");
    if (!section) return;
    var data;
    try {
      var res = await fetch("/_data/word.json?v=" + Date.now());
      if (!res.ok) throw new Error();
      data = await res.json();
    } catch (_) {
      section.innerHTML = "<p style=\"color:#444;text-align:center;padding:4rem 0\">\u30c7\u30fc\u30bf\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3067\u3057\u305f</p>";
      return;
    }
    var items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) {
      section.innerHTML = "<p class=\"word-empty\">\u2014 \u307e\u3060\u767b\u9332\u3055\u308c\u3066\u3044\u307e\u305b\u3093 \u2014</p>";
      return;
    }
    var wrap = document.createElement("div");
    wrap.className = "word-scroll-wrap";
    var scroll = document.createElement("div");
    scroll.className = "word-scroll";
    items.forEach(function(item) {
      var p = document.createElement("p");
      p.className = "word-item";
      p.textContent = item.text;
      p.tabIndex = 0;
      p.setAttribute("role", "button");
      p.addEventListener("click", function() { openModal(item); });
      p.addEventListener("keydown", function(e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(item); } });
      scroll.appendChild(p);
    });
    var isDown = false, startX = 0, scrollX = 0;
    wrap.addEventListener("mousedown", function(e) { isDown = true; startX = e.pageX; scrollX = wrap.scrollLeft; wrap.style.cursor = "grabbing"; });
    wrap.addEventListener("mouseleave", function() { isDown = false; wrap.style.cursor = "grab"; });
    wrap.addEventListener("mouseup", function() { isDown = false; wrap.style.cursor = "grab"; });
    wrap.addEventListener("mousemove", function(e) { if (!isDown) return; e.preventDefault(); wrap.scrollLeft = scrollX - (e.pageX - startX); });
    wrap.appendChild(scroll);
    var hint = document.createElement("p");
    hint.className = "word-hint";
    hint.textContent = "\u2190 scroll \u2192  \u30af\u30ea\u30c3\u30af\u3067\u51fa\u5178\u3092\u898b\u308b";
    section.innerHTML = "";
    section.appendChild(hint);
    section.appendChild(wrap);
  }

  load();
})();