import type { MotionProps } from "./MotionReel";

// Modelo editável — mesmos motions aprovados do MotionReel
// (texto digitado no gancho → blocos de frase numerados → tela final com ação).
// Para usar: troque cada "[SEU TEXTO]" abaixo (ou no painel de props do Remotion Studio)
// e, se quiser outro vídeo, troque `arquivo` e os tempos de `cenas`.
// Cenas: originais 4K do Drive › Banco de imagens (IMG_9461/9462/9463.MOV, brinde dos noivos),
// cópias de trabalho 1080×1920 em public/brutos/template/.
const T = "[SEU TEXTO]";
const B = "brutos/template/";

export const TEMPLATE_SEU_TEXTO: MotionProps = {
  cenas: [
    { arquivo: B + "IMG_9463.mp4", inicio: 0, fim: 4.0 }, // noivos posando com as taças
    { arquivo: B + "IMG_9462.mp4", inicio: 0, fim: 3.8 }, // beijo
    { arquivo: B + "IMG_9461.mp4", inicio: 0, fim: 2.7 }, // brinde
    { arquivo: B + "IMG_9463.mp4", inicio: 13.0, fim: 17.4 }, // olhando um para o outro
  ],
  // 1) gancho digitado letra a letra
  gancho: { kicker: T, linha: T, italico: T, ate: 3.8 },
  // 2) blocos de frase com fio + numeração, um por vez, com fade
  textos: [
    { frase: { kicker: "01", linha: T, italico: T }, de: 4.0, ate: 10.3 },
    { frase: { kicker: "02", linha: T, italico: T }, de: 10.7, ate: 14.7 },
  ],
  // 3) tela final petróleo com fio desenhado sob a ação
  cta: { linha: T, italico: T, acao: T, segundos: 3.5 },
};

// Reel "Brinde" — textos do modelo preenchidos (Guia de Publicações, 20/11/2026).
// Objetivo: Descoberta. Cenas iguais ao modelo; beijo em P&B (regra de emoção do Guia).
export const BRINDE: MotionProps = {
  ...TEMPLATE_SEU_TEXTO,
  cenas: TEMPLATE_SEU_TEXTO.cenas.map((c, i) =>
    i === 1 ? { ...c, pretoEBranco: true } : c,
  ),
  gancho: {
    kicker: "Casamento real",
    linha: "O brinde dura um minuto.",
    italico: "A foto, a vida inteira.",
    ate: 3.8,
  },
  textos: [
    {
      frase: {
        kicker: "01",
        linha: "Taças servidas",
        italico: "antes de chamar os noivos.",
      },
      de: 4.0,
      ate: 10.3,
    },
    {
      frase: {
        kicker: "02",
        linha: "Fotógrafo avisado,",
        italico: "convidados de frente.",
      },
      de: 10.7,
      ate: 14.7,
    },
  ],
  cta: {
    linha: "Cada minuto da festa,",
    italico: "pensado antes.",
    acao: "Manda para quem vai casar com você.",
    segundos: 3.5,
  },
};
