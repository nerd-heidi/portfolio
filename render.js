/**
 * render.js - JSONデータからカードを動的に描画する共通モジュール
 * 各カテゴリページから renderPage('/_data/xxx.json') で呼び出す
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
    .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join('');

  const imgSrc = item.image
    ? escapeHtml(item.image)
    : 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80';

  const descHTML = escapeHtml(item.description || '').replace(/\n/g, '<br>');

  return `
    <div class="item-card">
      <div class="item-card-img">
        <img src="${imgSrc}" alt="${escapeHtml(item.title)}" loading="lazy">
      </div>
      <div class="item-card-body">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${descHTML}</p>
        ${tagsHTML ? `<div class="tags">${tagsHTML}</div>` : ''}
      </div>
    </div>`;
}

function createSection(section) {
  const itemsHTML = (section.items || []).map(createItemCard).join('');
  return `
    <section class="content-section">
      <h2 class="section-heading">${escapeHtml(section.heading)}</h2>
      <div class="item-grid">${itemsHTML}</div>
    </section>`;
}

async function renderPage(dataFile) {
  const container = document.querySelector('.page-content');
  if (!container) return;

  try {
    const res = await fetch(dataFile);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const sections = Array.isArray(data) ? data : (data.sections || []);

    container.innerHTML = sections.map(createSection).join('');

    // カードのスクロールフェードイン
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, i * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    container.querySelectorAll('.item-card').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition =
        'opacity 0.55s ease, transform 0.55s ease, border-color 0.3s ease, box-shadow 0.3s ease';
      observer.observe(el);
    });

  } catch {
    container.innerHTML =
      '<p class="loading-state">コンテンツを読み込めませんでした。</p>';
  }
}
