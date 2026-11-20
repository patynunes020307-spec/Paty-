import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BlocoFrase, Frase } from "./CorteFilme";
import { COR } from "./marca";

// Story "Das duas da tarde até a festa" — versão SEM IA (opção B, 20/11/2026):
// fotos reais da sessão da Paty + voz real dela + frases no padrão do Guia.
// Nenhuma imagem gerada/alterada por IA; só recorte e aproximação lenta.

export const STORY_VOZ_FPS = 30;
const FPS = STORY_VOZ_FPS;
const FADE = Math.round(0.3 * FPS); // fade cruzado máx. 0,3 s (Guia 2B)
export const STORY_VOZ_DURACAO = Math.round(35.2 * FPS);

const DEGRADE =
  "linear-gradient(to top, rgba(7,33,38,0.96) 0%, rgba(7,33,38,0.85) 25%, rgba(32,63,81,0) 58%)";

// cenas em segundos (mesmo tempo da fala); enquadramento = recorte fixo, nunca segue rosto
const CENAS: { arquivo: string; inicio: number; fim: number; pos: string }[] = [
  { arquivo: "THI00422.jpeg", inicio: 0, fim: 9.5, pos: "50% 30%" },
  { arquivo: "THI00420.jpeg", inicio: 9.5, fim: 19.0, pos: "55% 30%" },
  { arquivo: "THI00563.jpeg", inicio: 19.0, fim: 29.1, pos: "50% 30%" },
  { arquivo: "THI00558.jpeg", inicio: 29.1, fim: 35.2, pos: "50% 30%" },
];

// frases acompanhando a fala (3–6 s cada, máx. 2 linhas)
const FRASES: { inicio: number; fim: number; frase: Frase }[] = [
  { inicio: 0, fim: 4.6, frase: { kicker: "Bastidores da Impactar", linha: "Das duas da tarde", italico: "até a festa." } },
  { inicio: 4.6, fim: 9.5, frase: { kicker: "Bastidores da Impactar", linha: "Um casamento", italico: "pelos bastidores." } },
  { inicio: 9.5, fim: 13.7, frase: { kicker: "Antes da cerimônia", linha: "Confere o espaço,", italico: "recebe a família." } },
  { inicio: 13.7, fim: 19.0, frase: { kicker: "Antes da cerimônia", linha: "Revisa o roteiro,", italico: "a cauda e o véu." } },
  { inicio: 19.0, fim: 24.6, frase: { kicker: "Depois do sim", linha: "Organiza as fotos com", italico: "quem precisa estar nelas." } },
  { inicio: 24.6, fim: 29.1, frase: { kicker: "Na festa", linha: "Seguimos acompanhando", italico: "cada momento," } },
  { inicio: 29.1, fim: 35.2, frase: { kicker: "Manda a data no direct", linha: "pra vocês só precisarem", italico: "viver o dia." } },
];

const Cena: React.FC<{ arquivo: string; pos: string; duracao: number; ultima: boolean }> = ({
  arquivo,
  pos,
  duracao,
  ultima,
}) => {
  const frame = useCurrentFrame();
  // aproximação lenta e contínua 100% → 105% durante a cena (Guia 2B)
  const escala = interpolate(frame, [0, duracao], [1, 1.05], { extrapolateRight: "clamp" });
  const opacidade = interpolate(frame, [0, FADE], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: ultima ? 1 : opacidade }}>
      <Img
        src={staticFile(`brutos/avatar/${arquivo}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          scale: String(escala),
        }}
      />
    </AbsoluteFill>
  );
};

export const StoryVozPaty: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {CENAS.map((c, i) => {
        const de = Math.round(c.inicio * fps);
        const ate = Math.round(c.fim * fps) + (i < CENAS.length - 1 ? FADE : 0);
        return (
          <Sequence key={c.arquivo} name={c.arquivo} from={de} durationInFrames={ate - de} premountFor={fps}>
            <Cena arquivo={c.arquivo} pos={c.pos} duracao={ate - de} ultima={i === 0} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ background: DEGRADE }} />
      {FRASES.map((f, i) => {
        const de = Math.round(f.inicio * fps);
        const dur = Math.round(f.fim * fps) - de;
        return (
          <Sequence key={i} name={`Frase ${i + 1}`} from={de} durationInFrames={dur} premountFor={fps}>
            <BlocoFrase frase={f.frase} duracao={dur} imediato={i === 0} />
          </Sequence>
        );
      })}
      <Audio src={staticFile("brutos/avatar/voz-paty.m4a")} />
    </AbsoluteFill>
  );
};
