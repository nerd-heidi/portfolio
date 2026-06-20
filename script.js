// Card shimmer / spotlight on hover (topic cards on index page)
document.querySelectorAll(".topic-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  });
});

// YouTube ファサード: クリックでiframeに切り替え
document.addEventListener('click', function(e) {
  const facade = e.target.closest('.yt-facade');
  if (!facade) return;
  e.preventDefault();
  const id = facade.dataset.id;
  if (!id) return;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&webkit-playsinline=1&rel=0`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('webkit-allowfullscreen', '');
  iframe.setAttribute('playsinline', '');
  iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
  // facade ごと親要素で置き換える（iOS での再描画問題を防ぐ）
  const parent = facade.parentElement;
  if (parent) {
    parent.replaceChild(iframe, facade);
  }
});

// ハンバーガーメニュー
(function() {
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('.site-header nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // リンクをタップしたら閉じる
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
