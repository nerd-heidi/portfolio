(function () {
  'use strict';

  /* ─── Styles (embedded) ─────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = '\
#chatbot-toggle {\
  position: fixed;\
  bottom: 8px;\
  right: 12px;\
  z-index: 9999;\
  width: 130px;\
  background: none;\
  border: none;\
  cursor: pointer;\
  padding: 0;\
  filter: drop-shadow(0 4px 14px rgba(0,0,0,0.45));\
  transition: transform 0.22s ease, filter 0.22s ease;\
}\
#chatbot-toggle:hover {\
  transform: scale(1.06) translateY(-4px);\
  filter: drop-shadow(0 8px 22px rgba(0,0,0,0.55));\
}\
#chatbot-toggle img {\
  width: 100%;\
  height: auto;\
  display: block;\
}\
#chatbot-window {\
  position: fixed;\
  bottom: 160px;\
  right: 16px;\
  z-index: 9999;\
  width: 340px;\
  max-height: 520px;\
  background: rgba(8,6,16,0.97);\
  border: 1px solid rgba(167,128,255,0.3);\
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
#chatbot-window.open {\
  transform: translateY(0) scale(1);\
  opacity: 1;\
  pointer-events: all;\
}\
.cb-header {\
  padding: 14px 18px;\
  background: rgba(167,128,255,0.1);\
  border-bottom: 1px solid rgba(167,128,255,0.2);\
  display: flex;\
  align-items: center;\
  gap: 11px;\
  flex-shrink: 0;\
}\
.cb-avatar {\
  width: 34px;\
  height: 34px;\
  border-radius: 50%;\
  background: linear-gradient(135deg,#a780ff,#6a4ecf);\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  font-size: 17px;\
  flex-shrink: 0;\
}\
.cb-name {\
  font-size: 14px;\
  font-weight: 700;\
  color: #f5f5f5;\
}\
.cb-status {\
  font-size: 11px;\
  color: rgba(255,255,255,0.45);\
  margin-top: 1px;\
}\
.cb-messages {\
  flex: 1;\
  overflow-y: auto;\
  padding: 16px 14px;\
  display: flex;\
  flex-direction: column;\
  gap: 10px;\
  scrollbar-width: thin;\
  scrollbar-color: rgba(167,128,255,0.3) transparent;\
}\
.cb-messages::-webkit-scrollbar { width: 4px; }\
.cb-messages::-webkit-scrollbar-thumb {\
  background: rgba(167,128,255,0.3);\
  border-radius: 4px;\
}\
.cb-msg {\
  max-width: 90%;\
  padding: 10px 13px;\
  border-radius: 12px;\
  font-size: 13px;\
  line-height: 1.65;\
  word-break: break-word;\
}\
.cb-bot {\
  background: rgba(167,128,255,0.14);\
  border: 1px solid rgba(167,128,255,0.22);\
  color: #ede8ff;\
  align-self: flex-start;\
  border-bottom-left-radius: 4px;\
}\
.cb-user {\
  background: rgba(167,128,255,0.38);\
  color: #fff;\
  align-self: flex-end;\
  border-bottom-right-radius: 4px;\
}\
.cb-bot a {\
  color: #c9a8ff;\
  text-decoration: underline;\
  text-underline-offset: 2px;\
}\
.cb-qr {\
  padding: 6px 14px 12px;\
  display: flex;\
  flex-wrap: wrap;\
  gap: 6px;\
  flex-shrink: 0;\
}\
.cb-qr-btn {\
  background: rgba(167,128,255,0.1);\
  border: 1px solid rgba(167,128,255,0.38);\
  color: #c9a8ff;\
  border-radius: 20px;\
  padding: 5px 13px;\
  font-size: 12px;\
  cursor: pointer;\
  transition: background 0.18s ease, color 0.18s ease;\
  font-family: inherit;\
  line-height: 1.4;\
}\
.cb-qr-btn:hover {\
  background: rgba(167,128,255,0.26);\
  color: #fff;\
}\
.cb-input-row {\
  display: flex;\
  align-items: center;\
  gap: 8px;\
  padding: 10px 14px;\
  border-top: 1px solid rgba(255,255,255,0.08);\
  flex-shrink: 0;\
}\
.cb-input {\
  flex: 1;\
  background: rgba(255,255,255,0.06);\
  border: 1px solid rgba(255,255,255,0.12);\
  border-radius: 20px;\
  padding: 8px 14px;\
  color: #f5f5f5;\
  font-size: 13px;\
  font-family: inherit;\
  outline: none;\
  transition: border-color 0.2s ease;\
  min-width: 0;\
}\
.cb-input:focus {\
  border-color: rgba(167,128,255,0.55);\
}\
.cb-input::placeholder { color: rgba(255,255,255,0.28); }\
.cb-send {\
  width: 36px;\
  height: 36px;\
  border-radius: 50%;\
  background: linear-gradient(135deg,#a780ff,#6a4ecf);\
  border: none;\
  cursor: pointer;\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  transition: transform 0.18s ease;\
  flex-shrink: 0;\
}\
.cb-send:hover { transform: scale(1.1); }\
.cb-send svg { width: 16px; height: 16px; fill: #fff; }\
@media (max-width: 480px) {\
  #chatbot-window {\
    width: calc(100vw - 20px);\
    right: 10px;\
    bottom: 145px;\
  }\
  #chatbot-toggle {\
    right: 6px;\
    bottom: 4px;\
    width: 110px;\
  }\
}\
';
  document.head.appendChild(style);

  /* ─── FAQ データ ────────────────────────────────────────────────── */
  var FAQ = [
    {
      keywords: ['プロフィール', '自己紹介', '誰', 'どんな人', 'about', 'who'],
      answer: 'NERD Lifeへようこそ！音楽・ビート制作、アニメ、AI、読書など、好きなものを集めた個人ポートフォリオです。'
    },
    {
      keywords: ['音楽', 'music', 'ミュージック', 'favorite-music', 'favorite music'],
      answer: '好きな音楽やアーティストを紹介しています。<br>→ <a href="/favorite-music/">Music ページへ</a>'
    },
    {
      keywords: ['ヒップホップ', 'hiphop', 'hip-hop', 'hip hop', 'ラップ', 'rap'],
      answer: 'Hip-Hopの好きな曲・アーティストをまとめています。<br>→ <a href="/music-hiphop/">Music / Hip-Hop ページへ</a>'
    },
    {
      keywords: ['ポップス', 'pops', 'j-pop', 'jpop'],
      answer: 'Popsの好きな曲をまとめています。<br>→ <a href="/music-pops/">Music / Pops ページへ</a>'
    },
    {
      keywords: ['ロック', 'rock'],
      answer: 'Rockの好きな曲をまとめています。<br>→ <a href="/music-rock/">Music / Rock ページへ</a>'
    },
    {
      keywords: ['ビート', 'beat', 'トラック制作', 'daw', '曲作り', 'ビート制作'],
      answer: '自作ビートや制作メモを公開しています。<br>→ <a href="/beat/">Beat ページへ</a>'
    },
    {
      keywords: ['アニメ', 'anime'],
      answer: '好きなアニメ・キャラクター・名シーンを紹介しています。<br>→ <a href="/anime/">Anime ページへ</a>'
    },
    {
      keywords: ['仕事', 'work', 'ワーク', 'お仕事', '実績', '案件', 'portfolio'],
      answer: '仕事・制作実績を紹介しています。<br>→ <a href="/work/">Work ページへ</a>'
    },
    {
      keywords: ['ai', '人工知能', 'chatgpt', 'claude', 'llm', '生成ai', 'openai'],
      answer: 'AI活用事例や試したツールをまとめています。<br>→ <a href="/ai/">AI ページへ</a>'
    },
    {
      keywords: ['本', 'book', '読書', 'おすすめ本', '書籍'],
      answer: '読んだ本の感想やおすすめをまとめています。<br>→ <a href="/book/">Book ページへ</a>'
    },
    {
      keywords: ['映画', 'movie', 'film', 'cinema'],
      answer: '好きな映画・観た映画の感想を書いています。<br>→ <a href="/movie/">Movie ページへ</a>'
    },
    {
      keywords: ['写真', 'photo', 'フォト', '撮影', 'photography'],
      answer: '撮影した写真を公開しています。<br>→ <a href="/photo/">Photo ページへ</a>'
    },
    {
      keywords: ['ゲーム', 'game', 'gaming', 'ゲーミング'],
      answer: '好きなゲームを紹介しています。<br>→ <a href="/game/">Game ページへ</a>'
    },
    {
      keywords: ['アイドル', 'idol'],
      answer: '好きなアイドルを紹介しています。<br>→ <a href="/idol/">Idol ページへ</a>'
    },
    {
      keywords: ['プレイリスト', 'playlist'],
      answer: 'おすすめのプレイリストをまとめています。<br>→ <a href="/playlist/">Playlist ページへ</a>'
    },
    {
      keywords: ['グルメ', '食べ物', 'food', '飯', 'フード', '料理', 'restaurant'],
      answer: '好きなグルメ・お気に入りのお店を紹介しています。<br>→ <a href="/food/">Food ページへ</a>'
    },
    {
      keywords: ['youtube', 'ユーチューブ', '動画', 'video'],
      answer: 'おすすめのYouTubeチャンネルや動画をまとめています。<br>→ <a href="/youtube/">YouTube ページへ</a>'
    },
    {
      keywords: ['cm', 'コマーシャル', 'commercial', '商業'],
      answer: 'CM・商業制作の実績を紹介しています。<br>→ <a href="/commercial/">Commercial ページへ</a>'
    },
    {
      keywords: ['連絡', 'コンタクト', 'contact', 'お問い合わせ', '問い合わせ', 'dm', 'sns'],
      answer: 'お問い合わせはSNSのDMからお気軽にどうぞ！'
    },
    {
      keywords: ['ページ', 'カテゴリ', '何がある', 'コンテンツ', '一覧', 'サイトマップ', 'sitemap'],
      answer: 'Music・Beat・Anime・Work・AI・Book・Movie・Photo・Game・Idol・Playlist・Food・YouTube・Commercialなど多彩なカテゴリがあります！<br>→ <a href="/">トップページへ</a>'
    }
  ];

  /* ─── クイックリプライ ────────────────────────────────────────── */
  var QR = [
    { label: 'プロフィールを教えて', q: 'プロフィール' },
    { label: 'どんなコンテンツがある？', q: '一覧' },
    { label: '音楽について', q: '音楽' },
    { label: 'お仕事について', q: '仕事' }
  ];

  var GREETING = 'こんにちは、Melodyだよ🎵<br>今日はどんな気分？一緒にぴったりの音楽を見つけよう♪';
  var FALLBACK = 'うまく理解できませんでした。\n「音楽」「アニメ」「AI」「仕事」などのキーワードで試してみてください。';

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
    toggle.id = 'chatbot-toggle';
    toggle.setAttribute('aria-label', 'チャットを開く');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<img src="/images/chatbot-char.png" alt="チャットを開く" draggable="false" />';

    var win = document.createElement('div');
    win.id = 'chatbot-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'チャットボット');
    win.innerHTML =
      '<div class="cb-header">' +
        '<span class="cb-avatar">🤖</span>' +
        '<div>' +
          '<div class="cb-name">Melody</div>' +
          '<div class="cb-status">AI Music Companion 🎵</div>' +
        '</div>' +
      '</div>' +
      '<div class="cb-messages" id="cb-messages"></div>' +
      '<div class="cb-qr" id="cb-qr"></div>' +
      '<div class="cb-input-row">' +
        '<input class="cb-input" id="cb-input" type="text"' +
          ' placeholder="メッセージを入力…" autocomplete="off" maxlength="200" />' +
        '<button class="cb-send" id="cb-send" aria-label="送信">' +
          '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>' +
          '</svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(toggle);
    document.body.appendChild(win);
    return { toggle: toggle, win: win };
  }

  /* ─── メッセージ追加 ──────────────────────────────────────────── */
  function addMsg(text, role) {
    var el = document.getElementById('cb-messages');
    var msg = document.createElement('div');
    msg.className = 'cb-msg cb-' + role;
    msg.innerHTML = text.replace(/\n/g, '<br>');
    el.appendChild(msg);
    el.scrollTop = el.scrollHeight;
  }

  /* ─── クイックリプライ描画 ────────────────────────────────────── */
  function renderQR(onSelect) {
    var el = document.getElementById('cb-qr');
    el.innerHTML = '';
    QR.forEach(function (item) {
      var btn = document.createElement('button');
      btn.className = 'cb-qr-btn';
      btn.textContent = item.label;
      btn.addEventListener('click', function () { onSelect(item.q, item.label); });
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
      document.getElementById('cb-qr').innerHTML = '';
      addMsg(text, 'user');
      document.getElementById('cb-input').value = '';
      setTimeout(function () {
        var ans = findAnswer(query || text);
        addMsg(ans || FALLBACK, 'bot');
        if (!ans) renderQR(send);
      }, 380);
    }

    function openChat() {
      isOpen = true;
      ui.win.classList.add('open');
      ui.toggle.setAttribute('aria-expanded', 'true');
      if (document.getElementById('cb-messages').children.length === 0) {
        addMsg(GREETING, 'bot');
        renderQR(send);
      }
      setTimeout(function () {
        var inp = document.getElementById('cb-input');
        if (inp) inp.focus();
      }, 250);
    }

    function closeChat() {
      isOpen = false;
      ui.win.classList.remove('open');
      ui.toggle.setAttribute('aria-expanded', 'false');
    }

    ui.toggle.addEventListener('click', function () {
      isOpen ? closeChat() : openChat();
    });

    document.getElementById('cb-send').addEventListener('click', function () {
      var v = document.getElementById('cb-input').value.trim();
      if (v) send(v);
    });

    document.getElementById('cb-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var v = this.value.trim();
        if (v) send(v);
      }
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
