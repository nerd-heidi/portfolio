(function () {
  'use strict';

  /* ─── Styles ─────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = '\
#header-player {\
  position: absolute;\
  left: 50%;\
  transform: translateX(-50%);\
  display: flex;\
  align-items: center;\
  gap: 10px;\
  background: rgba(255,255,255,0.06);\
  border: 1px solid rgba(255,255,255,0.2);\
  border-radius: 999px;\
  padding: 8px 24px 8px 12px;\
  min-width: 320px;\
  transition: border-color 0.2s ease;\
}\
#header-player.hp-playing {\
  border-color: rgba(255,255,255,0.45);\
}\
.hp-btn {\
  flex-shrink: 0;\
  width: 36px;\
  height: 36px;\
  border-radius: 50%;\
  border: 1px solid rgba(255,255,255,0.35);\
  background: rgba(255,255,255,0.1);\
  color: #fff;\
  cursor: pointer;\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  transition: background 0.18s ease, transform 0.15s ease, border-color 0.18s ease;\
  padding: 0;\
}\
.hp-btn:hover {\
  background: rgba(255,255,255,0.25);\
  border-color: rgba(255,255,255,0.7);\
  transform: scale(1.12);\
}\
.hp-btn svg {\
  width: 14px;\
  height: 14px;\
  display: block;\
}\
#hp-play {\
  width: 44px;\
  height: 44px;\
  background: rgba(255,255,255,0.22);\
  border-color: rgba(255,255,255,0.6);\
  color: #fff;\
}\
#hp-play:hover {\
  background: rgba(255,255,255,0.38);\
  border-color: #fff;\
}\
#hp-play svg {\
  width: 17px;\
  height: 17px;\
}\
#hp-info {\
  flex: 1;\
  min-width: 0;\
  overflow: hidden;\
}\
#hp-title {\
  display: block;\
  font-size: 26px;\
  font-weight: 700;\
  color: #fff;\
  white-space: nowrap;\
  overflow: hidden;\
  text-overflow: ellipsis;\
  letter-spacing: -0.02em;\
  line-height: 1.2;\
}\
#hp-artist {\
  display: block;\
  font-size: 13px;\
  color: rgba(255,255,255,0.5);\
  white-space: nowrap;\
  overflow: hidden;\
  text-overflow: ellipsis;\
  line-height: 1.3;\
}\
#hp-dot {\
  width: 5px;\
  height: 5px;\
  border-radius: 50%;\
  background: rgba(167,128,255,0.35);\
  flex-shrink: 0;\
  transition: background 0.3s ease;\
}\
#hp-dot.active {\
  background: #a780ff;\
  animation: hp-pulse 1.4s ease-in-out infinite;\
}\
@keyframes hp-pulse {\
  0%,100%{opacity:1}\
  50%{opacity:0.25}\
}\
@media (max-width: 860px) {\
  #header-player {\
    display: none;\
  }\
}\
';
  document.head.appendChild(style);

  /* ─── Init ───────────────────────────────────────────────────── */
  function init() {
    var header = document.querySelector('.site-header');
    var menuToggle = document.querySelector('.menu-toggle');
    if (!header) return;

    var player = document.createElement('div');
    player.id = 'header-player';
    player.setAttribute('aria-label', 'Concept Music プレイヤー');
    player.innerHTML =
      '<span id="hp-dot"></span>' +
      '<button class="hp-btn" id="hp-prev" aria-label="前の曲">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="19,3 5,12 19,21"/></svg>' +
      '</button>' +
      '<button class="hp-btn" id="hp-play" aria-label="再生">' +
        '<svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>' +
        '<svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' +
      '</button>' +
      '<button class="hp-btn" id="hp-next" aria-label="次の曲">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>' +
      '</button>' +
      '<div id="hp-info">' +
        '<span id="hp-title">Concept Music</span>' +
        '<span id="hp-artist"></span>' +
      '</div>';

    // 絶対中央配置のため DOM の末尾に追加
    header.appendChild(player);

    var tracks = [];
    var current = 0;
    var audio = new Audio();
    audio.preload = 'none';

    fetch('/_data/concept-music.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        tracks = (data.tracks || []).filter(function (t) { return t.audio; });
        if (tracks.length) updateInfo();
      })
      .catch(function () {});

    function updateInfo() {
      var t = tracks[current];
      if (!t) return;
      document.getElementById('hp-title').textContent = t.title || 'Track';
      document.getElementById('hp-artist').textContent = t.artist || '';
    }

    function loadAndPlay(idx) {
      if (!tracks.length) return;
      var wasPlaying = !audio.paused;
      audio.pause();
      current = ((idx % tracks.length) + tracks.length) % tracks.length;
      audio.src = encodeURI(tracks[current].audio);
      updateInfo();
      if (wasPlaying) audio.play().catch(function () {});
    }

    function setPlayUI(playing) {
      document.getElementById('hp-play').querySelector('.icon-play').style.display = playing ? 'none' : '';
      document.getElementById('hp-play').querySelector('.icon-pause').style.display = playing ? '' : 'none';
      document.getElementById('hp-dot').classList.toggle('active', playing);
      player.classList.toggle('hp-playing', playing);
    }

    document.getElementById('hp-play').addEventListener('click', function () {
      if (!tracks.length) return;
      if (audio.paused) {
        if (!audio.src) audio.src = encodeURI(tracks[current].audio);
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    });

    document.getElementById('hp-prev').addEventListener('click', function () {
      loadAndPlay(current - 1);
    });

    document.getElementById('hp-next').addEventListener('click', function () {
      loadAndPlay(current + 1);
    });

    audio.addEventListener('play',  function () { setPlayUI(true); });
    audio.addEventListener('pause', function () { setPlayUI(false); });
    audio.addEventListener('ended', function () { loadAndPlay(current + 1); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
