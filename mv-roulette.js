/* mv-roulette.js – MV Shuffle + Artwork Shuffle (2-panel side by side) */
(function () {
  var section = document.getElementById('mv-roulette');
  if (!section) return;

  var css =
    /* outer layout */
    '#mv-roulette{padding:0;}' +
    '.mvr-outer-row{display:flex;gap:16px;width:100%;align-items:stretch;}' +
    /* shared widget box */
    '.mvr-wrap{' +
      'flex:1;min-width:0;' +
      'display:flex;align-items:stretch;' +
      'background:#0d0910;border-radius:18px;overflow:hidden;' +
      'border:1px solid rgba(200,100,200,.22);}' +
    /* banner button (left) */
    '.mvr-banner-btn{' +
      'flex:0 0 56%;align-self:flex-start;display:block;' +
      'border:none;padding:0;background:none;cursor:pointer;' +
      'transition:filter .2s;outline:none;}' +
    '.mvr-banner-btn:hover{filter:brightness(1.09);}' +
    '.mvr-banner-btn:active{filter:brightness(.88);}' +
    '.mvr-banner-btn img{width:100%;display:block;}' +
    /* result panel (right) */
    '.mvr-result{' +
      'flex:1;display:flex;flex-direction:row;' +
      'align-items:center;' +
      'padding:14px 14px;gap:12px;' +
      'background:linear-gradient(160deg,#130f1c 0%,#0d0b14 100%);' +
      'border-left:1px solid rgba(200,100,200,.18);}' +
    /* MV thumbnail 16:9 */
    '.mvr-thumb-wrap{' +
      'flex:0 0 52%;aspect-ratio:16/9;' +
      'border-radius:8px;overflow:hidden;background:#111;' +
      'box-shadow:0 4px 16px rgba(0,0,0,.6);}' +
    /* Artwork thumbnail 1:1 */
    '.awr-thumb-wrap{' +
      'flex:0 0 48%;aspect-ratio:1/1;' +
      'border-radius:8px;overflow:hidden;background:#111;' +
      'box-shadow:0 4px 16px rgba(0,0,0,.6);}' +
    '.mvr-thumb-wrap img,.awr-thumb-wrap img{width:100%;height:100%;object-fit:cover;display:block;}' +
    /* info */
    '.mvr-info{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:5px;}' +
    '.mvr-result-label{font-size:9px;color:rgba(220,130,220,.85);letter-spacing:.14em;font-weight:700;margin:0;text-transform:uppercase;}' +
    '.mvr-song{display:block;font-size:clamp(11px,1.1vw,15px);font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-artist{display:block;font-size:clamp(10px,1vw,13px);color:rgba(255,255,255,.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.mvr-yt-link,.mvr-am-link{' +
      'align-self:flex-start;display:inline-block;margin-top:4px;' +
      'padding:4px 10px;border-radius:100px;' +
      'background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);' +
      'color:rgba(255,255,255,.55);font-size:10px;font-weight:700;text-decoration:none;' +
      'transition:background .2s,color .2s;}' +
    '.mvr-yt-link:hover,.mvr-am-link:hover{background:rgba(255,255,255,.14);color:rgba(255,255,255,.9);}' +
    '.mvr-hint{text-align:center;font-size:11px;color:rgba(255,255,255,.22);width:100%;margin:6px auto 0;padding:0;letter-spacing:.05em;}' +
    '#mv-roulette+.topic-grid{margin-top:16px!important;}' +
    /* mobile */
    '@media(max-width:700px){' +
      '#mv-roulette{padding:0 16px;}' +
      '.mvr-outer-row{flex-direction:column;}' +
      '.mvr-wrap{flex:none;}' +
    '}' +
    '@media(max-width:480px){' +
      '.mvr-wrap{flex-direction:column;}' +
      '.mvr-banner-btn{flex:none;width:100%;align-self:auto;}' +
      '.mvr-result{flex-direction:column;align-items:center;padding:12px 14px;gap:8px;}' +
      '.mvr-thumb-wrap,.awr-thumb-wrap{flex:none;width:55%;}' +
      '.mvr-info{align-items:center;text-align:center;}' +
      '.mvr-yt-link,.mvr-am-link{align-self:center;}' +
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

  async function fetchArtwork(item) {
    var url = item.apple_music_url;
    if (!url) return null;
    var trackMatch = url.match(/[?&]i=(\d+)/);
    var albumMatch = url.match(/\/album\/[^/]+\/(\d+)/);
    var id = trackMatch ? trackMatch[1] : (albumMatch ? albumMatch[1] : null);
    if (!id) return null;
    try {
      var r = await fetch('https://itunes.apple.com/lookup?id=' + id + '&country=jp');
      var d = await r.json();
      var res = d.results && d.results[0];
      if (res && res.artworkUrl100) {
        return {
          artwork: res.artworkUrl100.replace(/\d+x\d+bb/, '600x600bb'),
          title:  res.trackName  || res.collectionName || item.title  || '',
          artist: res.artistName || item.artist || ''
        };
      }
    } catch (_) {}
    return null;
  }

  /* load both data in parallel */
  Promise.all([
    fetch('/_data/mv-roulette.json').then(function(r){ return r.ok ? r.json() : {items:[]}; }).catch(function(){ return {items:[]}; }),
    fetch('/_data/artwork.json').then(function(r){ return r.ok ? r.json() : {items:[]}; }).catch(function(){ return {items:[]}; })
  ]).then(function(results) {
    var mvItems = (results[0].items || []).filter(function(i){ return i.youtube_id; });
    var awItems = results[1].items || [];
    if (!mvItems.length && !awItems.length) { section.innerHTML = ''; return; }
    render(mvItems, awItems);
  });

  function render(mvItems, awItems) {
    var mvIdx = mvItems.length ? Math.floor(Math.random() * mvItems.length) : -1;
    var awIdx = awItems.length  ? Math.floor(Math.random() * awItems.length)  : -1;
    var awCache = {};

    var mvPanel = mvItems.length ? (
      '<div class="mvr-wrap">' +
        '<button class="mvr-banner-btn" id="mvr-banner" aria-label="\u30b7\u30e3\u30c3\u30d5\u30eb">' +
          '<img src="/images/Shuffle2.png" alt="MV Shuffle" />' +
        '</button>' +
        '<div class="mvr-result">' +
          '<div class="mvr-thumb-wrap"><img id="mvr-thumb" src="" alt="" /></div>' +
          '<div class="mvr-info">' +
            '<p class="mvr-result-label">&#9834; Pick !</p>' +
            '<span class="mvr-song" id="mvr-song"></span>' +
            '<span class="mvr-artist" id="mvr-artist"></span>' +
            '<a class="mvr-yt-link" id="mvr-yt" href="#" target="_blank" rel="noopener noreferrer">&#9654; YouTube \u3067\u898b\u308b</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    ) : '';

    var awPanel = awItems.length ? (
      '<div class="mvr-wrap">' +
        '<button class="mvr-banner-btn" id="awr-banner" aria-label="\u30a2\u30fc\u30c8\u30ef\u30fc\u30af\u30b7\u30e3\u30c3\u30d5\u30eb">' +
          '<img src="/images/Artwork.png" alt="Artwork Shuffle" />' +
        '</button>' +
        '<div class="mvr-result">' +
          '<div class="awr-thumb-wrap"><img id="awr-thumb" src="" alt="" /></div>' +
          '<div class="mvr-info">' +
            '<p class="mvr-result-label">&#9834; Artwork !</p>' +
            '<span class="mvr-song" id="awr-title"></span>' +
            '<span class="mvr-artist" id="awr-artist"></span>' +
            '<a class="mvr-am-link" id="awr-am" href="#" target="_blank" rel="noopener noreferrer">&#9835; Apple Music \u3067\u898b\u308b</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    ) : '';

    section.innerHTML =
      '<div class="mvr-outer-row">' + mvPanel + awPanel + '</div>' +
      ((mvItems.length > 1 || awItems.length > 1) ? '<p class="mvr-hint">\u30d0\u30ca\u30fc\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u30b7\u30e3\u30c3\u30d5\u30eb \u2746</p>' : '');

    /* ── MV Shuffle ── */
    if (mvItems.length) {
      function updateMV(i) {
        var mv = mvItems[i];
        document.getElementById('mvr-thumb').src = thumbUrl(mv.youtube_id);
        document.getElementById('mvr-thumb').alt = esc(mv.title);
        document.getElementById('mvr-song').textContent   = mv.title  || '';
        document.getElementById('mvr-artist').textContent = mv.artist || '';
        document.getElementById('mvr-yt').href = watchUrl(mv.youtube_id);
      }
      updateMV(mvIdx);

      if (mvItems.length >= 2) {
        var banner = document.getElementById('mvr-banner');
        banner.addEventListener('click', function () {
          if (banner.disabled) return;
          banner.disabled = true;
          var steps = 18, cur = 0, delays = [];
          for (var i = 0; i < steps; i++) delays.push(i < 12 ? 75 : 75 + (i - 11) * 55);
          function step() {
            var next;
            do { next = Math.floor(Math.random() * mvItems.length); } while (next === mvIdx && mvItems.length > 1);
            mvIdx = next; updateMV(mvIdx); cur++;
            if (cur < steps) { setTimeout(step, delays[cur]); }
            else { banner.disabled = false; }
          }
          setTimeout(step, delays[0]);
        });
      }
    }

    /* ── Artwork Shuffle ── */
    if (awItems.length) {
      async function updateAW(i) {
        var item = awItems[i];
        var elTitle  = document.getElementById('awr-title');
        var elArtist = document.getElementById('awr-artist');
        var elThumb  = document.getElementById('awr-thumb');
        var elAm     = document.getElementById('awr-am');
        if (elTitle)  elTitle.textContent  = item.title  || '\u8aad\u307f\u8fbc\u307f\u4e2d\u2026';
        if (elArtist) elArtist.textContent = '';
        if (elThumb)  { elThumb.src = ''; elThumb.alt = ''; }
        var key = item.apple_music_url;
        if (!awCache[key]) awCache[key] = await fetchArtwork(item);
        var info = awCache[key];
        if (info) {
          if (elThumb)  { elThumb.src = info.artwork || ''; elThumb.alt = esc(info.title); }
          if (elTitle)  elTitle.textContent  = info.title  || '';
          if (elArtist) elArtist.textContent = info.artist || '';
        }
        if (elAm) elAm.href = item.apple_music_url || '#';
      }
      updateAW(awIdx);

      var awBanner = document.getElementById('awr-banner');
      if (awBanner && awItems.length >= 2) {
        awBanner.addEventListener('click', function () {
          if (awBanner.disabled) return;
          awBanner.disabled = true;
          var next;
          do { next = Math.floor(Math.random() * awItems.length); } while (next === awIdx && awItems.length > 1);
          awIdx = next;
          updateAW(awIdx).then(function () { awBanner.disabled = false; });
        });
      }
    }
  }
})();