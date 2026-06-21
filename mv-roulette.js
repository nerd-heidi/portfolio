/* mv-roulette.js – おすすめ MV ルーレット（左：バナー / 右：結果パネル） */
(function () {
  var section = document.getElementById('mv-roulette');
  if (!section) return;

  var css =
    '#mv-roulette{padding:0 24px 0;}' +
    '.mvr-wrap{' +
      'max-width:900px;margin:0 auto;' +
      'display:flex;align-items:stretch;' +
      'background:#0d0910;border-radius:18px;overflow:hidden;' +
      'border:1px solid rgba(200,100,200,.22);}' +
    /* 左：バナーボタン */
    '.mvr-banner-btn{' +
      'flex:0 0 58%;display:block;' +
      'border:none;padding:0;background:none;cursor:pointer;' +
      'transition:filter .2s;outline:none;overflow:hidden;}' +
    '.mvr-banner-btn:hover{filter:brightness(1.09);}' +
    '.mvr-banner-btn:active{filter:brightness(.88);}' +
    '.mvr-banner-btn img{width:100%;height:100%;object-fit:cover;display:block;}' +
    /* 右：結果パネル */
    '.mvr-result{' +
      'flex:1;display:flex;flex-direction:column;' +
      'justify-content:center;align-items:center;' +
      'padding:16px 18px;gap:10px;' +
      'background:linear-gradient(160deg,#130f1c 0%,#0d0b14 100%);' +
      'border-left:1px solid rgba(200,100,200,.18);}' +
    '.mvr-result-label{' +
      'font-size:10px;color:rgba(220,130,220,.85);letter-spacing:.14em;' +
      'font-weight:700;margin:0;text-transform:uppercase;}' +
    '.mvr-thumb-wrap{' +
      'width:100%;aspect-ratio:16/9;' +
      'border-radius:10px;overflow:hidden;background:#111;' +
      'box-shadow:0 4px 20px rgba(0,0,0,.6);}' +
    '.mvr-thumb-wrap img{width:100%;height:100%;object-fit:cover;display:block;}' +
    '.mvr-info{width:100%;text-align:center;padding:0 4px;}' +
    '.mvr-song{' +
      'display:block;font-size:clamp(11px,1.3vw,17px);font-weight:700;' +
      'color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-artist{' +
      'display:block;font-size:clamp(11px,1.3vw,17px);' +
      'color:rgba(255,255,255,.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' +
      'margin-top:.3em;}' +
    '.mvr-yt-link{' +
      'display:inline-block;margin-top:10px;' +
      'padding:5px 15px;border-radius:100px;' +
      'background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);' +
      'color:rgba(255,255,255,.55);font-size:11px;font-weight:700;text-decoration:none;' +
      'transition:background .2s,color .2s;}' +
    '.mvr-yt-link:hover{background:rgba(255,255,255,.14);color:rgba(255,255,255,.9);}' +
    '.mvr-hint{' +
      'text-align:center;font-size:11px;color:rgba(255,255,255,.22);' +
      'margin:6px 0 0;letter-spacing:.05em;}' +
    '#mv-roulette+.topic-grid{margin-top:16px!important;}' +
    '@media(max-width:580px){' +
      '.mvr-wrap{flex-direction:column;}' +
      '.mvr-banner-btn{flex:none;width:100%;}' +
      '.mvr-result{padding:12px 14px;gap:8px;}' +
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
      if (!items.length) { section.innerHTML = ''; return; }
      render(items);
    })
    .catch(function () { section.innerHTML = ''; });

  function render(items) {
    var idx = Math.floor(Math.random() * items.length);

    section.innerHTML = [
      '<div class="mvr-wrap">',
        '<button class="mvr-banner-btn" id="mvr-banner" aria-label="シャッフル">',
          '<img src="/images/Shuffle2.png" alt="MV Shuffle" />',
        '</button>',
        '<div class="mvr-result">',
          '<p class="mvr-result-label">♪ Pick !</p>',
          '<div class="mvr-thumb-wrap">',
            '<img id="mvr-thumb" src="" alt="" />',
          '</div>',
          '<div class="mvr-info">',
            '<span class="mvr-song" id="mvr-song"></span>',
            '<span class="mvr-artist" id="mvr-artist"></span>',
          '</div>',
          '<a class="mvr-yt-link" id="mvr-yt" href="#" target="_blank" rel="noopener noreferrer">▶ YouTube で見る</a>',
        '</div>',
      '</div>',
      items.length > 1 ? '<p class="mvr-hint">バナーをクリックしてシャッフル ✦</p>' : ''
    ].join('');

    function update(i) {
      var mv = items[i];
      var wu = watchUrl(mv.youtube_id);
      document.getElementById('mvr-thumb').src = thumbUrl(mv.youtube_id);
      document.getElementById('mvr-thumb').alt = esc(mv.title);
      document.getElementById('mvr-song').textContent   = mv.title || '';
      document.getElementById('mvr-artist').textContent = mv.artist || '';
      document.getElementById('mvr-yt').href = wu;
    }
    update(idx);

    if (items.length < 2) return;

    var banner = document.getElementById('mvr-banner');
    banner.addEventListener('click', function () {
      if (banner.disabled) return;
      banner.disabled = true;

      var steps = 18, cur = 0, delays = [];
      for (var i = 0; i < steps; i++) delays.push(i < 12 ? 75 : 75 + (i - 11) * 55);

      function step() {
        var next;
        do { next = Math.floor(Math.random() * items.length); } while (next === idx && items.length > 1);
        idx = next;
        update(idx);
        cur++;
        if (cur < steps) { setTimeout(step, delays[cur]); }
        else { banner.disabled = false; }
      }
      setTimeout(step, delays[0]);
    });
  }
})();