(function () {
  var css = `
  #word-section { padding: 0 0 5rem }
  /* ── hero ── */
  .word-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.5rem;
    gap: 0.55rem;
  }
  .word-melody-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: block;
    transition: transform 0.25s ease;
  }
  .word-melody-btn:hover { transform: scale(1.06) translateY(-5px) }
  .word-melody-btn:active { transform: scale(0.95) }
  .word-melody-img {
    width: 220px;
    height: auto;
    display: block;
  }
  @keyframes melody-bounce {
    0%   { transform: scale(1) rotate(0deg) }
    30%  { transform: scale(0.91) rotate(-7deg) }
    65%  { transform: scale(1.09) rotate(3deg) }
    100% { transform: scale(1) rotate(0deg) }
  }
  .word-melody-btn.spin .word-melody-img {
    animation: melody-bounce 0.5s ease;
  }
  .word-hero-meta {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }
  .word-shuffle-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #c4a8ff;
    text-transform: uppercase;
  }
  .word-hero-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #555;
  }
  .word-shuffle-count {
    font-size: 0.78rem;
    color: #777;
    letter-spacing: 0.05em;
  }
  /* ── grid ── */
  .word-grid {
    columns: 2;
    column-gap: 1.25rem;
  }
  @media (max-width: 640px) { .word-grid { columns: 1 } }
  /* ── card ── */
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
    font-size: 1.95rem;
    line-height: 2;
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
    gap: 0.5rem;
    min-width: 0;
  }
  .word-src-line {
    flex-shrink: 0;
    width: 1.2rem;
    height: 1px;
    background: rgba(167,128,255,0.8);
  }
  .word-src-text {
    font-size: 1.4rem;
    font-weight: 500;
    color: #d5d5d5;
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
      "<div class=\"word-hero\">" +
        "<button class=\"word-melody-btn\" id=\"word-refresh\" aria-label=\"Shuffle\">" +
          "<img class=\"word-melody-img\" src=\"/images/Melody-shuffle.png\" alt=\"Melody\" />" +
        "</button>" +
        "<div class=\"word-hero-meta\">" +
          "<span class=\"word-shuffle-label\">Shuffle</span>" +
          "<span class=\"word-hero-dot\"></span>" +
          "<span class=\"word-shuffle-count\">" + items.length + " words</span>" +
        "</div>" +
      "</div>" +
      "<div class=\"word-grid\" id=\"word-grid\"></div>";
    var grid = document.getElementById("word-grid");
    function renderGrid() {
      var shown = shuffle(items).slice(0, Math.min(10, items.length));
      grid.innerHTML = shown.map(makeCard).join("");
    }
    renderGrid();
    document.getElementById("word-refresh").addEventListener("click", function () {
      var btn = this;
      btn.classList.add("spin");
      renderGrid();
      setTimeout(function () { btn.classList.remove("spin"); }, 500);
    });
  }

  load();
})();