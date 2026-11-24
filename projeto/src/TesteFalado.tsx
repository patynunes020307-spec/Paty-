import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS } from "./fontes";

// Teste do fluxo "vídeo falado" (ficha-paty-celular.md) com IMG_4362.
// Bruto: public/brutos/teste-4362/IMG_4362.mp4 (cópia H.264 1080x1920 do original).
// Silêncio cortado (fala real: 1,44–3,66 s e 4,16–6,87 s) e tudo a 1,2x.
// Voz: playbackRate do Remotion subia o tom (~14%); o áudio vem acelerado no ffmpeg (atempo, mantém o tom).
const BRUTO = "brutos/teste-4362/IMG_4362.mp4";
const VELOCIDADE = 1.2;
export const TESTE_FALADO_DURACAO = 130; // 59 + 71 quadros

// Legenda: 2–3 palavras por vez, quadro de entrada já no tempo final (1,2x).
const PAGINAS: { texto: string; de: number }[] = [
  { texto: "nele, você", de: 0 },
  { texto: "acompanha o que", de: 23 },
  { texto: "já foi feito,", de: 40 },
  { texto: "o que está", de: 59 },
  { texto: "pendente e", de: 75 },
  { texto: "o que ainda", de: 89 },
  { texto: "precisa da", de: 106 },
  { texto: "sua atenção.", de: 113 },
];

// Lista acima da cabeça: cada item aparece na palavra falada.
const ITENS: { texto: string; de: number; feito: boolean }[] = [
  { texto: "já foi feito", de: 51, feito: true },
  { texto: "pendente", de: 75, feito: false },
  { texto: "precisa da sua atenção", de: 117, feito: false },
];
const LISTA_ENTRA = 51;

const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const atual = [...PAGINAS].reverse().find((p) => frame >= p.de);
  if (!atual) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 1230, // altura do peito, sempre no mesmo lugar
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 62,
          color: "#FFFFFF",
          textTransform: "lowercase",
          textShadow: "0 2px 10px rgba(0,0,0,0.55)",
        }}
      >
        {atual.texto}
      </div>
    </AbsoluteFill>
  );
};

const Check: React.FC<{ feito: boolean }> = ({ feito }) => (
  <svg width="34" height="34" viewBox="0 0 34 34">
    <rect x="2" y="2" width="30" height="30" rx="7" fill={feito ? "#111" : "none"} stroke="#111" strokeWidth="3" />
    {feito ? (
      <path d="M9 17.5 L15 23 L25 11" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    ) : null}
  </svg>
);

const Lista: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // "Pulo" único de 0,3 s: 0 → 1,08 → 1 (não repete, não pulsa)
  const escala = interpolate(frame, [0, 0.2 * fps, 0.3 * fps], [0, 1.08, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 70,
          scale: escala,
          background: "#FFFFFF",
          borderRadius: 22,
          padding: "22px 34px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        }}
      >
        {ITENS.filter((item) => frame + LISTA_ENTRA >= item.de).map((item) => (
          <div
            key={item.texto}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 38,
              color: "#111",
            }}
          >
            <Check feito={item.feito} />
            {item.texto}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const TesteFalado: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence name="Frase 1" durationInFrames={59} premountFor={fps}>
        <Video
          src={staticFile(BRUTO)}
          trimBefore={41}
          trimAfter={112}
          playbackRate={VELOCIDADE}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
        <Audio src={staticFile("brutos/teste-4362/frase1-1.2x.wav")} />
      </Sequence>
      {/* Frase forte: aproximação seca de 14% no corte, centrada no rosto */}
      <Sequence name="Frase 2" from={59} durationInFrames={71} premountFor={fps}>
        <AbsoluteFill style={{ scale: 1.14, transformOrigin: "50% 30%" }}>
          <Video
            src={staticFile(BRUTO)}
            trimBefore={124}
            trimAfter={209}
            playbackRate={VELOCIDADE}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </AbsoluteFill>
        <Audio src={staticFile("brutos/teste-4362/frase2-1.2x.wav")} />
      </Sequence>
      <Sequence name="Lista" from={LISTA_ENTRA} premountFor={fps}>
        <Lista />
        <Audio src={staticFile("sfx/pop.wav")} volume={0.5} />
      </Sequence>
      <Legenda />
    </AbsoluteFill>
  );
};
