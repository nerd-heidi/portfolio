/* back-to-top.js – ページトップへ戻るボタン（Seeno イラスト） */
(function () {
  var css =
    '#btt-btn{' +
      'position:fixed;bottom:24px;right:24px;z-index:9000;' +
      'width:180px;cursor:pointer;' +
      'opacity:0;pointer-events:none;' +
      'transition:opacity .4s, transform .4s;' +
      'transform:translateY(20px);' +
      'background:none;border:none;padding:0;' +
      'filter:drop-shadow(0 4px 12px rgba(0,0,0,.25));' +
    '}' +
    '#btt-btn.visible{' +
      'opacity:1;pointer-events:auto;transform:translateY(0);' +
    '}' +
    '#btt-btn:hover{' +
      'transform:translateY(-6px);' +
      'filter:drop-shadow(0 8px 18px rgba(0,0,0,.35));' +
    '}' +
    '#btt-btn:active{transform:translateY(-2px);}' +
    '@media(max-width:600px){' +
      '#btt-btn{width:140px;bottom:16px;right:12px;}' +
    '}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'btt-btn';
  btn.setAttribute('aria-label', 'ページトップへ戻る');
  btn.innerHTML = '<img src="/images/move-top.png" alt="ページトップへ" style="width:100%;display:block;" />';

  function inject() { document.body.appendChild(btn); }
  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);

  // スクロール量に応じて表示/非表示
  var SHOW_AFTER = 300;
  window.addEventListener('scroll', function () {
    if (window.scrollY > SHOW_AFTER) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  // クリックでスムーズスクロール
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
