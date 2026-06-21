function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeUrl(url) {
  if (!url) return '#';
  return /^javascript:/i.test(url.trim()) ? '#' : url;
}

async function renderTopPage() {
  const res = await fetch('/_data/top.json?v=' + Date.now());
  if (!res.ok) return;
  const data = await res.json();

  // ヒーロー背景画像
  const hero = document.querySelector('.hero');
  if (hero && data.hero_image) {
    const safe = safeUrl(data.hero_image);
    hero.style.backgroundImage = `url('${safe.replace(/'/g, '%27')}')`;
  }

  // カードグリッドを描画
  const grid = document.getElementById('topic-grid');
  if (!grid || !data.cards) return;

  grid.innerHTML = data.cards.map(card => {
    const sizeClass = card.size === 'large' ? 'large' : card.size === 'wide' ? 'wide' : '';
    return `
      <a class="topic-card${sizeClass ? ' ' + sizeClass : ''}" href="${escapeHtml(safeUrl(card.url))}">
        <img src="${escapeHtml(safeUrl(card.image))}" alt="${escapeHtml(card.title)}" loading="lazy">
        <div class="card-text">
          <span>${escapeHtml(card.number)}</span>
          <h2>${escapeHtml(card.title)}</h2>
        </div>
      </a>`;
  }).join('');
}

renderTopPage();
