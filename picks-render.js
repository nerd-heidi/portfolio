/* picks-render.js */
(function () {
  var section = document.getElementById('picks-section');
  if (!section) return;

  var css = `
  .picks-index-title{font-size:clamp(20px,3vw,30px);font-weight:800;color:#fff;margin:0 0 20px}
  .picks-issue-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
  .picks-issue-card{display:block;padding:28px 24px;background:linear-gradient(135deg,#0e0b14 0%,#130f1c 100%);border:1px solid rgba(255,255,255,.1);border-radius:16px;text-decoration:none;transition:border-color .2s,transform .2s}
  .picks-issue-card:hover{border-color:rgba(167,128,255,.5);transform:translateY(-4px)}
  .picks-issue-eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(167,128,255,.75);margin:0 0 8px}
  .picks-issue-label{font-size:22px;font-weight:800;color:#fff;margin:0 0 6px}
  .picks-issue-count{font-size:12px;color:rgba(255,255,255,.4);margin:0 0 12px}
  .picks-issue-genres{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px}
  .picks-issue-genre{font-size:9px;font-weight:700;letter-spacing:.08em;padding:2px 7px;border-radius:100px;background:rgba(150,70,180,.15);border:1px solid rgba(150,70,180,.3);color:rgba(200,150,220,.9)}
  .picks-issue-artists{font-size:13px;color:rgba(255,255,255,.5);margin:0;font-style:italic}
  .picks-nav{display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap}
  .picks-back{font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s}
  .picks-back:hover{color:rgba(255,255,255,.9)}
  .picks-issue-h{font-size:clamp(18px,2.5vw,26px);font-weight:800;color:#fff;margin:0}
  .picks-filters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px}
  .picks-filter{padding:5px 14px;border-radius:100px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;letter-spacing:.03em}
  .picks-filter:hover{background:rgba(255,255,255,.08);color:#fff}
  .picks-filter.active{background:rgba(150,70,180,.22);border-color:rgba(150,70,180,.6);color:#fff}
  .picks-art-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  @media(max-width:720px){.picks-art-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:400px){.picks-art-grid{grid-template-columns:1fr}}
  .pick-art-card{display:flex;flex-direction:column}
  .pick-art-link{display:block;position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:12px;background:#1a1a2e;transition:box-shadow .25s}
  .pick-art-link:hover{box-shadow:0 4px 24px rgba(167,128,255,.3)}
  .pick-art-link img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}
  .pick-art-link:hover img{transform:scale(1.04)}
  .pick-art-no-img{display:flex;align-items:center;justify-content:center}
  .pick-art-placeholder-icon{font-size:2.5rem;color:rgba(255,255,255,.12)}
  .pick-art-info{padding:10px 2px 0}
  .pick-art-genre-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}
  .pick-art-genre-tag{font-size:9px;font-weight:700;letter-spacing:.08em;padding:2px 7px;border-radius:100px;background:rgba(150,70,180,.15);border:1px solid rgba(150,70,180,.3);color:rgba(200,150,220,.9)}
  .pick-art-title{font-size:14px;font-weight:700;color:#f0f0f0;margin:0 0 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .pick-art-artist{font-size:12px;color:rgba(255,255,255,.55);margin:0 0 8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .pick-art-btns{display:flex;gap:6px;margin-bottom:8px}
  .pick-art-btn{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:999px;font-size:10px;font-weight:700;text-decoration:none;transition:opacity .15s}
  .pick-art-btn:hover{opacity:.75}
  .pick-art-btn-yt{background:rgba(200,30,30,.15);border:1px solid rgba(200,30,30,.35);color:rgba(220,100,100,.9)}
  .pick-art-comment{display:flex;align-items:flex-start;gap:8px;margin-top:6px;padding:10px 12px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06)}
  .pick-art-char{width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1.5px solid rgba(255,255,255,.15)}
  .pick-art-char-melody{object-position:72% 12%}
  .pick-art-char-seeno{object-position:55% 5%}
  .pick-art-comment-text{font-size:12px;color:rgba(255,255,255,.6);line-height:1.5;margin:0}
  `;
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var GENRES = [
    { key: 'all',        label: 'すべて' },
    { key: 'j-pop',      label: 'J-Pop' },
    { key: 'hip-hop',    label: 'Hip-Hop' },
    { key: 'r-b',        label: 'R&amp;B' },
    { key: 'rock',       label: 'Rock' },
    { key: 'electronic', label: 'Electronic' },
    { key: 'idol',       label: 'Idol' },
    { key: 'anime',      label: 'Anime' },
    { key: 'other',      label: 'その他' }
  ];

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getHash() { return location.hash.replace('#', ''); }

  function getTrackId(url) {
    if (!url) return null;
    var m = url.match(/[?&]i=(\d+)/);
    return m ? m[1] : null;
  }

  async function getArtwork(url) {
    var id = getTrackId(url);
    if (!id) return null;
    try {
      var r = await fetch('https://itunes.apple.com/lookup?id=' + id);
      var d = await r.json();
      if (d.results && d.results[0]) {
        var art = d.results[0].artworkUrl100 || null;
        return art ? art.replace(/\d+x\d+bb/, '600x600bb') : null;
      }
    } catch (_) {}
    return null;
  }

  function load(cb) {
    fetch('/_data/picks.json')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(cb)
      .catch(function () {
        section.innerHTML = '<p style="color:rgba(255,255,255,.4);padding:40px 0">データがありません。</p>';
      });
  }

  async function init(data) {
    var issues = (data.issues || []).slice().reverse();
    var hash = getHash();
    var issue = hash ? issues.find(function (i) { return i.id === hash; }) : null;
    if (issue) { await showIssue(issue); } else { showIndex(issues); }
  }

  load(init);
  window.addEventListener('hashchange', function () { load(init); });

  /* ── 一覧ページ ── */
  function showIndex(issues) {
    if (!issues.length) {
      section.innerHTML = '<p style="color:rgba(255,255,255,.4);padding:40px 0">まだ投稿がありません。</p>';
      return;
    }
    var h = '<h2 class="picks-index-title">Monthly Picks</h2><div class="picks-issue-grid">';
    issues.forEach(function (issue) {
      var items = issue.items || [];
      var artists = items.map(function (it) { return it.artist; }).filter(Boolean).slice(0, 4).join(', ');
      var genres = [];
      items.forEach(function (it) {
        (it.genres || []).forEach(function (g) { if (genres.indexOf(g) === -1) genres.push(g); });
      });
      h += '<a class="picks-issue-card" href="/picks/#' + esc(issue.id) + '">';
      h += '<p class="picks-issue-eyebrow">Monthly Picks</p>';
      h += '<p class="picks-issue-label">' + esc(issue.title || issue.id) + '</p>';
      h += '<p class="picks-issue-count">' + items.length + ' tracks</p>';
      if (genres.length) {
        h += '<div class="picks-issue-genres">';
        genres.forEach(function (g) { h += '<span class="picks-issue-genre">' + esc(g.toUpperCase().replace(/-/g, ' ')) + '</span>'; });
        h += '</div>';
      }
      if (artists) h += '<p class="picks-issue-artists">' + esc(artists) + '</p>';
      h += '</a>';
    });
    h += '</div>';
    section.innerHTML = h;
  }

  /* ── 号詳細ページ ── */
  async function showIssue(issue) {
    var items = issue.items || [];
    section.innerHTML =
      '<div class="picks-nav">' +
      '<a class="picks-back" href="/picks/">\u2190 \u4e00\u89a7\u306b\u623b\u308b</a>' +
      '<h2 class="picks-issue-h">' + esc(issue.title || issue.id) + '</h2>' +
      '</div><p style="color:rgba(255,255,255,.35);padding:12px 0;font-size:13px">\u30a2\u30fc\u30c8\u30ef\u30fc\u30af\u3092\u53d6\u5f97\u4e2d\u2026</p>';

    var artworks = await Promise.all(items.map(function (item) { return getArtwork(item.apple_music_url); }));

    var h = '<div class="picks-nav">' +
      '<a class="picks-back" href="/picks/">\u2190 \u4e00\u89a7\u306b\u623b\u308b</a>' +
      '<h2 class="picks-issue-h">' + esc(issue.title || issue.id) + '</h2>' +
      '</div>';

    h += '<div class="picks-filters">';
    GENRES.forEach(function (g) {
      h += '<button class="picks-filter' + (g.key === 'all' ? ' active' : '') + '" data-filter="' + g.key + '">' + g.label + '</button>';
    });
    h += '</div>';

    h += '<div class="picks-art-grid" id="picks-art-grid">';
    items.forEach(function (item, i) {
      var art = artworks[i];
      var genres = item.genres || [];
      var genreStr = genres.join(' ');
      h += '<div class="pick-art-card" data-genres="' + esc(genreStr) + '">';
      if (art && item.apple_music_url) {
        h += '<a class="pick-art-link" href="' + esc(item.apple_music_url) + '" target="_blank" rel="noopener noreferrer">';
        h += '<img src="' + esc(art) + '" alt="' + esc(item.track_title || '') + '" loading="lazy" />';
        h += '</a>';
      } else {
        var hrefAttr = item.apple_music_url ? ' href="' + esc(item.apple_music_url) + '" target="_blank" rel="noopener noreferrer"' : '';
        var tag = item.apple_music_url ? 'a' : 'div';
        h += '<' + tag + ' class="pick-art-link pick-art-no-img"' + hrefAttr + '>';
        h += '<span class="pick-art-placeholder-icon">&#9835;</span>';
        h += '</' + tag + '>';
      }
      h += '<div class="pick-art-info">';
      if (genres.length) {
        h += '<div class="pick-art-genre-tags">';
        genres.forEach(function (g) { h += '<span class="pick-art-genre-tag">' + esc(g.toUpperCase().replace(/-/g, ' ')) + '</span>'; });
        h += '</div>';
      }
      if (item.track_title) h += '<p class="pick-art-title">' + esc(item.track_title) + '</p>';
      h += '<p class="pick-art-artist">' + esc(item.artist || '') + '</p>';
      if (item.youtube_id) {
        h += '<div class="pick-art-btns"><a class="pick-art-btn pick-art-btn-yt" href="https://www.youtube.com/watch?v=' + esc(item.youtube_id) + '" target="_blank" rel="noopener noreferrer">&#9654; YouTube MV</a></div>';
      }
      h += '</div>';
      if (item.comment) {
        var ch = item.character === 'seeno' ? 'seeno' : 'melody';
        var img = ch === 'seeno' ? 'chatbot-seeno' : 'chatbot-char';
        h += '<div class="pick-art-comment"><img class="pick-art-char pick-art-char-' + ch + '" src="/images/' + img + '.png" alt="' + ch + '" /><p class="pick-art-comment-text">' + esc(item.comment) + '</p></div>';
      }
      h += '</div>';
    });
    h += '</div>';
    section.innerHTML = h;

    var btns = section.querySelectorAll('.picks-filter');
    var cards = section.querySelectorAll('.pick-art-card');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function (card) {
          card.style.display = (f === 'all' || (card.getAttribute('data-genres') || '').indexOf(f) !== -1) ? '' : 'none';
        });
      });
    });
  }
})();