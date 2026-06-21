(function () {
  'use strict';

  /* ─── Styles (embedded) ─────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = '\
#chatbot-seeno-toggle {\
  position: fixed;\
  top: 82px;\
  left: 0;\
  z-index: 5;\
  width: 195px;\
  background: none;\
  border: none;\
  cursor: pointer;\
  padding: 0;\
  filter: drop-shadow(0 4px 14px rgba(0,0,0,0.45));\
  transition: transform 0.22s ease, filter 0.22s ease;\
}\
#chatbot-seeno-toggle:hover {\
  transform: scale(1.04);\
  filter: drop-shadow(0 8px 22px rgba(0,0,0,0.55));\
}\
#chatbot-seeno-toggle img {\
  width: 100%;\
  height: auto;\
  display: block;\
}\
#chatbot-seeno-window {\
  position: fixed;\
  top: 88px;\
  left: 200px;\
  z-index: 9999;\
  width: 340px;\
  max-height: 520px;\
  background: rgba(15,12,8,0.97);\
  border: 1px solid rgba(166,141,114,0.3);\
  border-radius: 18px;\
  display: flex;\
  flex-direction: column;\
  overflow: hidden;\
  box-shadow: 0 12px 56px rgba(0,0,0,0.7);\
  backdrop-filter: blur(24px);\
  -webkit-backdrop-filter: blur(24px);\
  transform: translateY(14px) scale(0.97);\
  opacity: 0;\
  pointer-events: none;\
  transition: transform 0.26s ease, opacity 0.26s ease;\
}\
#chatbot-seeno-window.open {\
  transform: translateY(0) scale(1);\
  opacity: 1;\
  pointer-events: all;\
}\
.cs-header {\
  padding: 14px 18px;\
  background: rgba(166,141,114,0.1);\
  border-bottom: 1px solid rgba(166,141,114,0.2);\
  display: flex;\
  align-items: center;\
  gap: 11px;\
  flex-shrink: 0;\
}\
.cs-avatar {\
  width: 34px;\
  height: 34px;\
  border-radius: 50%;\
  background: linear-gradient(135deg,#A68D72,#665C50);\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  font-size: 17px;\
  flex-shrink: 0;\
}\
.cs-name {\
  font-size: 14px;\
  font-weight: 700;\
  color: #f5f5f5;\
}\
.cs-status {\
  font-size: 11px;\
  color: rgba(255,255,255,0.45);\
  margin-top: 1px;\
}\
.cs-messages {\
  flex: 1;\
  overflow-y: auto;\
  padding: 16px 14px;\
  display: flex;\
  flex-direction: column;\
  gap: 10px;\
  scrollbar-width: thin;\
  scrollbar-color: rgba(166,141,114,0.3) transparent;\
}\
.cs-messages::-webkit-scrollbar { width: 4px; }\
.cs-messages::-webkit-scrollbar-thumb {\
  background: rgba(166,141,114,0.3);\
  border-radius: 4px;\
}\
.cs-msg {\
  max-width: 90%;\
  padding: 10px 13px;\
  border-radius: 12px;\
  font-size: 13px;\
  line-height: 1.65;\
  word-break: break-word;\
}\
.cs-bot {\
  background: rgba(166,141,114,0.14);\
  border: 1px solid rgba(166,141,114,0.22);\
  color: #f0ebe3;\
  align-self: flex-start;\
  border-bottom-left-radius: 4px;\
}\
.cs-user {\
  background: rgba(166,141,114,0.38);\
  color: #fff;\
  align-self: flex-end;\
  border-bottom-right-radius: 4px;\
}\
.cs-bot a {\
  color: #D6C5B4;\
  text-decoration: underline;\
  text-underline-offset: 2px;\
}\
.cs-qr {\
  padding: 8px 10px 12px;\
  display: grid;\
  grid-template-columns: 1fr 1fr;\
  gap: 5px;\
  flex-shrink: 0;\
  max-height: 185px;\
  overflow-y: auto;\
  scrollbar-width: thin;\
  scrollbar-color: rgba(166,141,114,0.3) transparent;\
}\
.cs-qr::-webkit-scrollbar { width: 4px; }\
.cs-qr::-webkit-scrollbar-thumb { background: rgba(166,141,114,0.3); border-radius: 4px; }\
.cs-qr-btn {\
  background: rgba(166,141,114,0.1);\
  border: 1px solid rgba(166,141,114,0.35);\
  color: #D6C5B4;\
  border-radius: 8px;\
  padding: 7px 8px;\
  font-size: 12px;\
  cursor: pointer;\
  transition: background 0.18s ease, color 0.18s ease;\
  font-family: inherit;\
  line-height: 1.35;\
  text-align: left;\
}\
.cs-qr-btn:hover {\
  background: rgba(166,141,114,0.26);\
  color: #fff;\
}\
@media (max-width: 768px) {\
  #chatbot-seeno-window {\
    width: calc(100vw - 16px);\
    left: 8px;\
    top: 230px;\
    max-height: calc(100vh - 250px);\
  }\
  #chatbot-seeno-toggle {\
    top: 82px;\
    left: 0;\
    width: 140px;\
  }\
}\
';
  document.head.appendChild(style);

  /* ─── FAQ データ ─────────────────────────────────────────────────── */
  var FAQ = [
    {
      keywords: ['プロフィール', '自己紹介', '誰', 'seeno', 'シーノ', 'about', 'who'],
      answer: 'シーノ（Seeno）。AIミュージックコンパニオンだよ。<br>"Music is my escape." — 音楽のある場所で、いつも自分らしくいられる。<br>→ <a href="/melody/">キャラクターページへ</a>'
    },
    {
      keywords: ['音楽', 'music', 'ミュージック', 'favorite-music', 'favorite music'],
      answer: '好きな音楽やアーティスト、まとめてあるよ。<br>→ <a href="/favorite-music/">Music ページへ</a>'
    },
    {
      keywords: ['ヒップホップ', 'hiphop', 'hip-hop', 'hip hop', 'ラップ', 'rap'],
      answer: 'Hip-Hopの曲まとめてある。<br>→ <a href="/music-hiphop/">Music / Hip-Hop ページへ</a>'
    },
    {
      keywords: ['ポップス', 'pops', 'j-pop', 'jpop'],
      answer: 'Popsのまとめはここ。<br>→ <a href="/music-pops/">Music / Pops ページへ</a>'
    },
    {
      keywords: ['ロック', 'rock'],
      answer: 'Rockのまとめはここ。<br>→ <a href="/music-rock/">Music / Rock ページへ</a>'
    },
    {
      keywords: ['ビート', 'beat', 'トラック制作', 'daw', '曲作り', 'ビート制作'],
      answer: '自作ビートや制作メモ、見てみて。<br>→ <a href="/beat/">Beat ページへ</a>'
    },
    {
      keywords: ['アニメ', 'anime'],
      answer: '好きなアニメまとめてある。<br>→ <a href="/anime/">Anime ページへ</a>'
    },
    {
      keywords: ['仕事', 'work', 'ワーク', 'お仕事', '実績', '案件', 'portfolio'],
      answer: '仕事の実績、ここにある。<br>→ <a href="/work/">Work ページへ</a>'
    },
    {
      keywords: ['ai', '人工知能', 'chatgpt', 'claude', 'llm', '生成ai', 'openai'],
      answer: 'AI活用事例のまとめ。<br>→ <a href="/ai/">AI ページへ</a>'
    },
    {
      keywords: ['本', 'book', '読書', 'おすすめ本', '書籍'],
      answer: '本の感想とかまとめてある。<br>→ <a href="/book/">Book ページへ</a>'
    },
    {
      keywords: ['映画', 'movie', 'film', 'cinema'],
      answer: '映画のまとめはここ。<br>→ <a href="/movie/">Movie ページへ</a>'
    },
    {
      keywords: ['写真', 'photo', 'フォト', '撮影', 'photography'],
      answer: '写真、公開してるよ。<br>→ <a href="/photo/">Photo ページへ</a>'
    },
    {
      keywords: ['ゲーム', 'game', 'gaming', 'ゲーミング'],
      answer: 'ゲームのまとめはここ。<br>→ <a href="/game/">Game ページへ</a>'
    },
    {
      keywords: ['アイドル', 'idol'],
      answer: 'アイドルまとめはここ。<br>→ <a href="/idol/">Idol ページへ</a>'
    },
    {
      keywords: ['プレイリスト', 'playlist'],
      answer: 'プレイリストのまとめ。<br>→ <a href="/playlist/">Playlist ページへ</a>'
    },
    {
      keywords: ['グルメ', '食べ物', 'food', '飯', 'フード', '料理', 'restaurant'],
      answer: 'グルメのまとめはここ。<br>→ <a href="/food/">Food ページへ</a>'
    },
    {
      keywords: ['youtube', 'ユーチューブ', '動画', 'video'],
      answer: 'YouTubeチャンネルのまとめ。<br>→ <a href="/youtube/">YouTube ページへ</a>'
    },
    {
      keywords: ['cm', 'コマーシャル', 'commercial', '商業'],
      answer: 'CM制作の実績。<br>→ <a href="/commercial/">Commercial ページへ</a>'
    },
    {
      keywords: ['連絡', 'コンタクト', 'contact', 'お問い合わせ', '問い合わせ', 'dm', 'sns'],
      answer: 'お問い合わせはSNSのDMからどうぞ。'
    },
    {
      keywords: ['ページ', 'カテゴリ', '何がある', 'コンテンツ', '一覧', 'サイトマップ', 'sitemap'],
      answer: 'Music・Beat・Anime・Work・AI・Book・Movie・Photo・Game・Idol・Playlist・Food・YouTube・Commercial、全部ある。<br>→ <a href="/">トップページへ</a>'
    },
    {
      keywords: ['character', 'bot character', 'キャラクター', 'melodyとは', 'melodyって', 'ボットキャラ'],
      answer: 'MelodyとSeeno（シーノ）の2体がいるよ🎵<br>→ <a href="/melody/">キャラクターページへ</a>'
    }
  ];

  /* ─── クイックリプライ ────────────────────────────────────────── */
  var QR = [
    { label: '👤 私について', q: 'プロフィール' },
    { label: '🎵 音楽', q: '音楽' },
    { label: '🎧 ビート制作', q: 'ビート' },
    { label: '🎤 アイドル', q: 'アイドル' },
    { label: '🎌 アニメ', q: 'アニメ' },
    { label: '💼 お仕事', q: '仕事' },
    { label: '🤖 AI', q: 'AI' },
    { label: '📚 本', q: '本' },
    { label: '🎬 映画', q: '映画' },
    { label: '📷 写真', q: '写真' },
    { label: '🎮 ゲーム', q: 'ゲーム' },
    { label: '🍽 グルメ', q: 'グルメ' },
    { label: '▶ YouTube', q: 'youtube' },
    { label: '📋 全ページ一覧', q: '一覧' },
    { label: '🎀 Bot Character について', q: 'character' }
  ];

  var GREETING = '...シーノだよ。🎧<br>何か聞きたいことある？';
  var FALLBACK = '...わかんなかった。下のボタンから選んでみて。';

  /* ─── FAQ 検索 ───────────────────────────────────────────────── */
  function findAnswer(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < FAQ.length; i++) {
      var item = FAQ[i];
      for (var j = 0; j < item.keywords.length; j++) {
        if (lower.indexOf(item.keywords[j].toLowerCase()) !== -1) {
          return item.answer;
        }
      }
    }
    return null;
  }

  /* ─── UI 構築 ────────────────────────────────────────────────── */
  function buildUI() {
    var toggle = document.createElement('button');
    toggle.id = 'chatbot-seeno-toggle';
    toggle.setAttribute('aria-label', 'Seenoのチャットを開く');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<img src="/images/chatbot-seeno.png" alt="Seeno" draggable="false" />';

    var win = document.createElement('div');
    win.id = 'chatbot-seeno-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Seenoチャットボット');
    win.innerHTML =
      '<div class="cs-header">' +
        '<span class="cs-avatar">🎧</span>' +
        '<div>' +
          '<div class="cs-name">Seeno</div>' +
          '<div class="cs-status">AI Music Companion</div>' +
        '</div>' +
      '</div>' +
      '<div class="cs-messages" id="cs-messages"></div>' +
      '<div class="cs-qr" id="cs-qr"></div>';

    document.body.appendChild(toggle);
    document.body.appendChild(win);
    return { toggle: toggle, win: win };
  }

  /* ─── メッセージ追加 ──────────────────────────────────────────── */
  function addMsg(text, role) {
    var el = document.getElementById('cs-messages');
    var msg = document.createElement('div');
    msg.className = 'cs-msg cs-' + role;
    msg.innerHTML = text.replace(/\n/g, '<br>');
    el.appendChild(msg);
    el.scrollTop = el.scrollHeight;
  }

  /* ─── クイックリプライ描画 ────────────────────────────────────── */
  function renderQR(onSelect) {
    var el = document.getElementById('cs-qr');
    el.innerHTML = '';
    QR.forEach(function (item) {
      var btn = document.createElement('button');
      btn.className = 'cs-qr-btn';
      btn.textContent = item.label;
      btn.addEventListener('click', function (e) { e.stopPropagation(); onSelect(item.q, item.label); });
      el.appendChild(btn);
    });
  }

  /* ─── 初期化 ──────────────────────────────────────────────────── */
  function init() {
    var ui = buildUI();
    var isOpen = false;

    function send(query, display) {
      var text = (display || query).trim();
      if (!text) return;
      document.getElementById('cs-qr').innerHTML = '';
      addMsg(text, 'user');
      setTimeout(function () {
        var ans = findAnswer(query || text);
        addMsg(ans || FALLBACK, 'bot');
        renderQR(send);
      }, 380);
    }

    function openChat() {
      isOpen = true;
      ui.win.classList.add('open');
      ui.toggle.setAttribute('aria-expanded', 'true');
      if (document.getElementById('cs-messages').children.length === 0) {
        addMsg(GREETING, 'bot');
        renderQR(send);
      }
    }

    function closeChat() {
      isOpen = false;
      ui.win.classList.remove('open');
      ui.toggle.setAttribute('aria-expanded', 'false');
    }

    ui.toggle.addEventListener('click', function () {
      isOpen ? closeChat() : openChat();
    });

    document.addEventListener('click', function (e) {
      if (isOpen && !ui.win.contains(e.target) && !ui.toggle.contains(e.target)) {
        closeChat();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
