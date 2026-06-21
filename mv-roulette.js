/* mv-roulette.js – おすすめ MV ルーレット */
(function () {
  var section = document.getElementById('mv-roulette');
  if (!section) return;

  var css =
    '#mv-roulette{padding:56px 24px 64px;}' +
    '.mvr-inner{max-width:500px;margin:0 auto;text-align:center;}' +
    '.mvr-heading{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;' +
      'color:rgba(255,255,255,.3);margin:0 0 18px;}' +
    '.mvr-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);' +
      'border-radius:18px;overflow:hidden;margin-bottom:16px;transition:box-shadow .3s;}' +
    '.mvr-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.4);}' +
    '.mvr-thumb-wrap{position:relative;display:block;aspect-ratio:16/9;overflow:hidden;' +
      'background:#111;}' +
    '.mvr-thumb{width:100%;height:100%;object-fit:cover;display:block;' +
      'transition:transform .4s,opacity .15s;}' +
    '.mvr-thumb-wrap:hover .mvr-thumb{transform:scale(1.04);}' +
    '.mvr-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,.18);transition:background .2s;}' +
    '.mvr-thumb-wrap:hover .mvr-play{background:rgba(0,0,0,.35);}' +
    '.mvr-play svg{width:56px;height:56px;filter:drop-shadow(0 2px 10px rgba(0,0,0,.6));}' +
    '.mvr-info{padding:14px 20px 16px;text-align:left;}' +
    '.mvr-song{font-size:16px;font-weight:700;color:rgba(255,255,255,.88);margin:0 0 4px;' +
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-artist{font-size:13px;color:rgba(255,255,255,.38);margin:0;' +
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-actions{display:flex;gap:10px;justify-content:center;}' +
    '.mvr-shuffle{flex:1;max-width:210px;padding:13px 0;border-radius:100px;' +
      'background:rgba(167,128,255,.12);border:1px solid rgba(167,128,255,.28);' +
      'color:rgba(167,128,255,.9);font-weight:700;font-size:14px;cursor:pointer;' +
      'transition:background .2s,transform .15s;}' +
    '.mvr-shuffle:hover:not(:disabled){background:rgba(167,128,255,.22);transform:translateY(-2px);}' +
    '.mvr-shuffle:disabled{opacity:.45;cursor:not-allowed;}' +
    '.mvr-watch{flex:1;max-width:210px;padding:13px 0;border-radius:100px;' +
      'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);' +
      'color:rgba(255,255,255,.55);font-weight:700;font-size:14px;text-decoration:none;' +
      'display:inline-flex;align-items:center;justify-content:center;gap:6px;' +
      'transition:background .2s,transform .15s;}' +
    '.mvr-watch:hover{background:rgba(255,255,255,.1);transform:translateY(-2px);}' +
    '.mvr-empty{padding:48px 0;color:rgba(255,255,255,.2);font-size:13px;}' +
    '@keyframes mvr-blink{0%,100%{opacity:1}50%{opacity:.5}}' +
    '.mvr-spinning .mvr-thumb{animation:mvr-blink .12s steps(1) infinite;}';

  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  section.innerHTML = '<div class="mvr-inner"><p class="mvr-empty">Loading…</p></div>';

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function thumbUrl(id) { return 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg'; }
  function watchUrl(id) { return 'https://www.youtube.com/watch?v=' + encodeURIComponent(id); }

  fetch('/_data/mv-roulette.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var items = (data.items || []).filter(function (i) { return i.youtube_id; });
      if (!items.length) { section.innerHTML = ''; return; }
      render(items);
    })
    .catch(function () { section.innerHTML = ''; });

  function render(items) {
    var idx = Math.floor(Math.random() * items.length);

    function buildHTML(i) {
      var mv = items[i];
      var wu = watchUrl(mv.youtube_id);
      return [
        '<div class="mvr-inner">',
        '<p class="mvr-heading">🎬 おすすめ MV</p>',
        '<div class="mvr-card">',
          '<a class="mvr-thumb-wrap" id="mvr-link" href="' + esc(wu) + '" target="_blank" rel="noopener noreferrer">',
            '<img class="mvr-thumb" id="mvr-thumb" src="' + esc(thumbUrl(mv.youtube_id)) + '" alt="' + esc(mv.title) + '" />',
            '<div class="mvr-play">',
              '<svg viewBox="0 0 60 60" fill="none">',
                '<circle cx="30" cy="30" r="30" fill="rgba(255,255,255,0.15)"/>',
                '<polygon points="24,17 47,30 24,43" fill="white"/>',
              '</svg>',
            '</div>',
          '</a>',
          '<div class="mvr-info">',
            '<p class="mvr-song" id="mvr-song">' + esc(mv.title) + '</p>',
            '<p class="mvr-artist" id="mvr-artist">' + esc(mv.artist || '') + '</p>',
          '</div>',
        '</div>',
        '<div class="mvr-actions">',
          '<button class="mvr-shuffle" id="mvr-shuffle">🎲 シャッフル</button>',
          '<a class="mvr-watch" id="mvr-watch" href="' + esc(wu) + '" target="_blank" rel="noopener noreferrer">▶ YouTube で見る</a>',
        '</div>',
        '</div>'
      ].join('');
    }

    section.innerHTML = buildHTML(idx);

    var thumb  = document.getElementById('mvr-thumb');
    var link   = document.getElementById('mvr-link');
    var song   = document.getElementById('mvr-song');
    var artist = document.getElementById('mvr-artist');
    var watch  = document.getElementById('mvr-watch');
    var btn    = document.getElementById('mvr-shuffle');
    var card   = section.querySelector('.mvr-card');

    // サムネイル fallback
    thumb.onerror = function () {
      this.src = 'https://img.youtube.com/vi/' + items[idx].youtube_id + '/hqdefault.jpg';
    };

    function show(i) {
      var mv = items[i];
      var wu = watchUrl(mv.youtube_id);
      thumb.src = thumbUrl(mv.youtube_id);
      thumb.alt = esc(mv.title);
      link.href  = wu;
      watch.href = wu;
      song.textContent   = mv.title;
      artist.textContent = mv.artist || '';
    }

    btn.addEventListener('click', function () {
      if (items.length < 2) return;
      btn.disabled = true;
      card.classList.add('mvr-spinning');

      // 早→遅のイージング：20ステップ
      var steps  = 20;
      var cur    = 0;
      var delays = [];
      for (var i = 0; i < steps; i++) {
        delays.push(i < 14 ? 75 : 75 + (i - 13) * 55);
      }

      function step() {
        var next;
        do { next = Math.floor(Math.random() * items.length); } while (next === idx && items.length > 1);
        idx = next;
        show(idx);
        cur++;
        if (cur < steps) {
          setTimeout(step, delays[cur]);
        } else {
          card.classList.remove('mvr-spinning');
          btn.disabled = false;
        }
      }
      setTimeout(step, delays[0]);
    });
  }
})();
