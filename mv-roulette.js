/* mv-roulette.js – おすすめ MV ルーレット（バナー枠内オーバーレイ） */
(function () {
  var section = document.getElementById('mv-roulette');
  if (!section) return;

  var css =
    '#mv-roulette{padding:0 24px 0;}' +
    '.mvr-wrap{max-width:900px;margin:0 auto;}' +
    /* バナー全体をボタン化 */
    '.mvr-banner-wrap{' +
      'position:relative;display:block;width:100%;' +
      'border:none;padding:0;background:none;cursor:pointer;' +
      'border-radius:18px;overflow:hidden;' +
      'transition:filter .2s;outline:none;}' +
    '.mvr-banner-wrap:hover{filter:brightness(1.07);}' +
    '.mvr-banner-wrap:active{filter:brightness(.95);}' +
    '.mvr-banner-wrap>img{width:100%;display:block;border-radius:18px;}' +
    /* バナー枠内オーバーレイ（% は画像内の枠位置に合わせた値） */
    '.mvr-overlay{' +
      'position:absolute;' +
      'top:28%;bottom:24%;left:37%;right:19%;' +
      'display:flex;align-items:center;gap:2%;' +
      'pointer-events:none;}' +
    /* サムネ */
    '.mvr-ov-thumb{' +
      'width:28%;aspect-ratio:16/9;flex-shrink:0;' +
      'border-radius:8px;overflow:hidden;background:#111;}' +
    '.mvr-ov-thumb img{width:100%;height:100%;object-fit:cover;display:block;}' +
    /* テキスト情報 */
    '.mvr-ov-info{flex:1;min-width:0;text-align:left;}' +
    '.mvr-ov-song{' +
      'display:block;font-size:clamp(11px,1.8vw,20px);font-weight:700;' +
      'color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' +
      'text-shadow:0 1px 6px rgba(0,0,0,.8);}' +
    '.mvr-ov-artist{' +
      'display:block;font-size:clamp(9px,1.4vw,16px);' +
      'color:rgba(255,255,255,.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' +
      'margin-top:.25em;text-shadow:0 1px 4px rgba(0,0,0,.8);}' +
    /* YouTube ボタン */
    '.mvr-yt-wrap{display:flex;justify-content:flex-end;margin-top:8px;}' +
    '.mvr-yt{padding:7px 16px;border-radius:100px;' +
      'background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);' +
      'color:rgba(255,255,255,.6);font-size:12px;font-weight:700;text-decoration:none;' +
      'transition:background .2s;}' +
    '.mvr-yt:hover{background:rgba(255,255,255,.14);}' +
    '.mvr-hint{text-align:center;font-size:11px;color:rgba(255,255,255,.22);' +
      'margin:5px 0 0;letter-spacing:.05em;}' +
    '#mv-roulette+.topic-grid{margin-top:16px!important;}' +
    '@media(max-width:540px){' +
      '.mvr-yt-wrap{display:none;}' +
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
        '<button class="mvr-banner-wrap" id="mvr-banner" aria-label="シャッフル">',
          '<img src="/images/Shuffle2.png" alt="MV Shuffle" />',
          '<div class="mvr-overlay">',
            '<div class="mvr-ov-thumb">',
              '<img id="mvr-thumb" src="" alt="" />',
            '</div>',
            '<div class="mvr-ov-info">',
              '<span class="mvr-ov-song" id="mvr-song"></span>',
              '<span class="mvr-ov-artist" id="mvr-artist"></span>',
            '</div>',
          '</div>',
        '</button>',
        '<div class="mvr-yt-wrap">',
          '<a class="mvr-yt" id="mvr-yt" href="#" target="_blank" rel="noopener noreferrer">▶ YouTube で見る</a>',
        '</div>',
        items.length > 1 ? '<p class="mvr-hint">バナーをクリックしてシャッフル ✦</p>' : '',
      '</div>'
    ].join('');

    function update(i) {
      var mv = items[i];
      var wu = watchUrl(mv.youtube_id);
      document.getElementById('mvr-thumb').src = thumbUrl(mv.youtube_id);
      document.getElementById('mvr-thumb').alt = esc(mv.title);
      document.getElementById('mvr-song').textContent   = mv.title;
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