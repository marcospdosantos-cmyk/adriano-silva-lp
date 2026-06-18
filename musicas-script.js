/* ============================================================
   ADRIANO SILVA — Player de músicas
   Substitua os títulos e src quando Adriano entregar os MP3s.
   ============================================================ */

(() => {
  const tracks = [
    { title: 'A Li',                      src: 'assets/music/a-li.mpeg' },
    { title: 'A guerra',                  src: 'assets/music/a-guerra.mpeg' },
    { title: 'Trilha 01',                 src: 'assets/music/trilha-01.mpeg' },
    { title: 'Ignorância',                src: 'assets/music/ignorancia.mpeg' },
    { title: 'Princesa do subúrbio',      src: 'assets/music/princesa-do-suburbio.mpeg' },
    { title: 'Quem disse (V1)',           src: 'assets/music/quem-disse-v1.mpeg' },
    { title: 'Simplesmente atenda bem',   src: 'assets/music/simplesmente-atenda-bem.mpeg' },
    { title: 'Labirinto',                 src: 'assets/music/labirinto.mpeg' },
    { title: 'O mesmo todo dia',          src: 'assets/music/o-mesmo-todo-dia.mpeg' },
    { title: 'O Anjo e a Sereia',         src: 'assets/music/o-anjo-e-a-sereia.mpeg' },
    { title: 'Leticia',                   src: 'assets/music/leticia.mpeg' },
    { title: 'O último blues do inverno', src: 'assets/music/o-ultimo-blues-do-inverno.mpeg' },
    { title: 'Osso duro',                 src: 'assets/music/osso-duro.mpeg' },
    { title: 'Quem disse (V2)',           src: 'assets/music/quem-disse-v2.mpeg' },
    { title: 'Quem disse (V3)',           src: 'assets/music/quem-disse-v3.mpeg' },
    { title: 'Estrelas',                  src: 'assets/music/estrelas.mpeg' },
  ];

  const audio     = new Audio();
  let currentIndex = 0;
  let isPlaying    = false;

  const playerBar   = document.querySelector('.player-bar');
  const playBtn     = document.querySelector('.player-btn.play-pause');
  const prevBtn     = document.querySelector('.player-btn.prev');
  const nextBtn     = document.querySelector('.player-btn.next');
  const progFill    = document.querySelector('.player-progress-fill');
  const progBar     = document.querySelector('.player-progress');
  const timeCurrent = document.querySelector('.player-time.current');
  const timeDur     = document.querySelector('.player-time.duration');
  const titleEl     = document.querySelector('.player-track-title');
  const volInput    = document.querySelector('.player-volume input[type="range"]');
  const items       = Array.from(document.querySelectorAll('.track-item'));

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  function svgPlay() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
  }
  function svgPause() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  }
  function svgPrev() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="19,20 9,12 19,4"/><rect x="5" y="4" width="3" height="16"/></svg>';
  }
  function svgNext() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,4 15,12 5,20"/><rect x="16" y="4" width="3" height="16"/></svg>';
  }

  function setActive(index) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
      item.querySelector('.track-num').textContent =
        i === index ? '▶' : String(i + 1).padStart(2, '0');
    });
  }

  function loadTrack(index) {
    currentIndex = index;
    audio.src    = tracks[index].src;
    titleEl.textContent = tracks[index].title;
    setActive(index);
    playerBar.classList.add('visible');
  }

  function play() {
    audio.play().catch(() => {});
    isPlaying = true;
    playBtn.innerHTML = svgPause();
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = svgPlay();
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (i === currentIndex && isPlaying) { pause(); return; }
      loadTrack(i);
      play();
    });
  });

  playBtn.addEventListener('click', () => { isPlaying ? pause() : play(); });

  prevBtn.addEventListener('click', () => {
    loadTrack((currentIndex - 1 + tracks.length) % tracks.length);
    play();
  });

  nextBtn.addEventListener('click', () => {
    loadTrack((currentIndex + 1) % tracks.length);
    play();
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progFill.style.width        = pct + '%';
    timeCurrent.textContent     = fmt(audio.currentTime);
    timeDur.textContent         = fmt(audio.duration);
  });

  progBar.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const r = progBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

  audio.addEventListener('ended', () => {
    loadTrack((currentIndex + 1) % tracks.length);
    play();
  });

  if (volInput) {
    audio.volume   = 0.8;
    volInput.value = 80;
    volInput.addEventListener('input', () => { audio.volume = volInput.value / 100; });
  }

  playBtn.innerHTML = svgPlay();
  prevBtn.innerHTML = svgPrev();
  nextBtn.innerHTML = svgNext();
})();
