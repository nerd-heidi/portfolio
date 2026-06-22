(function () {
  var css = `
  #word-section { padding: 0 0 5rem }
  /* shuffle hero */
  .word-shuffle-hero {
    display: flex;
    align-items: stretch;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 2rem;
    border: 1px solid rgba(167,128,255,0.25);
  }
  .word-melody-panel {
    background: rgba(255,255,255,0.93);
    width: 120px;
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0.5rem 0.5rem 0;
  }
  .word-melody-img {
    width: 100px;
    height: auto;
    display: block;
    object-fit: contain;
  }
  .word-shuffle-content {
    flex: 1;
    background: rgba(167,128,255,0.08);
    padding: 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.65rem;
  }
  .word-shuffle-count {
    font-size: 0.8rem;
    color: #aaa;
    letter-spacing: 0.06em;
  }
  .word-refresh {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.8rem 2rem;
    border-radius: 999px;
    background: rgba(167,128,255,0.2);
    border: 1.5px solid rgba(167,128,255,0.55);
    color: #d4bcff;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    width: fit-content;
    white-space: nowrap;
  }
  .word-refresh:hover {
    background: rgba(167,128,255,0.35);
    border-color: rgba(167,128,255,0.8);
    color: #ecdeff;
  }
  .word-refresh svg { transition: transform 0.5s ease }
  .word-refresh.spin svg { transform: rotate(360deg) }
  .word-shuffle-hint {
    font-size: 0.73rem;
    color: #888;
    letter-spacing: 0.04em;
  }
  @media (max-width: 480px) {
    .word-melody-panel { width: 86px }
    .word-melody-img { width: 74px }
    .word-shuffle-content { padding: 1.25rem 1.25rem }
    .word-refresh { font-size: 0.88rem; padding: 0.7rem 1.4rem }
  }
  /* grid: CSS columns for natural height per card */
  .word-grid {
    columns: 2;
    column-gap: 1.25rem;
  }
  @media (max-width: 640px) { .word-grid { columns: 1 } }
  /* card */
  .word-card {
    break-inside: avoid;
    margin-bottom: 1.25rem;
    background: #1a1a1a;
    border: 1px solid #3d3d3d;
    border-radius: 14px;
    padding: 1.5rem 1.5rem 1.2rem;
    display: block;
    transition: border-color 0.25s, transform 0.25s;
  }
  .word-card:hover {
    border-color: rgba(167,128,255,0.45);
    transform: translateY(-3px);
  }
  .word-card-head {
    display: flex;
    align-items: baseline;
    gap: 0.7rem;
    margin-bottom: 0.85rem;
  }
  .word-qmark {
    font-family: Georgia, serif;
    font-size: 3rem;
    line-height: 0.75;
    color: rgba(167,128,255,0.32);
    flex-shrink: 0;
  }
  .word-tag {
    display: inline-block;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: rgba(167,128,255,0.18);
    color: #c0a0ff;
    align-self: center;
  }
  .word-text {
    font-size: 1.15rem;
    line-height: 1.95;
    color: #f5f5f5;
    font-style: italic;
    margin: 0 0 1.2rem;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .word-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .word-src {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
  }
  .word-src-line {
    flex-shrink: 0;
    width: 1.2rem;
    height: 1px;
    background: rgba(167,128,255,0.8);
  }
  .word-src-text {
    font-size: 0.84rem;
    font-weight: 500;
    color: #d0d0d0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .word-x-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .word-x-btn:hover {
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.85);
    border-color: rgba(255,255,255,0.3);
  }
  .word-empty {
    text-align: center; color: #555;
    padding: 5rem 1.25rem;
    font-size: 0.9rem; letter-spacing: 0.08em;
  }
  `;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var TAG_LABEL = { lyric: "Lyric", quote: "Quote", movie: "Movie", book: "Book", anime: "Anime", other: "Other" };

  function esc(s) {
    return s ? String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "";
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function makeCard(item) {
    var tagHtml = (item.tag && TAG_LABEL[item.tag])
      ? "<span class=\"word-tag\">" + TAG_LABEL[item.tag] + "</span>"
      : "";
    var shareText = item.source
      ? "\u300C" + item.text + "\u300D\n\u2014 " + item.source
      : "\u300C" + item.text + "\u300D";
    var tweetHref = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent("https://nerd-heidi.com/word/");
    var srcHtml = item.source
      ? "<div class=\"word-src\"><span class=\"word-src-line\"></span><span class=\"word-src-text\">" + esc(item.source) + "</span></div>"
      : "<span></span>";
    return "<div class=\"word-card\">" +
      "<div class=\"word-card-head\"><span class=\"word-qmark\">\u201C</span>" + tagHtml + "</div>" +
      "<p class=\"word-text\">" + esc(item.text) + "</p>" +
      "<div class=\"word-foot\">" + srcHtml +
        "<a class=\"word-x-btn\" href=\"" + tweetHref + "\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"X\u3067\u30b7\u30a7\u30a2\">" +
          "<svg width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z\"/></svg>" +
        "</a>" +
      "</div>" +
    "</div>";
  }

  async function load() {
    var section = document.getElementById("word-section");
    if (!section) return;
    var data;
    try {
      var res = await fetch("/_data/word.json?v=" + Date.now());
      if (!res.ok) throw new Error();
      data = await res.json();
    } catch (_) {
      section.innerHTML = "<p style=\"color:#555;text-align:center;padding:4rem 0\">\u30c7\u30fc\u30bf\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3067\u3057\u305f</p>";
      return;
    }
    var items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) {
      section.innerHTML = "<p class=\"word-empty\">\u2014 \u307e\u3060\u767b\u9332\u3055\u308c\u3066\u3044\u307e\u305b\u3093 \u2014</p>";
      return;
    }
    section.innerHTML =
      "<div class=\"word-shuffle-hero\">" +
        "<div class=\"word-melody-panel\">" +
          "<img class=\"word-melody-img\" src=\"/images/chatbot-char.png\" alt=\"Melody\" />" +
        "</div>" +
        "<div class=\"word-shuffle-content\">" +
          "<span class=\"word-shuffle-count\">" + items.length + " words</span>" +
          "<button class=\"word-refresh\" id=\"word-refresh\">" +
            "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"1 4 1 10 7 10\"/><path d=\"M3.51 15a9 9 0 1 0 .49-4.95\"/></svg>" +
            "Shuffle" +
          "</button>" +
          "<span class=\"word-shuffle-hint\">\u6700\u592710\u4ef6\u3092\u30e9\u30f3\u30c0\u30e0\u8868\u793a</span>" +
        "</div>" +
      "</div>" +
      "<div class=\"word-grid\" id=\"word-grid\"></div>";
    var grid = document.getElementById("word-grid");
    function renderGrid() {
      var shown = shuffle(items).slice(0, Math.min(10, items.length));
      grid.innerHTML = shown.map(makeCard).join("");
    }
    renderGrid();
    document.getElementById("word-refresh").addEventListener("click", function() {
      var btn = this;
      btn.classList.add("spin");
      renderGrid();
      setTimeout(function() { btn.classList.remove("spin"); }, 500);
    });
  }

  load();
})();