/**
 * ÁREA DO PARTICIPANTE — Configuração de Eventos
 * Adriano Silva · palestras, treinamentos e experiências corporativas
 *
 * ─────────────────────────────────────────────────────────────────
 * COMO ADICIONAR UM NOVO EVENTO
 * ─────────────────────────────────────────────────────────────────
 * 1. Escolha uma PALAVRA-CHAVE (sem espaços, sem acentos é recomendado).
 *    Ex.: "LIDERANCA2025", "ATEND_AGOSTO", "SENAC_GUARAPUAVA"
 *
 * 2. Adicione um bloco novo no objeto ADRIANO_EVENTOS seguindo o padrão.
 *
 * 3. Informe a palavra-chave verbalmente no encerramento da palestra.
 *
 * 4. Para materiais, coloque os arquivos na pasta /assets/materiais/
 *    e atualize o campo "url" com o caminho relativo.
 *    Ex.: url: "assets/materiais/slides-lideranca-positiva.pdf"
 *
 * A busca ignora maiúsculas/minúsculas: "liderança2025" = "LIDERANÇA2025".
 * ─────────────────────────────────────────────────────────────────
 */

const ADRIANO_EVENTOS = {

  // ─── EXEMPLO — substitua pelos seus eventos reais ─────────────────
  "EXEMPLO2025": {
    tema: "Atendimento com Excelência",
    cargaHoraria: "4 horas",
    data: "Junho de 2025",
    materiais: [
      {
        titulo: "Slides da Palestra",
        descricao: "Apresentação completa utilizada durante o evento.",
        url: "#",
        tipo: "PDF"
      },
      {
        titulo: "E-book: A Arte do Atendimento",
        descricao: "Guia prático com os principais conceitos abordados.",
        url: "#",
        tipo: "PDF"
      },
      {
        titulo: "Planilha de Autoavaliação",
        descricao: "Ferramenta para identificar pontos de melhoria no atendimento.",
        url: "#",
        tipo: "XLSX"
      }
    ]
  },
  // ──────────────────────────────────────────────────────────────────

  // ─── Adicione seus eventos abaixo ─────────────────────────────────

  // "MINHAPALAVRACHAVE": {
  //   tema: "Nome completo do tema (aparece no certificado)",
  //   cargaHoraria: "8 horas",
  //   data: "Mês de Ano",
  //   materiais: [
  //     {
  //       titulo: "Nome do material",
  //       descricao: "Breve descrição do conteúdo.",
  //       url: "assets/materiais/nome-do-arquivo.pdf",
  //       tipo: "PDF"   // PDF, XLSX, PPTX, MP4, ZIP...
  //     }
  //   ]
  // },

};
