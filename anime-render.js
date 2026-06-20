function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function renderAnimePage() {
  const container = document.querySelector('.page-content');
  if (!container) return;

  let data;
  try {
    const res = await fetch('/_data/anime.json');
    if (!res.ok) throw new Error(res.statusText);
    data = await res.json();
  } catch {
    container.innerHTML = '<p class="loading-state">読み込みに失敗しました。</p>';
    return;
  }

  const items = data.items || [];
  if (items.length === 0) {
    container.innerHTML = '<p class="loading-state">コンテンツがありません。</p>';
    return;
  }

  const cardsHTML = items.map(item => {
    const vid = escapeHtml((item.youtube_id || '').split('&')[0]);
    if (!vid) return '';
    return `
      <div class="mv-card">
        <div class="mv-embed">
          <div class="yt-facade" data-id="${vid}">
            <img src="https://img.youtube.com/vi/${vid}/hqdefault.jpg" alt="${escapeHtml(item.title)}" loading="lazy">
            <button class="yt-play" aria-label="再生"></button>
          </div>
        </div>
        <div class="mv-info">
          <h3>${escapeHtml(item.title)}</h3>
          ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
        </div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <section class="content-section">
      <h2 class="section-heading">Favorite Anime</h2>
      <div class="mv-grid">${cardsHTML}</div>
    </section>`;

  const cards = container.querySelectorAll('.mv-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => observer.observe(c));
}
