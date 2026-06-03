/* ============================================================
   ADRIANO SILVA — Área do Participante
   Lógica: validação, certificado, PDF, localStorage
   ============================================================ */

(function () {
  'use strict';

  /* ── Elementos ───────────────────────────────────────────── */
  const formSection    = document.getElementById('form-section');
  const successSection = document.getElementById('success-section');
  const form           = document.getElementById('part-form');
  const inputNome      = document.getElementById('nome');
  const inputEmail     = document.getElementById('email');
  const inputKeyword   = document.getElementById('keyword');
  const submitBtn      = document.getElementById('submit-btn');
  const formError      = document.getElementById('form-error');
  const formErrorMsg   = document.getElementById('form-error-msg');
  const returnNotice   = document.getElementById('return-notice');
  const returnName     = document.getElementById('return-name');

  const certContainer  = document.getElementById('cert-svg-container');
  const welcomeName    = document.getElementById('welcome-name');
  const eventName      = document.getElementById('event-name');
  const btnDownload    = document.getElementById('btn-download');
  const btnPrint       = document.getElementById('btn-print');
  const btnNewReg      = document.getElementById('btn-new-reg');
  const materialsGrid  = document.getElementById('materials-grid');

  /* ── Estado ──────────────────────────────────────────────── */
  let svgTemplate = null;       // SVG carregado do arquivo
  let currentData = null;       // { nome, email, keyword, evento }

  /* ── Inicialização ───────────────────────────────────────── */
  init();

  function init() {
    loadSVGTemplate();
    setupEmailAutoFill();
    form.addEventListener('submit', handleSubmit);
    btnDownload && btnDownload.addEventListener('click', downloadPDF);
    btnPrint    && btnPrint.addEventListener('click', printCertificate);
    btnNewReg   && btnNewReg.addEventListener('click', resetToForm);
  }

  /* ── Carregar template SVG ───────────────────────────────── */
  function loadSVGTemplate() {
    fetch('assets/certificado-adriano.svg')
      .then(function (r) {
        if (!r.ok) throw new Error('SVG não encontrado');
        return r.text();
      })
      .then(function (text) {
        svgTemplate = text;
      })
      .catch(function () {
        console.warn('Certificado SVG não pôde ser carregado via fetch. Verifique se a página está sendo servida por um servidor HTTP.');
      });
  }

  /* ── Auto-preenchimento por localStorage ─────────────────── */
  function setupEmailAutoFill() {
    inputEmail.addEventListener('blur', function () {
      var email = normalizeEmail(inputEmail.value);
      if (!email) return;
      var stored = getStoredName(email);
      if (stored) {
        inputNome.value = stored;
        returnName.textContent = stored;
        returnNotice.classList.add('visible');
      } else {
        returnNotice.classList.remove('visible');
      }
    });

    inputEmail.addEventListener('input', function () {
      returnNotice.classList.remove('visible');
    });
  }

  /* ── Submit ──────────────────────────────────────────────── */
  function handleSubmit(e) {
    e.preventDefault();
    clearError();

    var nome    = (inputNome.value || '').trim();
    var email   = normalizeEmail(inputEmail.value);
    var keyword = normalizeKeyword(inputKeyword.value);

    /* Validações básicas */
    if (!nome) { showError('Por favor, informe seu nome completo.'); inputNome.focus(); return; }
    if (!email || !isValidEmail(email)) { showError('Informe um e-mail válido.'); inputEmail.focus(); return; }
    if (!keyword) { showError('Informe a palavra-chave informada pelo Adriano.'); inputKeyword.focus(); return; }

    /* Validar palavra-chave */
    var evento = lookupEvento(keyword);
    if (!evento) {
      showError('Palavra-chave não encontrada. Verifique a palavra informada por Adriano ao final da palestra.');
      inputKeyword.classList.add('error');
      inputKeyword.focus();
      return;
    }

    /* Tudo certo — salvar e exibir */
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(function () {
      storeName(email, nome);
      currentData = { nome: nome, email: email, keyword: keyword, evento: evento };
      showSuccess();
    }, 600); // pequeno delay para UX
  }

  /* ── Lookup de evento ────────────────────────────────────── */
  function lookupEvento(keyword) {
    if (typeof ADRIANO_EVENTOS === 'undefined') return null;
    /* case-insensitive */
    var keys = Object.keys(ADRIANO_EVENTOS);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toUpperCase() === keyword) {
        return ADRIANO_EVENTOS[keys[i]];
      }
    }
    return null;
  }

  /* ── Exibir seção de sucesso ─────────────────────────────── */
  function showSuccess() {
    var d = currentData;

    formSection.style.display    = 'none';
    successSection.classList.add('visible');

    welcomeName.textContent = d.nome.split(' ')[0]; // primeiro nome
    eventName.textContent   = d.evento.tema;

    renderCertificate(d.nome, d.evento);
    renderMaterials(d.evento.materiais);

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Renderizar certificado ──────────────────────────────── */
  function renderCertificate(nome, evento) {
    if (!svgTemplate) {
      certContainer.innerHTML = '<p style="color:var(--white-mute);padding:24px;text-align:center;font-size:14px;">Certificado disponível para download.</p>';
      return;
    }

    var filled = svgTemplate
      .replace('[NOME DO PARTICIPANTE]', escapeXML(nome))
      .replace('[NOME DA PALESTRA]',     escapeXML(evento.tema))
      .replace('[CARGA_HORARIA]',        escapeXML(evento.cargaHoraria))
      .replace('[DATA]',                 escapeXML(evento.data));

    certContainer.innerHTML = filled;
  }

  /* ── Download PDF (janela de impressão) ──────────────────── */
  function downloadPDF() {
    openPrintWindow(true);
  }

  function printCertificate() {
    openPrintWindow(false);
  }

  function openPrintWindow(autoDownload) {
    if (!svgTemplate || !currentData) return;

    var d = currentData;

    var filled = svgTemplate
      .replace('[NOME DO PARTICIPANTE]', escapeXML(d.nome))
      .replace('[NOME DA PALESTRA]',     escapeXML(d.evento.tema))
      .replace('[CARGA_HORARIA]',        escapeXML(d.evento.cargaHoraria))
      .replace('[DATA]',                 escapeXML(d.evento.data));

    var html = [
      '<!DOCTYPE html>',
      '<html lang="pt-BR">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <title>Certificado — ' + d.evento.tema + ' — ' + d.nome + '</title>',
      '  <link rel="preconnect" href="https://fonts.googleapis.com">',
      '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap">',
      '  <style>',
      '    * { margin: 0; padding: 0; box-sizing: border-box; }',
      '    html, body { width: 100%; height: 100%; background: #fff; }',
      '    .cert-wrap { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; }',
      '    .cert-wrap svg { width: 100%; height: 100%; }',
      '    @page { size: A4 landscape; margin: 0; }',
      '    @media print {',
      '      html, body { width: 297mm; height: 210mm; }',
      '      .cert-wrap { width: 297mm; height: 210mm; }',
      '    }',
      '  </style>',
      '</head>',
      '<body>',
      '  <div class="cert-wrap">',
      filled,
      '  </div>',
      '  <script>',
      '    window.onload = function() {',
      '      setTimeout(function() { window.print(); }, 800);',
      '    };',
      '  <\/script>',
      '</body>',
      '</html>'
    ].join('\n');

    var win = window.open('', '_blank', 'width=1200,height=850');
    if (!win) {
      alert('Por favor, permita pop-ups para este site para baixar o certificado.');
      return;
    }
    win.document.write(html);
    win.document.close();
  }

  /* ── Renderizar materiais ────────────────────────────────── */
  function renderMaterials(materiais) {
    if (!materiais || materiais.length === 0) {
      materialsGrid.innerHTML = '<p class="materials-empty">Nenhum material disponível para esta palestra no momento.</p>';
      return;
    }

    var html = materiais.map(function (m) {
      var href = m.url && m.url !== '#' ? m.url : null;
      var tag  = href ? 'a' : 'div';
      var extra = href ? 'href="' + m.url + '" target="_blank" rel="noreferrer" download' : '';

      return '<' + tag + ' class="material-card" ' + extra + '>' +
        '<div class="material-icon">' + getFileIcon(m.tipo) + '</div>' +
        '<div class="material-info">' +
          '<p class="material-title">' + escapeHTML(m.titulo) + '</p>' +
          '<p class="material-desc">'  + escapeHTML(m.descricao) + '</p>' +
          '<span class="material-badge">' + escapeHTML(m.tipo || 'DOC') + '</span>' +
        '</div>' +
      '</' + tag + '>';
    }).join('');

    materialsGrid.innerHTML = html;
  }

  function getFileIcon(tipo) {
    var icons = {
      'PDF':  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
      'XLSX': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/><line x1="15" y1="9" x2="15" y2="21"/></svg>',
      'PPTX': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'MP4':  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
      'ZIP':  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V3h13z"/><polyline points="17 3 17 8 21 8"/><line x1="10" y1="12" x2="14" y2="12"/></svg>'
    };
    return icons[tipo] || icons['PDF'];
  }

  /* ── Resetar para o formulário ───────────────────────────── */
  function resetToForm() {
    successSection.classList.remove('visible');
    formSection.style.display = '';
    certContainer.innerHTML   = '';
    materialsGrid.innerHTML   = '';
    currentData = null;
    form.reset();
    clearError();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function showError(msg) {
    formErrorMsg.textContent = msg;
    formError.classList.add('visible');
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }

  function clearError() {
    formError.classList.remove('visible');
    inputKeyword.classList.remove('error');
  }

  function normalizeEmail(val) {
    return (val || '').trim().toLowerCase();
  }

  function normalizeKeyword(val) {
    return (val || '').trim().toUpperCase();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function escapeXML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function escapeHTML(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str)));
    return d.innerHTML;
  }

  /* ── localStorage ────────────────────────────────────────── */
  function storeName(email, nome) {
    try {
      localStorage.setItem('as_nome_' + email, nome);
    } catch (e) {}
  }

  function getStoredName(email) {
    try {
      return localStorage.getItem('as_nome_' + email) || null;
    } catch (e) { return null; }
  }

}());
