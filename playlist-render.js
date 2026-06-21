// =====================================================
// Apple Music Developer Token
// 取得方法: https://developer.apple.com/documentation/applemusicapi/generating_developer_tokens
// Apple Developer Program ($99/年) に登録後、
// MusicKit 用の秘密鍵と Key ID で JWT を生成して下記に設定してください。
// トークン未設定の場合は JSON に登録した artwork 画像をフォールバック表示します。
// =====================================================
const APPLE_MUSIC_TOKEN = '';
const STOREFRONT = 'jp';

const AM_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208a4.92 4.92 0 0 0-.35 1.467c-.06.534-.083 1.072-.084 1.61v9.468c.01.368.02.738.065 1.105.124 1.016.49 1.93 1.136 2.715.77.93 1.745 1.488 2.927 1.727.39.08.793.107 1.19.124.04.003.082.01.124.013h12.01c.15-.01.303-.017.453-.026.76-.05 1.503-.15 2.207-.43 1.336-.53 2.3-1.45 2.865-2.78.24-.57.35-1.17.4-1.78.05-.56.07-1.12.07-1.68V7.79c-.005-.556-.02-1.112-.07-1.666zM16.348 7.5l-5.25 2.86v5.29c-.002.07-.008.14-.016.208-.058.495-.384.817-.873.865a.906.906 0 0 1-.148.006c-.14 0-.272-.02-.4-.065a.853.853 0 0 1-.58-.83V9.16c.003-.11.02-.217.054-.32.1-.303.34-.49.647-.564.083-.02.167-.028.254-.023l6.07-3.306c.275-.15.55-.17.83-.055.305.126.474.372.474.704v.006c-.003.527-.003 1.055-.003 1.582v.003c0 .146-.03.282-.06.413z"/></svg>`;

/** Apple Music URL から pl.XXXXX 形式の ID を抽出 */
function extractPlaylistId(url) {
  const m = url.match(/\/(pl\.[a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

/** Apple Music Artwork オブジェクトから画像 URL を生成 */
function artworkUrl(obj, size = 300) {
  if (!obj?.url) return null;
  return obj.url.replace('{w}', size).replace('{h}', size);
}

/**
 * Apple Music API でプレイリストの先頭 N 曲のアートワーク URL を取得
 * Developer Token が必要。未設定時は空配列を返す。
 */
async function fetchTrackArtworks(playlistId, count = 4) {
  if (!APPLE_MUSIC_TOKEN || !playlistId) return [];
  try {
    const res = await fetch(
      `https://api.music.apple.com/v1/catalog/${STOREFRONT}/playlists/${playlistId}?include=tracks&limit[tracks]=${count}`,
      { headers: { Authorization: `Bearer ${APPLE_MUSIC_TOKEN}` } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const tracks = json.data?.[0]?.relationships?.tracks?.data ?? [];
    return tracks.slice(0, count)
      .map(t => artworkUrl(t.attributes?.artwork))
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * アートワーク配列から 2×2 モザイク HTML を生成
 * 画像枚数に応じてグリッド列数を調整
 */
function buildMosaic(artworks, title) {
  if (!artworks.length) {
    return `<div class="pl-mosaic pl-mosaic--empty">♫</div>`;
  }
  const cols = artworks.length === 1 ? 1 : 2;
  const imgs = artworks
    .map(url => `<img src="${url}" alt="" loading="lazy">`)
    .join('');
  return `<div class="pl-mosaic pl-mosaic--${cols}col">${imgs}</div>`;
}

async function renderPlaylist() {
  const res = await fetch('/_data/playlist.json?v=' + Date.now());
  if (!res.ok) return;
  const data = await res.json();

  const gallery = document.getElementById('playlist-gallery');
  if (!gallery || !data.playlists?.length) {
    if (gallery) gallery.innerHTML = '<p class="loading-state">プレイリストがまだ登録されていません。</p>';
    return;
  }

  gallery.innerHTML = '<div class="loading-state">アートワークを取得中…</div>';

  const cards = await Promise.all(data.playlists.map(async pl => {
    const pid = extractPlaylistId(pl.url);
    let coverHtml;

    if (APPLE_MUSIC_TOKEN && pid) {
      // トークンあり → API でトラックアートワーク取得してモザイク表示
      const artworks = await fetchTrackArtworks(pid);
      coverHtml = buildMosaic(artworks, pl.title);
    } else if (pl.artwork) {
      // フォールバック① → JSON に登録した artwork 画像を使用
      coverHtml = `<div class="pl-mosaic pl-mosaic--1col"><img src="${pl.artwork}" alt="${pl.title}" loading="lazy"></div>`;
    } else {
      // フォールバック② → プレースホルダー
      coverHtml = `<div class="pl-mosaic pl-mosaic--empty">♫</div>`;
    }

    return `
      <div class="playlist-card">
        <a class="playlist-card__cover" href="${pl.url}" target="_blank" rel="noopener noreferrer" aria-label="${pl.title} を Apple Music で開く">
          ${coverHtml}
        </a>
        <div class="playlist-card__body">
          <h2 class="playlist-card__title">${pl.title}</h2>
          ${pl.description ? `<p class="playlist-card__desc">${pl.description}</p>` : ''}
          <a class="playlist-card__badge" href="${pl.url}" target="_blank" rel="noopener noreferrer">
            ${AM_ICON}Apple Music で聴く
          </a>
        </div>
      </div>`;
  }));

  gallery.innerHTML = cards.join('');
}

renderPlaylist();
