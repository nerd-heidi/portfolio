/* mv-roulette.js – おすすめ MV ルーレット（左：バナー / 右：横並び結果パネル） */
(function () {
  var section = document.getElementById('mv-roulette');
  if (!section) return;

  var css =
    /* ── outer row: MV Shuffle + Artwork Shuffle 横並び ── */
    '.shuffle-row-outer{display:flex;gap:16px;max-width:900px;margin:0 auto;padding:0 24px;align-items:stretch;}' +
    '#mv-roulette{flex:3;min-width:0;padding:0;}' +
    '.artwork-top-link{' +
      'flex:2;min-width:0;display:flex;flex-direction:column;' +
      'border-radius:18px;overflow:hidden;' +
      'background:#0d0910;border:1px solid rgba(200,100,200,.22);' +
      'text-decoration:none;transition:border-color .2s,transform .2s;}' +
    '.artwork-top-link:hover{border-color:rgba(200,100,200,.5);transform:scale(1.01);}' +
    '.artwork-top-link img{width:100%;flex:1;object-fit:cover;display:block;min-height:0;}' +
    '.artwork-top-hint{text-align:center;font-size:11px;color:rgba(255,255,255,.22);padding:6px 0;letter-spacing:.05em;margin:0;flex-shrink:0;}' +
    /* ── MV Shuffle widget ── */
    '.mvr-wrap{' +
      'max-width:none;margin:0;height:100%;' +
      'display:flex;align-items:stretch;' +
      'background:#0d0910;border-radius:18px;overflow:hidden;' +
      'border:1px solid rgba(200,100,200,.22);}' +
    /* 左：バナーボタン（画像の自然な高さを維持） */
    '.mvr-banner-btn{' +
      'flex:0 0 55%;align-self:flex-start;display:block;' +
      'border:none;padding:0;background:none;cursor:pointer;' +
      'transition:filter .2s;outline:none;}' +
    '.mvr-banner-btn:hover{filter:brightness(1.09);}' +
    '.mvr-banner-btn:active{filter:brightness(.88);}' +
    '.mvr-banner-btn img{width:100%;display:block;}' +
    /* 右：結果パネル（サムネ＋テキスト横並び） */
    '.mvr-result{' +
      'flex:1;display:flex;flex-direction:row;' +
      'align-items:center;' +
      'padding:14px 16px;gap:14px;' +
      'background:linear-gradient(160deg,#130f1c 0%,#0d0b14 100%);' +
      'border-left:1px solid rgba(200,100,200,.18);}' +
    /* サムネ */
    '.mvr-thumb-wrap{' +
      'flex:0 0 46%;aspect-ratio:16/9;' +
      'border-radius:8px;overflow:hidden;background:#111;' +
      'box-shadow:0 4px 16px rgba(0,0,0,.6);}' +
    '.mvr-thumb-wrap img{width:100%;height:100%;object-fit:cover;display:block;}' +
    /* テキスト情報 */
    '.mvr-info{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:5px;}' +
    '.mvr-result-label{' +
      'font-size:9px;color:rgba(220,130,220,.85);letter-spacing:.14em;' +
      'font-weight:700;margin:0;text-transform:uppercase;}' +
    '.mvr-song{' +
      'display:block;font-size:clamp(12px,1.4vw,17px);font-weight:700;' +
      'color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-artist{' +
      'display:block;font-size:clamp(12px,1.4vw,17px);' +
      'color:rgba(255,255,255,.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-yt-link{' +
      'align-self:flex-start;' +
      'display:inline-block;margin-top:4px;' +
      'padding:4px 12px;border-radius:100px;' +
      'background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);' +
      'color:rgba(255,255,255,.55);font-size:10px;font-weight:700;text-decoration:none;' +
      'transition:background .2s,color .2s;}' +
    '.mvr-yt-link:hover{background:rgba(255,255,255,.14);color:rgba(255,255,255,.9);}' +
    '.mvr-hint{' +
      'text-align:center;font-size:11px;color:rgba(255,255,255,.22);' +
      'margin:6px 0 0;letter-spacing:.05em;}' +
    '#mv-roulette+.topic-grid{margin-top:16px!important;}' +
    '@media(max-width:660px){' +
      '.shuffle-row-outer{flex-direction:column;padding:0 16px;}' +
      '#mv-roulette{flex:none;}' +
      '.artwork-top-link{flex:none;}' +
      '.artwork-top-link img{max-height:120px;object-position:center;}' +
      '.mvr-wrap{flex-direction:column;}' +
      '.mvr-banner-btn{flex:none;width:100%;align-self:auto;}' +
      '.mvr-result{flex-direction:column;align-items:center;padding:12px 14px;gap:8px;}' +
      '.mvr-thumb-wrap{flex:none;width:80%;}' +
      '.mvr-info{align-items:center;text-align:center;}' +
      '.mvr-yt-link{align-self:center;}' +
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
          '<div class="mvr-thumb-wrap">',
            '<img id="mvr-thumb" src="" alt="" />',
          '</div>',
          '<div class="mvr-info">',
            '<p class="mvr-result-label">&#9834; Pick !</p>',
            '<span class="mvr-song" id="mvr-song"></span>',
            '<span class="mvr-artist" id="mvr-artist"></span>',
            '<a class="mvr-yt-link" id="mvr-yt" href="#" target="_blank" rel="noopener noreferrer">&#9654; YouTube で見る</a>',
          '</div>',
        '</div>',
      '</div>',
      items.length > 1 ? '<p class="mvr-hint">バナーをクリックしてシャッフル ✦</p>' : ''
    ].join('');

    function update(i) {
      var mv = items[i];
      document.getElementById('mvr-thumb').src = thumbUrl(mv.youtube_id);
      document.getElementById('mvr-thumb').alt = esc(mv.title);
      document.getElementById('mvr-song').textContent   = mv.title || '';
      document.getElementById('mvr-artist').textContent = mv.artist || '';
      document.getElementById('mvr-yt').href = watchUrl(mv.youtube_id);
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