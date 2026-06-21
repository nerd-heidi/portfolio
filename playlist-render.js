async function renderPlaylist() {
  const res = await fetch('/_data/playlist.json?v=' + Date.now());
  if (!res.ok) return;
  const data = await res.json();

  const gallery = document.getElementById('playlist-gallery');
  if (!gallery || !data.playlists) return;

  // Apple Music アイコン SVG
  const appleMusicIcon = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208a4.92 4.92 0 0 0-.35 1.467c-.06.534-.083 1.072-.084 1.61v9.468c.01.368.02.738.065 1.105.124 1.016.49 1.93 1.136 2.715.77.93 1.745 1.488 2.927 1.727.39.08.793.107 1.19.124.04.003.082.01.124.013h12.01c.15-.01.303-.017.453-.026.76-.05 1.503-.15 2.207-.43 1.336-.53 2.3-1.45 2.865-2.78.24-.57.35-1.17.4-1.78.05-.56.07-1.12.07-1.68V7.79c-.005-.556-.02-1.112-.07-1.666zM16.348 7.5l-5.25 2.86v5.29c-.002.07-.008.14-.016.208-.058.495-.384.817-.873.865a.906.906 0 0 1-.148.006c-.14 0-.272-.02-.4-.065a.853.853 0 0 1-.58-.83V9.16c.003-.11.02-.217.054-.32.1-.303.34-.49.647-.564.083-.02.167-.028.254-.023l6.07-3.306c.275-.15.55-.17.83-.055.305.126.474.372.474.704v.006c-.003.527-.003 1.055-.003 1.582v.003c0 .146-.03.282-.06.413z"/>
  </svg>`;

  gallery.innerHTML = data.playlists.map(pl => {
    const artworkEl = pl.artwork
      ? `<img class="playlist-card__artwork" src="${pl.artwork}" alt="${pl.title}" loading="lazy">`
      : `<div class="playlist-card__artwork-placeholder">♫</div>`;

    return `
      <a class="playlist-card" href="${pl.url}" target="_blank" rel="noopener noreferrer">
        ${artworkEl}
        <div class="playlist-card__body">
          <h2 class="playlist-card__title">${pl.title}</h2>
          ${pl.description ? `<p class="playlist-card__desc">${pl.description}</p>` : ''}
          <p class="playlist-card__badge">
            ${appleMusicIcon}
            Apple Music で聴く
          </p>
        </div>
      </a>`;
  }).join('');
}

renderPlaylist();
