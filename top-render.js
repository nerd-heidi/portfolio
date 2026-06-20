async function renderTopPage() {
  const res = await fetch('/_data/top.json?v=' + Date.now());
  if (!res.ok) return;
  const data = await res.json();

  // ヒーロー背景画像
  const hero = document.querySelector('.hero');
  if (hero && data.hero_image) {
    hero.style.backgroundImage = `url('${data.hero_image}')`;
  }

  // カードグリッドを描画
  const grid = document.getElementById('topic-grid');
  if (!grid || !data.cards) return;

  grid.innerHTML = data.cards.map(card => {
    const sizeClass = card.size === 'large' ? 'large' : card.size === 'wide' ? 'wide' : '';
    return `
      <a class="topic-card${sizeClass ? ' ' + sizeClass : ''}" href="${card.url}">
        <img src="${card.image}" alt="${card.title}" loading="lazy">
        <div class="card-text">
          <span>${card.number}</span>
          <h2>${card.title}</h2>
        </div>
      </a>`;
  }).join('');
}

renderTopPage();
