/* ============================================================
   ADRIANO SILVA — interactions
   ============================================================ */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---- Scroll reveals ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ---- Warmth wash on scroll (dark → light) ---- */
  let warmthRaf = null;
  function updateWarmth() {
    warmthRaf = null;
    const h = document.documentElement;
    const max = h.scrollHeight - window.innerHeight;
    const pct = Math.min(1, Math.max(0, window.scrollY / max));
    // bias the curve: stay dark longer, then warm faster
    const eased = Math.pow(pct, 1.35);
    document.documentElement.style.setProperty('--warmth', eased.toFixed(3));
  }
  window.addEventListener('scroll', () => {
    if (!warmthRaf) warmthRaf = requestAnimationFrame(updateWarmth);
  }, { passive: true });
  updateWarmth();

  /* ---- Hero cursor spotlight ---- */
  const hero = $('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mx', mx + '%');
      hero.style.setProperty('--my', my + '%');
    });
  }

  /* ---- Animated counters ---- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.floor(target * eased);
      el.textContent = formatNum(v) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = formatNum(target) + suffix;
    }
    requestAnimationFrame(frame);
  }
  function formatNum(n) {
    if (n >= 1000) return n.toLocaleString('pt-BR');
    return String(n);
  }
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  $$('[data-count]').forEach((el) => counterIO.observe(el));

  /* ---- Before / After slider ---- */
  const baFrame = $('.ba-frame');
  const baDivider = $('[data-slider]');
  if (baFrame && baDivider) {
    let dragging = false;

    function setSplit(clientX) {
      const rect = baFrame.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(8, Math.min(92, pct));
      baFrame.style.setProperty('--split', pct + '%');
    }

    function start(e) { dragging = true; baFrame.style.transition = 'none'; e.preventDefault?.(); }
    function move(e) {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setSplit(x);
    }
    function end() { dragging = false; }

    baDivider.addEventListener('mousedown', start);
    baDivider.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);

    // Auto-demo on first reveal
    const baIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          baFrame.style.setProperty('--split', '50%');
          baFrame.animate(
            [
              { '--split': '50%' },
              { '--split': '20%' },
              { '--split': '80%' },
              { '--split': '50%' },
            ],
            { duration: 3200, fill: 'forwards', easing: 'cubic-bezier(.5,0,.2,1)' }
          );
          baIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    baIO.observe(baFrame);
  }

  /* ============================================================
     TWEAKS PANEL — Edit mode protocol
     ============================================================ */
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "orange",
    "headline": "presenca",
    "density": "comfortable",
    "anim": "medium"
  }/*EDITMODE-END*/;

  const HEADLINES = {
    presenca: `Equipes<br>não mudam<br>com <span class="hero-dim">mais reunião.</span><br>Mudam com<br><em>presença,</em> <em>conteúdo</em><br>e <em>música.</em>`,
    transforma: `Transforme equipes<br>com conteúdo,<br>criatividade e <em>música.</em>`,
    palco: `Quando a <em>música</em> entra,<br>a <em>mensagem</em> permanece.<br>Quando o palco acaba,<br>o <em>movimento</em> começa.`
  };

  const state = { ...TWEAK_DEFAULTS };

  function applyState() {
    document.body.dataset.accent = state.accent;
    document.body.dataset.density = state.density;
    document.body.dataset.anim = state.anim;
    const titleEl = $('[data-headline-target]');
    if (titleEl && HEADLINES[state.headline]) {
      titleEl.innerHTML = HEADLINES[state.headline];
    }
    // sync active states in panel
    $$('.tweaks-row button').forEach((b) => {
      const g = b.dataset.group;
      if (g && state[g] !== undefined) {
        b.classList.toggle('active', b.dataset.value === state[g]);
      }
    });
  }

  function setTweak(key, val) {
    state[key] = val;
    applyState();
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
    } catch (e) {}
  }

  // Build the panel
  function buildPanel() {
    if ($('.tweaks-panel')) return;
    const panel = document.createElement('aside');
    panel.className = 'tweaks-panel';
    panel.innerHTML = `
      <header>
        <h3>Tweaks</h3>
        <button class="close" type="button" aria-label="Fechar">✕</button>
      </header>

      <div class="tweaks-group">
        <label>Cor de acento</label>
        <div class="tweaks-row">
          <button type="button" data-group="accent" data-value="orange"><span class="swatch" style="background:#F66301"></span>laranja</button>
          <button type="button" data-group="accent" data-value="brick"><span class="swatch" style="background:#C94001"></span>tijolo</button>
          <button type="button" data-group="accent" data-value="amber"><span class="swatch" style="background:#E8A227"></span>âmbar</button>
          <button type="button" data-group="accent" data-value="crimson"><span class="swatch" style="background:#D43F3F"></span>carmim</button>
        </div>
      </div>

      <div class="tweaks-group">
        <label>Headline</label>
        <div class="tweaks-row">
          <button type="button" data-group="headline" data-value="presenca">presença</button>
          <button type="button" data-group="headline" data-value="transforma">transforma</button>
          <button type="button" data-group="headline" data-value="palco">palco</button>
        </div>
      </div>

      <div class="tweaks-group">
        <label>Densidade</label>
        <div class="tweaks-row">
          <button type="button" data-group="density" data-value="cozy">compacta</button>
          <button type="button" data-group="density" data-value="comfortable">confortável</button>
          <button type="button" data-group="density" data-value="spacious">arejada</button>
        </div>
      </div>

      <div class="tweaks-group">
        <label>Animações</label>
        <div class="tweaks-row">
          <button type="button" data-group="anim" data-value="low">sutil</button>
          <button type="button" data-group="anim" data-value="medium">média</button>
          <button type="button" data-group="anim" data-value="high">forte</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('.close').addEventListener('click', () => {
      panel.classList.remove('on');
      try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch(e) {}
    });
    panel.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-group]');
      if (!btn) return;
      setTweak(btn.dataset.group, btn.dataset.value);
    });
  }

  // Edit mode listener
  window.addEventListener('message', (e) => {
    const msg = e.data || {};
    if (msg.type === '__activate_edit_mode') {
      buildPanel();
      $('.tweaks-panel').classList.add('on');
    } else if (msg.type === '__deactivate_edit_mode') {
      $('.tweaks-panel')?.classList.remove('on');
    }
  });

  // Announce availability after listener is registered
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (e) {}

  // Apply initial state
  applyState();

})();
