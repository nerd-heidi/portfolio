function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function renderPhotoPage() {
  const container = document.querySelector('.page-content');
  if (!container) return;

  let data;
  try {
    const res = await fetch('/_data/photo.json');
    if (!res.ok) throw new Error(res.statusText);
    data = await res.json();
  } catch {
    container.innerHTML = '<p class="loading-state">読み込みに失敗しました。</p>';
    return;
  }

  const photos = data.photos || [];
  if (photos.length === 0) {
    container.innerHTML = '<p class="loading-state">写真がありません。</p>';
    return;
  }

  const gridHTML = photos.map(p => {
    const src = escapeHtml(p.image || '');
    const alt = escapeHtml(p.caption || '');
    if (!src) return '';
    return `
      <div class="photo-item">
        <a href="${src}" target="_blank" rel="noopener noreferrer">
          <img src="${src}" alt="${alt}" loading="lazy">
        </a>
      </div>`;
  }).join('');

  container.innerHTML = `<div class="photo-grid">${gridHTML}</div>`;

  const items = container.querySelectorAll('.photo-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  items.forEach(i => observer.observe(i));
}
