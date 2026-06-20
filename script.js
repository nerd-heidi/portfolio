// Card shimmer / spotlight on hover (topic cards on index page)
document.querySelectorAll(".topic-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  });
});

// YouTube ファサード: クリックでiframeに切り替え
document.addEventListener('click', function(e) {
  const facade = e.target.closest('.yt-facade');
  if (!facade) return;
  const id = facade.dataset.id;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
  facade.innerHTML = '';
  facade.appendChild(iframe);
});

