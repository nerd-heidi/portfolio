/**
 * music-render.js
 * renderMusicIndex()        → favorite-music.html のジャンル一覧カードを描画
 * renderMusicPage(dataFile) → 各ジャンルページの Artists / MV / Albums を描画
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createItemCard(item) {
  const tagsHTML = (item.tags || [])
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join('');
  const imgSrc = item.image
    ? escapeHtml(item.image)
    : 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80';
  const desc = escapeHtml(item.description || '').replace(/\n/g, '<br>');
  return `
    <div class="item-card">
      <div class="item-card-img">
        <img src="${imgSrc}" alt="${escapeHtml(item.title)}" loading="lazy">
      </div>
      <div class="item-card-body">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${desc}</p>
        ${tagsHTML ? `<div class="tags">${tagsHTML}</div>` : ''}
      </div>
    </div>`;
}

// ── ジャンル一覧ページ (favorite-music.html) ─────────────────
async function renderMusicIndex() {
  const container = document.querySelector('.page-content');
  if (!container) return;

  let data;
  try {
    const res = await fetch('/_data/music.json');
    if (!res.ok) throw new Error(res.statusText);
    data = await res.json();
  } catch {
    container.innerHTML = '<p class="loading-state">読み込みに失敗しました。</p>';
    return;
  }

  const genres = data.genres || [];
  if (genres.length === 0) {
    container.innerHTML = '<p class="loading-state">ジャンルがありません。</p>';
    return;
  }

  container.innerHTML = `
    <div class="genre-grid">
      ${genres.map(g => `
        <a class="topic-card" href="music-${escapeHtml(g.id)}.html">
          <img src="${escapeHtml(g.image)}" alt="${escapeHtml(g.name)}" loading="lazy">
          <div class="card-text">
            <h2>${escapeHtml(g.name)}</h2>
            <p>${escapeHtml(g.description)}</p>
          </div>
        </a>`).join('')}
    </div>`;
}

// ── 各ジャンルページ (music-hiphop.html 等) ──────────────────
async function renderMusicPage(dataFile) {
  const container = document.querySelector('.page-content');
  if (!container) return;

  let data;
  try {
    const res = await fetch(dataFile);
    if (!res.ok) throw new Error(res.statusText);
    data = await res.json();
  } catch {
    container.innerHTML = '<p class="loading-state">読み込みに失敗しました。</p>';
    return;
  }

  let html = '';

  if ((data.artists || []).length > 0) {
    html += `<section class="content-section">
      <h2 class="section-heading">Favorite Artists</h2>
      <div class="item-grid">${data.artists.map(createItemCard).join('')}</div>
    </section>`;
  }

  if ((data.mvs || []).length > 0) {
    const mvsHTML = data.mvs.map(mv => `
      <div class="mv-card">
        <div class="mv-embed">
          <iframe
            src="https://www.youtube.com/embed/${escapeHtml(mv.youtube_id)}"
            title="${escapeHtml(mv.title)}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
        <div class="mv-info">
          <h3>${escapeHtml(mv.title)}</h3>
          ${mv.description ? `<p>${escapeHtml(mv.description)}</p>` : ''}
        </div>
      </div>`).join('');
    html += `<section class="content-section">
      <h2 class="section-heading">Favorite MV</h2>
      <div class="mv-grid">${mvsHTML}</div>
    </section>`;
  }

  if ((data.albums || []).length > 0) {
    html += `<section class="content-section">
      <h2 class="section-heading">Favorite Albums</h2>
      <div class="item-grid">${data.albums.map(createItemCard).join('')}</div>
    </section>`;
  }

  container.innerHTML = html || '<p class="loading-state">コンテンツがありません。</p>';

  const cards = container.querySelectorAll('.item-card, .mv-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => observer.observe(c));
}
