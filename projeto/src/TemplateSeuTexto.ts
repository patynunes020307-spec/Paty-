import type { MotionProps } from "./MotionReel";

// Modelo editável — mesmos motions aprovados do MotionReel
// (texto digitado no gancho → bloco de frase → tela final com ação).
// Para usar: troque cada "[SEU TEXTO]" abaixo (ou no painel de props do Remotion Studio)
// e, se quiser outro vídeo, troque `arquivo` e os tempos de `cenas`.
// Vídeo de base: Drive › Banco de imagens › copy_DC1A82DC-….MP4 (720×1280, corte em 2,8 s).
const T = "[SEU TEXTO]";

export const TEMPLATE_SEU_TEXTO: MotionProps = {
  cenas: [
    { arquivo: "brutos/template/clip.mp4", inicio: 0, fim: 2.8 },
    { arquivo: "brutos/template/clip.mp4", inicio: 2.8, fim: 6.7 },
  ],
  // 1) gancho digitado letra a letra (até 3,0 s)
  gancho: { kicker: T, linha: T, italico: T, ate: 3.0 },
  // 2) bloco de frase com fio + etiqueta, entra e sai com fade
  textos: [{ frase: { kicker: "01", linha: T, italico: T }, de: 3.2, ate: 6.6 }],
  // 3) tela final petróleo com fio desenhado sob a ação
  cta: { linha: T, italico: T, acao: T, segundos: 3.5 },
};
