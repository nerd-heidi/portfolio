/* mv-roulette.js – おすすめ MV ルーレット（バナー + セクション表示） */
(function () {
  var section = document.getElementById('mv-roulette');
  if (!section) return;

  var css =
    '#mv-roulette{padding:0 24px 0;}' +
    '.mvr-wrap{max-width:900px;margin:0 auto;}' +
    /* バナー画像 */
    '.mvr-banner-btn{display:block;width:100%;border:none;padding:0;background:none;' +
      'cursor:pointer;border-radius:18px;overflow:hidden;margin-bottom:16px;' +
      'transition:transform .25s,filter .25s;outline:none;}' +
    '.mvr-banner-btn:hover{transform:scale(1.01);filter:brightness(1.08);}' +
    '.mvr-banner-btn:active{transform:scale(.99);}' +
    '.mvr-banner-btn img{width:100%;display:block;border-radius:18px;}' +
    /* MV 情報行 */
    '.mvr-row{display:flex;align-items:center;gap:14px;' +
      'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);' +
      'border-radius:14px;padding:12px 16px;}' +
    '.mvr-thumb-link{flex-shrink:0;width:56px;height:56px;border-radius:8px;overflow:hidden;' +
      'display:block;position:relative;background:#111;}' +
    '.mvr-thumb-link img{width:100%;height:100%;object-fit:cover;display:block;}' +
    '.mvr-thumb-link::after{content:"▶";position:absolute;inset:0;display:flex;' +
      'align-items:center;justify-content:center;font-size:14px;color:#fff;' +
      'background:rgba(0,0,0,.25);}' +
    '.mvr-info{flex:1;min-width:0;display:flex;align-items:center;gap:8px;overflow:hidden;}' +
    '.mvr-song{font-size:17px;font-weight:700;color:rgba(255,255,255,.88);' +
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;max-width:55%;}' +
    '.mvr-sep{color:rgba(255,255,255,.2);flex-shrink:0;font-size:14px;}' +
    '.mvr-artist{font-size:15px;color:rgba(255,255,255,.45);' +
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-actions{display:flex;gap:8px;flex-shrink:0;}' +
    '.mvr-yt{padding:8px 16px;border-radius:100px;' +
      'background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);' +
      'color:rgba(255,255,255,.6);font-size:12px;font-weight:700;text-decoration:none;' +
      'white-space:nowrap;transition:background .2s;}' +
    '.mvr-yt:hover{background:rgba(255,255,255,.14);}' +
    /* バナーホバー時のヒント */
    '.mvr-hint{text-align:center;font-size:11px;color:rgba(255,255,255,.22);' +
      'margin:4px 0 0;letter-spacing:.05em;}' +
    /* topic-grid との隙間を詰める */
    '#mv-roulette+.topic-grid{margin-top:16px!important;}' +
    /* スピン中のアニメ */
    '@keyframes mvr-flash{0%,100%{opacity:1}50%{opacity:.55}}' +
    '.mvr-spinning .mvr-banner-btn img{animation:mvr-flash .13s steps(1) infinite;}' +
    /* モバイル */
    '@media(max-width:540px){' +
      '.mvr-yt{display:none;}' +
      '.mvr-row{gap:10px;padding:10px 12px;}' +
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
          '<img src="/images/Shuffle.png" alt="MV Shuffle" />',
        '</button>',
        '<div class="mvr-row">',
          '<a class="mvr-thumb-link" id="mvr-thumb-link" href="#" target="_blank" rel="noopener noreferrer">',
            '<img id="mvr-thumb" src="" alt="" />',
          '</a>',
          '<div class="mvr-info">',
            '<span class="mvr-song" id="mvr-song"></span>',            '<span class="mvr-sep">·</span>' +            '<span class="mvr-artist" id="mvr-artist"></span>',
          '</div>',
          '<div class="mvr-actions">',
            '<a class="mvr-yt" id="mvr-yt" href="#" target="_blank" rel="noopener noreferrer">▶ YouTube</a>',
          '</div>',
        '</div>',
        items.length > 1 ? '<p class="mvr-hint">バナーをクリックしてシャッフル ✦</p>' : '',
      '</div>'
    ].join('');

    function update(i) {
      var mv = items[i];
      var wu = watchUrl(mv.youtube_id);
      document.getElementById('mvr-thumb').src = thumbUrl(mv.youtube_id);
      document.getElementById('mvr-thumb').alt = mv.title;
      document.getElementById('mvr-thumb-link').href = wu;
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
      section.querySelector('.mvr-wrap').classList.add('mvr-spinning');

      var steps = 18, cur = 0, delays = [];
      for (var i = 0; i < steps; i++) delays.push(i < 12 ? 75 : 75 + (i - 11) * 55);

      function step() {
        var next;
        do { next = Math.floor(Math.random() * items.length); } while (next === idx && items.length > 1);
        idx = next;
        update(idx);
        cur++;
        if (cur < steps) {
          setTimeout(step, delays[cur]);
        } else {
          section.querySelector('.mvr-wrap').classList.remove('mvr-spinning');
          banner.disabled = false;
        }
      }
      setTimeout(step, delays[0]);
    });
  }
})();