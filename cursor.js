/* cursor.js – カスタムカーソル（Melody） */
(function () {
  // タッチデバイスはスキップ
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var SIZE = 96; // px
  // 杖の先端をホットスポットに合わせるオフセット（画像内の先端位置）
  var OX = Math.round(SIZE * 0.72); // 右寄り
  var OY = Math.round(SIZE * 0.08); // 上寄り

  var css =
    '*{cursor:none!important}' +
    '#nerd-cursor{' +
      'position:fixed;top:0;left:0;' +
      'width:' + SIZE + 'px;height:' + SIZE + 'px;' +
      'pointer-events:none;z-index:2147483647;' +
      'object-fit:contain;' +
      'transition:opacity .15s;' +
      'will-change:transform;' +
    '}' +
    '#nerd-cursor.click{' +
      'filter:drop-shadow(0 0 6px rgba(255,220,100,.7));' +
    '}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var el = document.createElement('img');
  el.id = 'nerd-cursor';
  el.src = '/images/cursor-normal.png';
  el.alt = '';

  function inject() { document.body.appendChild(el); }
  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);

  var mx = -999, my = -999;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    el.style.transform = 'translate(' + (mx - OX) + 'px,' + (my - OY) + 'px)';
  }, { passive: true });

  document.addEventListener('mousedown', function () {
    el.src = '/images/cursor-click.png';
    el.classList.add('click');
  });

  document.addEventListener('mouseup', function () {
    el.src = '/images/cursor-normal.png';
    el.classList.remove('click');
  });

  // ウィンドウ外に出たら非表示
  document.addEventListener('mouseleave', function () {
    el.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    el.style.opacity = '1';
  });
})();
