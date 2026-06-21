/* loader.js – 初回アクセス時のみローディング画面を表示 */
(function () {
  if (sessionStorage.getItem('nerdlife_visited')) return;
  sessionStorage.setItem('nerdlife_visited', '1');

  var css = [
    '#page-loader{position:fixed;inset:0;background:#F2EBE0;z-index:99999;',
    'display:flex;align-items:center;justify-content:center;',
    'transition:opacity .65s ease;}',
    '#page-loader.out{opacity:0;pointer-events:none;}',
    '#page-loader .ld-art{width:min(760px,100vw);height:auto;}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = '<img class="ld-art" src="/images/404-art.png" alt="Loading..." />';

  function inject() { document.body.prepend(loader); }
  if (document.body) { inject(); }
  else { document.addEventListener('DOMContentLoaded', inject); }

  function dismiss() {
    loader.classList.add('out');
    setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 700);
  }
  window.addEventListener('load', function () { setTimeout(dismiss, 1500); });
})();
