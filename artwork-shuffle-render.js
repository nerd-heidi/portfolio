(function () {
  var css = `
  #artwork-section { padding: 0 0 5rem }
  /* ── banner hero ── */
  .artwork-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.75rem;
  }
  .artwork-shuffle-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 100%;
    max-width: 720px;
    display: block;
    border-radius: 14px;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    box-shadow: 0 4px 28px rgba(0,0,0,0.5);
  }
  .artwork-shuffle-btn:hover { transform: scale(1.018); box-shadow: 0 8px 36px rgba(0,0,0,0.65); }
  .artwork-shuffle-btn:active { transform: scale(0.98); }
  .artwork-shuffle-banner {
    width: 100%;
    height: auto;
    display: block;
  }
  @keyframes banner-pulse {
    0%   { transform: scale(1) }
    35%  { transform: scale(0.97) }
    70%  { transform: scale(1.02) }
    100% { transform: scale(1) }
  }
  .artwork-shuffle-btn.spin .artwork-shuffle-banner {
    animation: banner-pulse 0.45s ease;
  }
  .artwork-hint {
    margin-top: 0.65rem;
    font-size: 0.75rem;
    color: #666;
    letter-spacing: 0.06em;
  }
  /* ── grid ── */
  .artwork-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  @media (max-width: 900px) { .artwork-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 600px) { .artwork-grid { grid-template-columns: repeat(2, 1fr); } }
  /* ── card ── */
  .artwork-card {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 8px;
    display: block;
    background: #1a1a1a;
    text-decoration: none;
  }
  .artwork-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }
  .artwork-card:hover img { transform: scale(1.07); }
  .artwork-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%, transparent 100%);
    opacity: 0;
    transition: opacity 0.25s;
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .artwork-card:hover .artwork-overlay { opacity: 1; }
  .artwork-track {
    font-size: 0.65rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .artwork-artist {
    font-size: 0.58rem;
    color: rgba(255,255,255,0.7);
    margin-top: 0.12rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /* ── skeleton ── */
  .artwork-skeleton {
    aspect-ratio: 1;
    border-radius: 8px;
    background: linear-gradient(90deg, #1a1a1a 25%, #272727 50%, #1a1a1a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite linear;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0 }
    100% { background-position: -200% 0 }
  }
  `;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

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

  async function fetchArtwork(item) {
    var url = item.apple_music_url;
    if (!url) return null;
    var trackMatch = url.match(/[?&]i=(\d+)/);
    var albumMatch = url.match(/\/album\/[^/]+\/(\d+)/);
    var id = trackMatch ? trackMatch[1] : (albumMatch ? albumMatch[1] : null);
    if (!id) return null;
    try {
      var res = await fetch("https://itunes.apple.com/lookup?id=" + id + "&country=jp");
      var data = await res.json();
      var r = data.results && data.results[0];
      if (!r || !r.artworkUrl100) return null;
      return {
        artwork: r.artworkUrl100.replace("100x100bb", "600x600bb"),
        title: r.trackName || r.collectionName || item.title || "",
        artist: r.artistName || item.artist || "",
        url: url
      };
    } catch (_) { return null; }
  }

  async function load() {
    var section = document.getElementById("artwork-section");
    if (!section) return;
    var data;
    try {
      var res = await fetch("/_data/artwork.json");
      if (!res.ok) throw new Error();
      data = await res.json();
    } catch (_) {
      section.innerHTML = "<p style=\"color:#555;text-align:center;padding:4rem 0\">\u30c7\u30fc\u30bf\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3067\u3057\u305f</p>";
      return;
    }
    var items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) {
      section.innerHTML = "<p style=\"color:#555;text-align:center;padding:4rem 0\">\u2014 \u307e\u3060\u767b\u9332\u3055\u308c\u3066\u3044\u307e\u305b\u3093 \u2014</p>";
      return;
    }
    section.innerHTML =
      "<div class=\"artwork-hero\">" +
        "<button class=\"artwork-shuffle-btn\" id=\"artwork-btn\" aria-label=\"\u30a2\u30fc\u30c8\u30ef\u30fc\u30af\u3092\u30b7\u30e3\u30c3\u30d5\u30eb\">" +
          "<img class=\"artwork-shuffle-banner\" src=\"/images/Shuffle3.png\" alt=\"Artwork Shuffle\" decoding=\"async\" />" +
        "</button>" +
        "<span class=\"artwork-hint\">\u30af\u30ea\u30c3\u30af\u3067\u30b7\u30e3\u30c3\u30d5\u30eb \u30fb Apple Music\u3078\u30ea\u30f3\u30af</span>" +
      "</div>" +
      "<div id=\"artwork-grid\" class=\"artwork-grid\"></div>";

    var grid = document.getElementById("artwork-grid");
    var cache = {};

    async function renderGrid() {
      var n = Math.min(20, items.length);
      var shown = shuffle(items).slice(0, n);
      grid.innerHTML = Array(n).fill("<div class=\"artwork-skeleton\"></div>").join("");
      var results = await Promise.all(shown.map(function (item) {
        var key = item.apple_music_url;
        if (cache[key]) return Promise.resolve(cache[key]);
        return fetchArtwork(item).then(function (r) { if (r) cache[key] = r; return r; });
      }));
      grid.innerHTML = results.map(function (r) {
        if (!r || !r.artwork) return "";
        return "<a class=\"artwork-card\" href=\"" + esc(r.url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
          "<img src=\"" + esc(r.artwork) + "\" alt=\"" + esc(r.title) + "\" loading=\"lazy\" />" +
          "<div class=\"artwork-overlay\">" +
            "<span class=\"artwork-track\">" + esc(r.title) + "</span>" +
            "<span class=\"artwork-artist\">" + esc(r.artist) + "</span>" +
          "</div>" +
        "</a>";
      }).join("");
    }

    renderGrid();
    document.getElementById("artwork-btn").addEventListener("click", function () {
      var btn = this;
      btn.classList.add("spin");
      renderGrid();
      setTimeout(function () { btn.classList.remove("spin"); }, 450);
    });
  }

  load();
})();