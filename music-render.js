/**
 * music-render.js - Favorite Music ページ専用レンダラー
 * ジャンル別 / Favorite Artists / Favorite MV / Favorite Albums
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

async function renderMusicPage() {
  const container = document.querySelector('.page-content');
  if (!container) return;

  let data;
  try {
    const res = await fetch('/_data/music.json');
    if (!res.ok) throw new Error(res.statusText);
    data = await res.json();
  } catch (e) {
    container.innerHTML = '<p class="loading-state">読み込みに失敗しました。</p>';
    return;
  }

  let html = '';

  // ── ジャンル別セクション ──────────────────────────
  const genres = (data.genres || []).filter(g => g.items && g.items.length > 0);
  if (genres.length > 0) {
    html += `<section class="content-section">
      <h2 class="section-heading">Genre</h2>`;
    genres.forEach(genre => {
      html += `<div class="genre-block">
        <h3 class="genre-heading">${escapeHtml(genre.name)}</h3>
        <div class="item-grid">${genre.items.map(createItemCard).join('')}</div>
      </div>`;
    });
    html += `</section>`;
  }

  // ── Favorite Artists ─────────────────────────────
  if ((data.artists || []).length > 0) {
    html += `<section class="content-section">
      <h2 class="section-heading">Favorite Artists</h2>
      <div class="item-grid">${data.artists.map(createItemCard).join('')}</div>
    </section>`;
  }

  // ── Favorite MV ──────────────────────────────────
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

  // ── Favorite Albums ───────────────────────────────
  if ((data.albums || []).length > 0) {
    html += `<section class="content-section">
      <h2 class="section-heading">Favorite Albums</h2>
      <div class="item-grid">${data.albums.map(createItemCard).join('')}</div>
    </section>`;
  }

  container.innerHTML = html || '<p class="loading-state">コンテンツがありません。</p>';

  // スクロールフェードイン
  const cards = container.querySelectorAll('.item-card, .mv-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => observer.observe(c));
}

renderMusicPage();
