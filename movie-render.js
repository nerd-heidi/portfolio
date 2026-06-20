function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function renderMoviePage() {
  const container = document.querySelector('.page-content');
  if (!container) return;

  let data;
  try {
    const res = await fetch('/_data/movie.json');
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
    const imgSrc = escapeHtml(item.image || '');
    const href = escapeHtml(item.url || '#');
    const target = item.url ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `
      <div class="poster-card">
        <a href="${href}"${target}>
          <div class="poster-img">
            ${imgSrc ? `<img src="${imgSrc}" alt="${escapeHtml(item.title)}" loading="lazy">` : ''}
          </div>
        </a>
        <p class="poster-title">${escapeHtml(item.title)}</p>
      </div>`;
  }).join('');

  container.innerHTML = `
    <section class="content-section">
      <h2 class="section-heading">Favorite Movies</h2>
      <div class="poster-grid">${cardsHTML}</div>
    </section>`;

  const cards = container.querySelectorAll('.poster-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  cards.forEach(c => observer.observe(c));
}
