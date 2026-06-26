function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(sec) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function renderConceptMusicPage() {
  const container = document.querySelector('.page-content');
  if (!container) return;

  let data;
  try {
    const res = await fetch('/_data/concept-music.json');
    if (!res.ok) throw new Error(res.statusText);
    data = await res.json();
  } catch {
    container.innerHTML = '<p class="loading-state">読み込みに失敗しました。</p>';
    return;
  }

  const tracks = data.tracks || [];
  if (tracks.length === 0) {
    container.innerHTML = '<p class="loading-state">トラックがありません。</p>';
    return;
  }

  const items = tracks.map((t, i) => {
    const hasArtwork = t.artwork && t.artwork.trim();
    const artworkHtml = hasArtwork
      ? `<img class="cm-artwork" src="${escapeHtml(t.artwork)}" alt="${escapeHtml(t.title)}" loading="lazy" />`
      : `<div class="cm-artwork cm-artwork--placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/></svg></div>`;

    const descHtml = t.description
      ? `<p class="cm-desc">${escapeHtml(t.description)}</p>`
      : '';

    return `
    <div class="cm-track" data-index="${i}">
      ${artworkHtml}
      <div class="cm-info">
        <span class="cm-track-number">Track ${String(i + 1).padStart(2, '0')}</span>
        <span class="cm-title">${escapeHtml(t.title)}</span>
        ${descHtml}
        <div class="cm-player">
          <button class="cm-play" aria-label="Play">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
          <div class="cm-progress-wrap">
            <div class="cm-progress-bar" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="cm-progress-fill"></div>
            </div>
            <span class="cm-time">0:00 / 0:00</span>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  container.innerHTML = `<div class="cm-list">${items}</div>`;

  const audios = tracks.map(t => {
    const src = t.audio ? encodeURI(t.audio) : '';
    const a = new Audio(src);
    a.preload = 'metadata';
    return a;
  });

  let currentIndex = -1;
  const trackEls = container.querySelectorAll('.cm-track');

  function stopAll(except = -1) {
    audios.forEach((a, i) => {
      if (i === except) return;
      a.pause();
      a.currentTime = 0;
      const el = trackEls[i];
      if (!el) return;
      el.classList.remove('playing');
      el.querySelector('.icon-play').style.display = '';
      el.querySelector('.icon-pause').style.display = 'none';
      el.querySelector('.cm-progress-fill').style.width = '0%';
      el.querySelector('.cm-time').textContent = `0:00 / ${formatTime(a.duration)}`;
    });
  }

  trackEls.forEach((el, i) => {
    const audio = audios[i];
    const playBtn = el.querySelector('.cm-play');
    const fill = el.querySelector('.cm-progress-fill');
    const bar = el.querySelector('.cm-progress-bar');
    const timeEl = el.querySelector('.cm-time');

    audio.addEventListener('loadedmetadata', () => {
      timeEl.textContent = `0:00 / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      fill.style.width = `${pct}%`;
      bar.setAttribute('aria-valuenow', Math.round(pct));
      timeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('ended', () => {
      el.classList.remove('playing');
      playBtn.querySelector('.icon-play').style.display = '';
      playBtn.querySelector('.icon-pause').style.display = 'none';
      fill.style.width = '0%';
      audio.currentTime = 0;
      timeEl.textContent = `0:00 / ${formatTime(audio.duration)}`;
      currentIndex = -1;
    });

    playBtn.addEventListener('click', () => {
      if (!audio.paused) {
        audio.pause();
        el.classList.remove('playing');
        playBtn.querySelector('.icon-play').style.display = '';
        playBtn.querySelector('.icon-pause').style.display = 'none';
        currentIndex = -1;
      } else {
        stopAll(i);
        currentIndex = i;
        audio.play().catch(() => {});
        el.classList.add('playing');
        playBtn.querySelector('.icon-play').style.display = 'none';
        playBtn.querySelector('.icon-pause').style.display = '';
      }
    });

    bar.addEventListener('click', e => {
      if (!audio.duration) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
    });
  });
}
