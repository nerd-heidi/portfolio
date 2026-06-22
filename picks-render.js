/* picks-render.js – 新譜ピックアップ (月別 / ジャンルフィルター) */
(function () {
  var section = document.getElementById('picks-section');
  if (!section) return;

  /* ── CSS注入 ── */
  var css = [
    '.picks-index-title{font-size:clamp(20px,3vw,30px);font-weight:800;color:#fff;margin:0 0 20px}',
    '.picks-issue-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}',
    '.picks-issue-card{display:block;padding:20px 16px;background:#0e0b14;border:1px solid rgba(255,255,255,.08);border-radius:14px;text-decoration:none;transition:border-color .2s,background .2s}',
    '.picks-issue-card:hover{border-color:rgba(180,100,200,.5);background:#130f1c}',
    '.picks-issue-label{display:block;font-size:15px;font-weight:700;color:#fff}',
    '.picks-issue-count{display:block;font-size:12px;color:rgba(255,255,255,.4);margin-top:4px}',
    '.picks-nav{display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap}',
    '.picks-back{font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s}',
    '.picks-back:hover{color:rgba(255,255,255,.9)}',
    '.picks-issue-h{font-size:clamp(18px,2.5vw,26px);font-weight:800;color:#fff;margin:0}',
    '.picks-filters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px}',
    '.picks-filter{padding:5px 14px;border-radius:100px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;letter-spacing:.03em}',
    '.picks-filter:hover{background:rgba(255,255,255,.08);color:#fff}',
    '.picks-filter.active{background:rgba(150,70,180,.22);border-color:rgba(150,70,180,.6);color:#fff}',
    '.picks-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}',
    '@media(max-width:720px){.picks-grid{grid-template-columns:repeat(2,1fr)}}',
    '@media(max-width:480px){.picks-grid{grid-template-columns:1fr}}',
    '.pick-card{background:#0e0b14;border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:border-color .2s,transform .2s}',
    '.pick-card:hover{border-color:rgba(150,70,180,.4);transform:translateY(-2px)}',
    '.pick-thumb{display:block;position:relative;aspect-ratio:16/9;overflow:hidden;background:#111}',
    '.pick-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}',
    '.pick-thumb:hover img{transform:scale(1.03)}',
    '.pick-yt-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.65);color:#fff;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;pointer-events:none;transition:background .2s}',
    '.pick-thumb:hover .pick-yt-play{background:rgba(200,30,30,.85)}',
    '.pick-info{padding:14px 14px 10px;flex:1}',
    '.pick-title{font-size:15px;font-weight:700;color:#fff;margin:0 0 3px;line-height:1.3}',
    '.pick-artist{font-size:13px;color:rgba(255,255,255,.55);margin:0 0 8px}',
    '.pick-genre-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px}',
    '.pick-genre-tag{font-size:9px;font-weight:700;letter-spacing:.08em;padding:2px 7px;border-radius:100px;background:rgba(150,70,180,.15);border:1px solid rgba(150,70,180,.3);color:rgba(200,150,220,.9)}',
    '.pick-links{display:flex;flex-wrap:wrap;gap:6px}',
    '.pick-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;border-radius:100px;font-size:11px;font-weight:700;text-decoration:none;transition:all .15s}',
    '.pick-apple{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.65)}',
    '.pick-apple:hover{background:rgba(255,255,255,.14);color:#fff}',
    '.pick-yt{background:rgba(200,30,30,.12);border:1px solid rgba(200,30,30,.3);color:rgba(220,100,100,.9)}',
    '.pick-yt:hover{background:rgba(200,30,30,.25);color:#ff9999}',
    '.pick-comment{display:flex;align-items:flex-start;gap:10px;padding:10px 14px 12px;border-top:1px solid rgba(255,255,255,.05);margin-top:auto}',
    '.pick-comment-melody{border-top-color:rgba(255,140,180,.2)}',
    '.pick-comment-seeno{border-top-color:rgba(140,110,200,.2)}',
    '.pick-char-icon{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1.5px solid rgba(255,255,255,.15)}',
    '.pick-char-melody{object-position:72% 12%}',
    '.pick-char-seeno{object-position:55% 5%}',
    '.pick-comment-text{font-size:12px;color:rgba(255,255,255,.6);line-height:1.5;margin:0;padding-top:4px}',
    '.pick-no-thumb{display:flex;align-items:center;justify-content:center;height:60px;color:rgba(255,255,255,.15);font-size:28px}'
  ].join('');
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
    { key: 'mv',         label: 'MV' },
    { key: 'other',      label: 'その他' }
  ];

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function load(cb) {
    fetch('/_data/picks.json')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(cb)
      .catch(function () { section.innerHTML = '<p style="color:rgba(255,255,255,.4);padding:40px 0">データがありません。</p>'; });
  }

  function getHash() { return location.hash.replace('#', ''); }

  function init(data) {
    var issues = (data.issues || []).slice().reverse();
    var hash = getHash();
    var issue = hash ? issues.find(function (i) { return i.id === hash; }) : null;
    if (issue) { showIssue(issue); } else { showIndex(issues); }
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
      var cnt = (issue.items || []).length;
      h += '<a class="picks-issue-card" href="/picks/#' + esc(issue.id) + '">';
      h += '<span class="picks-issue-label">' + esc(issue.title || issue.id) + '</span>';
      h += '<span class="picks-issue-count">' + cnt + ' tracks</span>';
      h += '</a>';
    });
    h += '</div>';
    section.innerHTML = h;
  }

  /* ── 号詳細ページ ── */
  function showIssue(issue) {
    var items = issue.items || [];

    /* ナビ */
    var h = '<div class="picks-nav">';
    h += '<a class="picks-back" href="/picks/">← 一覧に戻る</a>';
    h += '<h2 class="picks-issue-h">' + esc(issue.title || issue.id) + '</h2>';
    h += '</div>';

    /* フィルター */
    h += '<div class="picks-filters">';
    GENRES.forEach(function (g) {
      h += '<button class="picks-filter' + (g.key === 'all' ? ' active' : '') + '" data-filter="' + g.key + '">' + g.label + '</button>';
    });
    h += '</div>';

    /* カードグリッド */
    h += '<div class="picks-grid" id="picks-grid">';
    items.forEach(function (item) {
      var genres  = item.genres || [];
      var hasMv   = !!item.youtube_id;
      var genreStr = genres.concat(hasMv ? ['mv'] : []).join(' ');

      h += '<div class="pick-card" data-genres="' + genreStr + '" data-mv="' + hasMv + '">';

      /* サムネ or プレースホルダー */
      if (item.youtube_id) {
        h += '<a class="pick-thumb" href="https://www.youtube.com/watch?v=' + esc(item.youtube_id) + '" target="_blank" rel="noopener noreferrer">';
        h += '<img src="https://img.youtube.com/vi/' + esc(item.youtube_id) + '/mqdefault.jpg" alt="' + esc(item.track_title || '') + '" loading="lazy" />';
        h += '<span class="pick-yt-play">&#9654;</span>';
        h += '</a>';
      } else {
        h += '<div class="pick-no-thumb">&#9835;</div>';
      }

      /* テキスト情報 */
      h += '<div class="pick-info">';
      if (item.track_title) h += '<p class="pick-title">' + esc(item.track_title) + '</p>';
      h += '<p class="pick-artist">' + esc(item.artist || '') + '</p>';

      /* ジャンルタグ */
      if (genres.length) {
        h += '<div class="pick-genre-tags">';
        genres.forEach(function (g) { h += '<span class="pick-genre-tag">' + esc(g.toUpperCase().replace('-', ' ')) + '</span>'; });
        h += '</div>';
      }

      /* ボタン */
      if (item.apple_music_url || item.youtube_id) {
        h += '<div class="pick-links">';
        if (item.apple_music_url) h += '<a class="pick-btn pick-apple" href="' + esc(item.apple_music_url) + '" target="_blank" rel="noopener noreferrer">&#9835; Apple Music</a>';
        if (item.youtube_id)      h += '<a class="pick-btn pick-yt" href="https://www.youtube.com/watch?v=' + esc(item.youtube_id) + '" target="_blank" rel="noopener noreferrer">&#9654; YouTube</a>';
        h += '</div>';
      }
      h += '</div>'; /* /pick-info */

      /* キャラコメント */
      if (item.comment) {
        var ch = (item.character === 'seeno') ? 'seeno' : 'melody';
        var img = (ch === 'seeno') ? 'chatbot-seeno' : 'chatbot-char';
        h += '<div class="pick-comment pick-comment-' + ch + '">';
        h += '<img class="pick-char-icon pick-char-' + ch + '" src="/images/' + img + '.png" alt="' + ch + '" />';
        h += '<p class="pick-comment-text">' + esc(item.comment) + '</p>';
        h += '</div>';
      }

      h += '</div>'; /* /pick-card */
    });
    h += '</div>'; /* /picks-grid */

    section.innerHTML = h;

    /* フィルター動作 */
    var btns  = section.querySelectorAll('.picks-filter');
    var cards = section.querySelectorAll('.pick-card');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function (card) {
          if (f === 'all') {
            card.style.display = '';
          } else if (f === 'mv') {
            card.style.display = card.getAttribute('data-mv') === 'true' ? '' : 'none';
          } else {
            card.style.display = (card.getAttribute('data-genres') || '').indexOf(f) !== -1 ? '' : 'none';
          }
        });
      });
    });
  }
})();