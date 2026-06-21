/* mv-roulette.js – おすすめ MV ルーレット（画面下部固定バー） */
(function () {
  var css =
    '#mvr-bar{' +
      'position:fixed;bottom:0;left:0;right:0;height:64px;z-index:8500;' +
      'display:flex;align-items:center;gap:12px;padding:0 16px;' +
      'background:rgba(8,8,8,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
      'border-top:1px solid rgba(255,255,255,.08);' +
      'transform:translateY(100%);transition:transform .4s cubic-bezier(.4,0,.2,1);' +
    '}' +
    '#mvr-bar.visible{transform:translateY(0);}' +
    '.mvr-bar-thumb{' +
      'flex-shrink:0;width:44px;height:44px;border-radius:8px;overflow:hidden;' +
      'display:block;background:#1a1a1a;position:relative;' +
    '}' +
    '.mvr-bar-thumb img{width:100%;height:100%;object-fit:cover;display:block;}' +
    '.mvr-bar-play{' +
      'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,.25);font-size:11px;color:#fff;' +
    '}' +
    '.mvr-bar-info{flex:1;min-width:0;line-height:1.3;}' +
    '.mvr-bar-song{display:block;font-size:13px;font-weight:700;color:rgba(255,255,255,.88);' +
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-bar-artist{display:block;font-size:11px;color:rgba(255,255,255,.38);' +
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-bar-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}' +
    '.mvr-bar-yt{' +
      'padding:7px 14px;border-radius:100px;' +
      'background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);' +
      'color:rgba(255,255,255,.6);font-size:12px;font-weight:700;text-decoration:none;' +
      'white-space:nowrap;transition:background .2s;' +
    '}' +
    '.mvr-bar-yt:hover{background:rgba(255,255,255,.14);}' +
    '.mvr-bar-shuffle{' +
      'padding:7px 14px;border-radius:100px;' +
      'background:rgba(167,128,255,.12);border:1px solid rgba(167,128,255,.28);' +
      'color:rgba(167,128,255,.9);font-size:12px;font-weight:700;cursor:pointer;' +
      'white-space:nowrap;transition:background .2s;' +
    '}' +
    '.mvr-bar-shuffle:hover:not(:disabled){background:rgba(167,128,255,.24);}' +
    '.mvr-bar-shuffle:disabled{opacity:.45;cursor:not-allowed;}' +
    '#btt-btn{bottom:80px!important;}' +
    '@media(max-width:480px){' +
      '#mvr-bar{gap:8px;padding:0 10px;}' +
      '.mvr-bar-yt{display:none;}' +
      '.mvr-bar-song{font-size:12px;}' +
    '}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function thumbUrl(id) { return 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg'; }
  function watchUrl(id) { return 'https://www.youtube.com/watch?v=' + encodeURIComponent(id); }

  fetch('/_data/mv-roulette.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var items = (data.items || []).filter(function (i) { return i.youtube_id; });
      if (!items.length) return;
      render(items);
    })
    .catch(function () {});

  function render(items) {
    var idx = Math.floor(Math.random() * items.length);

    var bar = document.createElement('div');
    bar.id = 'mvr-bar';

    function buildBar(i) {
      var mv = items[i];
      var wu = watchUrl(mv.youtube_id);
      return [
        '<a class="mvr-bar-thumb" href="' + esc(wu) + '" target="_blank" rel="noopener noreferrer">',
          '<img id="mvr-bar-img" src="' + esc(thumbUrl(mv.youtube_id)) + '" alt="' + esc(mv.title) + '" />',
          '<div class="mvr-bar-play">▶</div>',
        '</a>',
        '<div class="mvr-bar-info">',
          '<span class="mvr-bar-song" id="mvr-bar-song">' + esc(mv.title) + '</span>',
          '<span class="mvr-bar-artist" id="mvr-bar-artist">' + esc(mv.artist || '') + '</span>',
        '</div>',
        '<div class="mvr-bar-actions">',
          '<a class="mvr-bar-yt" id="mvr-bar-yt" href="' + esc(wu) + '" target="_blank" rel="noopener noreferrer">▶ YouTube</a>',
          items.length > 1 ? '<button class="mvr-bar-shuffle" id="mvr-bar-shuffle">🎲 シャッフル</button>' : '',
        '</div>'
      ].join('');
    }

    bar.innerHTML = buildBar(idx);

    function inject() {
      document.body.appendChild(bar);
      setTimeout(function () { bar.classList.add('visible'); }, 100);
    }
    if (document.body) inject();
    else document.addEventListener('DOMContentLoaded', inject);

    if (items.length < 2) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('#mvr-bar-shuffle');
      if (!btn) return;
      btn.disabled = true;

      var steps  = 18;
      var cur    = 0;
      var delays = [];
      for (var i = 0; i < steps; i++) {
        delays.push(i < 12 ? 80 : 80 + (i - 11) * 50);
      }

      function step() {
        var next;
        do { next = Math.floor(Math.random() * items.length); } while (next === idx && items.length > 1);
        idx = next;
        var mv = items[idx];
        var wu = watchUrl(mv.youtube_id);
        var img   = document.getElementById('mvr-bar-img');
        var song  = document.getElementById('mvr-bar-song');
        var art   = document.getElementById('mvr-bar-artist');
        var yt    = document.getElementById('mvr-bar-yt');
        var thumb = bar.querySelector('.mvr-bar-thumb');
        if (img)   img.src = thumbUrl(mv.youtube_id);
        if (song)  song.textContent = mv.title;
        if (art)   art.textContent  = mv.artist || '';
        if (yt)    yt.href = wu;
        if (thumb) thumb.href = wu;
        cur++;
        if (cur < steps) {
          setTimeout(step, delays[cur]);
        } else {
          btn.disabled = false;
        }
      }
      setTimeout(step, delays[0]);
    });
  }
})();