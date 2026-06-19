/**
 * ÁREA DO PARTICIPANTE — Configuração de Eventos
 * Adriano Silva · palestras, treinamentos e experiências corporativas
 *
 * ─────────────────────────────────────────────────────────────────
 * COMO ADICIONAR UM NOVO EVENTO
 * ─────────────────────────────────────────────────────────────────
 * 1. Copie um dos blocos de modelo abaixo (estão comentados).
 *
 * 2. Defina a PALAVRA-CHAVE no formato:  TEMA_EMPRESA_MES00
 *    Exemplos:
 *      "INFLUENCIA_SENAC_JUN26"
 *      "ACOLHIMENTO_UNIMED_AGO26"
 *      "PRESENCA_FIEP_OUT26"
 *
 * 3. Preencha os campos:
 *      tema          → Nome do tema (aparece no certificado)
 *      empresa       → Nome da empresa/instituição contratante
 *      data          → Mês e ano por extenso (ex: "Junho de 2026")
 *      cargaHoraria  → Duração (padrão: "8 horas")
 *      materiais     → Lista de materiais (veja formato abaixo)
 *
 * 4. Para cada material via Google Drive:
 *      a. No Drive, clique com botão direito no arquivo
 *      b. "Compartilhar" → "Qualquer pessoa com o link" → Copiar link
 *      c. Cole no campo "url"
 *
 * 5. Fale a palavra-chave no encerramento da palestra — o participante
 *    digita e acessa o certificado + materiais.
 *
 * A busca ignora maiúsculas/minúsculas.
 * ─────────────────────────────────────────────────────────────────
 */

const ADRIANO_EVENTOS = {

  // ═══════════════════════════════════════════════════════════════
  // LIDERANÇA E GESTÃO DE EQUIPES  ·  palavra-chave base: INFLUENCIA
  // ═══════════════════════════════════════════════════════════════
  // "INFLUENCIA_EMPRESA_MES26": {
  //   tema: "Liderança e Gestão de Equipes",
  //   empresa: "Nome da Empresa",
  //   data: "Mês de 2026",
  //   cargaHoraria: "8 horas",
  //   materiais: [
  //     {
  //       titulo: "Slides da Palestra",
  //       descricao: "Apresentação completa utilizada durante o evento.",
  //       url: "https://drive.google.com/...",
  //       tipo: "PDF"
  //     }
  //   ]
  // },

  // ═══════════════════════════════════════════════════════════════
  // ATENDIMENTO HUMANIZADO  ·  palavra-chave base: ACOLHIMENTO
  // ═══════════════════════════════════════════════════════════════
  // "ACOLHIMENTO_EMPRESA_MES26": {
  //   tema: "Atendimento Humanizado",
  //   empresa: "Nome da Empresa",
  //   data: "Mês de 2026",
  //   cargaHoraria: "8 horas",
  //   materiais: []
  // },

  // ═══════════════════════════════════════════════════════════════
  // COMUNICAÇÃO E ORATÓRIA  ·  palavra-chave base: PRESENCA
  // ═══════════════════════════════════════════════════════════════
  // "PRESENCA_EMPRESA_MES26": {
  //   tema: "Comunicação e Oratória",
  //   empresa: "Nome da Empresa",
  //   data: "Mês de 2026",
  //   cargaHoraria: "8 horas",
  //   materiais: []
  // },

  // ═══════════════════════════════════════════════════════════════
  // MOTIVAÇÃO E PROPÓSITO  ·  palavra-chave base: SENTIDO
  // ═══════════════════════════════════════════════════════════════
  // "SENTIDO_EMPRESA_MES26": {
  //   tema: "Motivação e Propósito",
  //   empresa: "Nome da Empresa",
  //   data: "Mês de 2026",
  //   cargaHoraria: "8 horas",
  //   materiais: []
  // },

  // ═══════════════════════════════════════════════════════════════
  // VENDAS E NEGOCIAÇÃO  ·  palavra-chave base: CONVERSAO
  // ═══════════════════════════════════════════════════════════════
  // "CONVERSAO_EMPRESA_MES26": {
  //   tema: "Vendas e Negociação",
  //   empresa: "Nome da Empresa",
  //   data: "Mês de 2026",
  //   cargaHoraria: "8 horas",
  //   materiais: []
  // },

  // ═══════════════════════════════════════════════════════════════
  // HUMANIZAÇÃO NA SAÚDE  ·  palavra-chave base: EMPATIA
  // ═══════════════════════════════════════════════════════════════
  // "EMPATIA_EMPRESA_MES26": {
  //   tema: "Humanização na Saúde",
  //   empresa: "Nome da Empresa",
  //   data: "Mês de 2026",
  //   cargaHoraria: "8 horas",
  //   materiais: []
  // },


  // ═══════════════════════════════════════════════════════════════
  // EVENTO DE TESTE — use a palavra-chave TESTE para validar o sistema
  // Remova ou comente este bloco após confirmar que tudo funciona
  // ═══════════════════════════════════════════════════════════════
  "TESTE": {
    tema: "Liderança e Gestão de Equipes",
    empresa: "Empresa Exemplo S.A.",
    data: "Junho de 2026",
    cargaHoraria: "8 horas",
    materiais: [
      {
        titulo: "Slides da Palestra",
        descricao: "Apresentação completa utilizada durante o evento.",
        url: "#",
        tipo: "PDF"
      },
      {
        titulo: "E-book: Liderança na Prática",
        descricao: "Material complementar com os principais conceitos abordados.",
        url: "#",
        tipo: "PDF"
      }
    ]
  }

};
