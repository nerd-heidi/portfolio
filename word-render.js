(function () {
  /* ── CSS ── */
  const css = `
  #word-section {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 1.25rem 5rem;
  }

  /* ── グリッド ── */
  .word-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    align-items: start;
  }
  @media (max-width: 640px) {
    .word-grid { grid-template-columns: 1fr; }
  }

  /* ── カード ── */
  .word-card {
    background: #0c0c0c;
    border: 1px solid #1c1c1c;
    border-radius: 16px;
    padding: 2.25rem 2rem 1.75rem;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  }
  .word-card:hover {
    border-color: rgba(167,128,255,0.35);
    box-shadow: 0 8px 36px rgba(167,128,255,0.09);
    transform: translateY(-4px);
  }

  /* デコレーティブ引用符 */
  .word-card::before {
    content: '\u201C';
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 9rem;
    line-height: 0.8;
    color: #a780ff;
    opacity: 0.1;
    position: absolute;
    top: 0.4rem;
    left: 0.75rem;
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }

  /* タグ */
  .word-tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    background: rgba(167,128,255,0.12);
    color: #a780ff;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
  }

  /* 本文 */
  .word-text {
    font-size: 1.05rem;
    line-height: 1.95;
    color: #e8e8e8;
    font-style: italic;
    letter-spacing: 0.015em;
    margin-bottom: 1.6rem;
    position: relative;
    z-index: 1;
    word-break: break-word;
    white-space: pre-wrap;
  }

  /* 出典 */
  .word-attribution {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
    z-index: 1;
  }
  .word-line {
    flex-shrink: 0;
    width: 2rem;
    height: 1px;
    background: linear-gradient(to right, #a780ff, transparent);
  }
  .word-source {
    font-size: 0.82rem;
    color: #777;
    letter-spacing: 0.04em;
  }

  /* 空状態 */
  .word-empty {
    grid-column: 1 / -1;
    text-align: center;
    color: #444;
    padding: 5rem 0;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
  }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── タグ表示名 ── */
  const TAG_LABEL = {
    lyric:  'Lyric',
    quote:  'Quote',
    movie:  'Movie',
    book:   'Book',
    anime:  'Anime',
    other:  'Other',
  };

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderCard(item) {
    const tagHtml = (item.tag && TAG_LABEL[item.tag])
      ? `<span class="word-tag">${TAG_LABEL[item.tag]}</span>`
      : '';
    const sourceHtml = item.source
      ? `<div class="word-attribution">
           <span class="word-line"></span>
           <span class="word-source">${esc(item.source)}</span>
         </div>`
      : '';
    return `<article class="word-card">
  ${tagHtml}
  <p class="word-text">${esc(item.text)}</p>
  ${sourceHtml}
</article>`;
  }

  async function load() {
    const section = document.getElementById('word-section');
    if (!section) return;

    let data;
    try {
      const res = await fetch('/_data/word.json?v=' + Date.now());
      if (!res.ok) throw new Error('fetch');
      data = await res.json();
    } catch (_) {
      section.innerHTML = '<p style="color:#444;text-align:center;padding:4rem 0;letter-spacing:.06em">データを読み込めませんでした</p>';
      return;
    }

    const items = Array.isArray(data.items) ? data.items : [];
    const cardsHtml = items.length
      ? items.map(renderCard).join('')
      : '<p class="word-empty">— まだ登録されていません —</p>';

    section.innerHTML = `<div class="word-grid">${cardsHtml}</div>`;
  }

  load();
})();
