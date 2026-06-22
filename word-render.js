(function () {
  var css = `
  #word-section { padding: 0 0 5rem; overflow: visible; }
  /* word page: close the gap so hero image can straddle the divider */
  .page-hero { margin-bottom: 0 !important; }
  /* ── hero ── */
  .word-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -130px;
    margin-bottom: 1.5rem;
    gap: 0.3rem;
    position: relative;
    z-index: 2;
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
    width: 260px;
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
  .word-cols {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
  }
  .word-col {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  /* ── card ── */
  .word-card {
    background: #1a1a1a;
    border: 2px solid #3d3d3d;
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
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(167,128,255,0.4);
    background: rgba(167,128,255,0.18);
    color: #c0a0ff;
    align-self: center;
  }
  .word-tag--lyric { background: rgba(167,128,255,0.22); color: #c8aaff; border-color: rgba(167,128,255,0.55); }
  .word-tag--quote { background: rgba(255,195,80,0.18);  color: #ffc84a; border-color: rgba(255,195,80,0.5); }
  .word-tag--movie { background: rgba(255,95,85,0.18);   color: #ff8878; border-color: rgba(255,95,85,0.5); }
  .word-tag--book  { background: rgba(65,200,145,0.18);  color: #4ed49a; border-color: rgba(65,200,145,0.5); }
  .word-tag--anime { background: rgba(75,165,255,0.18);  color: #66b3ff; border-color: rgba(75,165,255,0.5); }
  .word-tag--other { background: rgba(155,155,155,0.15); color: #b5b5b5; border-color: rgba(155,155,155,0.45); }
  .word-card--lyric { border-color: rgba(167,128,255,0.45); }
  .word-card--quote { border-color: rgba(255,195,80,0.4); }
  .word-card--movie { border-color: rgba(255,95,85,0.4); }
  .word-card--book  { border-color: rgba(65,200,145,0.4); }
  .word-card--anime { border-color: rgba(75,165,255,0.4); }
  .word-card--other { border-color: rgba(155,155,155,0.38); }
  .word-text {
    font-size: 1.56rem;
    line-height: 2;
    color: #f5f5f5;
    font-family: "Yu Gothic", "游ゴシック", YuGothic, sans-serif;
    font-weight: bold;
    font-style: normal;
    margin: 0 0 1.2rem;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .word-foot {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
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
  }
  .word-empty {
    text-align: center; color: #555;
    padding: 5rem 1.25rem;
    font-size: 0.9rem; letter-spacing: 0.08em;
  }
  .word-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.82rem;
    color: #c4a8ff;
    text-decoration: none;
    margin-top: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(167,128,255,0.35);
    background: rgba(167,128,255,0.08);
    transition: background 0.2s, color 0.2s;
  }
  .word-link:hover {
    background: rgba(167,128,255,0.2);
    color: #d4bcff;
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
      ? "<span class=\"word-tag word-tag--" + item.tag + "\">" + TAG_LABEL[item.tag] + "</span>"
      : "";
    var cardClass = "word-card" + (item.tag ? " word-card--" + item.tag : "");
    var srcHtml = item.source
      ? "<div class=\"word-foot\"><div class=\"word-src\"><span class=\"word-src-line\"></span><span class=\"word-src-text\">" + esc(item.source) + "</span></div></div>"
      : "";
    var linkHtml = item.link_url
      ? "<a class=\"word-link\" href=\"" + esc(item.link_url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + esc(item.link_label || item.link_url) + "</a>"
      : "";
    return "<div class=\"" + cardClass + "\">" +
      "<div class=\"word-card-head\"><span class=\"word-qmark\">\u201C</span>" + tagHtml + "</div>" +
      "<p class=\"word-text\">" + esc(item.text) + "</p>" +
      srcHtml +
      linkHtml +
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
      "<div id=\"word-cols-wrap\"></div>";
    var wrap = document.getElementById("word-cols-wrap");
    var resizeTimer;
    function getNumCols() {
      return window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
    }
    function renderGrid() {
      var shown = shuffle(items).slice(0, Math.min(10, items.length));
      var n = getNumCols();
      var cols = [];
      for (var c = 0; c < n; c++) cols.push([]);
      shown.forEach(function (item, i) { cols[i % n].push(item); });
      var html = "<div class=\"word-cols\">";
      cols.forEach(function (col) {
        html += "<div class=\"word-col\">" + col.map(makeCard).join("") + "</div>";
      });
      html += "</div>";
      wrap.innerHTML = html;
    }
    renderGrid();
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderGrid, 150);
    });
    document.getElementById("word-refresh").addEventListener("click", function () {
      var btn = this;
      btn.classList.add("spin");
      renderGrid();
      setTimeout(function () { btn.classList.remove("spin"); }, 500);
    });
  }

  load();
})();