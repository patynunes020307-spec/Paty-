import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS as sans, SERIF as serif } from "./fontes";
import { COR } from "./marca";

// Reel "Um casamento pelos bastidores" — casamento de 09/08/2025, equipe Impactar.
// Horários = metadado de gravação de cada vídeo (fato, não estimativa).
// Motion "número subindo" adaptado: o relógio corre do horário anterior ao da cena.
// Narração gravada pela Paty (pendente) + legenda sincronizada.

export const FPS = 30;
const B = "brutos/diario/";

type Cena = {
  arquivo: string;
  inicio: number;
  fim: number;
  hora: number;
  min: number;
};
type Legenda = { texto: string; de: number; ate: number };

export type DiarioProps = {
  cenas: Cena[];
  narracao: string | null; // arquivo em public/, ou null enquanto não gravada
  legendas: Legenda[];
  cta: { linha: string; italico: string; acao: string; segundos: number };
};

const q = (c: Cena) => Math.round((c.fim - c.inicio) * FPS);
export const duracaoDiario = (p: DiarioProps) =>
  p.cenas.reduce((t, c) => t + q(c), 0) + Math.round(p.cta.segundos * FPS);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Relogio: React.FC<{ de: number; ate: number }> = ({ de, ate }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0, 0.5 * fps], [de, ate], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const m = Math.round(t);
  const hh = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  return (
    <div style={{ position: "absolute", bottom: 690, left: 96 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 64, height: 3, backgroundColor: COR.nude }} />
        <div
          style={{
            color: COR.fundoClaro,
            fontFamily: serif,
            fontWeight: 500,
            fontSize: 92,
            textShadow: "0 2px 24px rgba(7,33,38,0.55)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {hh}h
          <span style={{ fontStyle: "italic", color: COR.nude }}>{mm}</span>
        </div>
      </div>
    </div>
  );
};

const Fala: React.FC<{ texto: string; duracao: number }> = ({
  texto,
  duracao,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(
    frame,
    [0, 0.2 * fps, duracao - 0.2 * fps, duracao],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 80,
        bottom: 470,
        opacity: v,
        color: COR.fundoClaro,
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 50,
        lineHeight: 1.3,
      }}
    >
      {texto}
    </div>
  );
};

const TelaCTA: React.FC<{ cta: DiarioProps["cta"] }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = interpolate(frame, [0, 0.5 * fps], [0, 1], clamp);
  const b = interpolate(frame, [0.6 * fps, 1.1 * fps], [0, 1], clamp);
  const fio = interpolate(frame, [1.0 * fps, 1.6 * fps], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COR.petroleo,
        justifyContent: "center",
        padding: "0 96px",
        scale: interpolate(frame, [0, cta.segundos * fps], [0.97, 1], clamp),
      }}
    >
      <div
        style={{
          opacity: a,
          color: COR.areia,
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 96,
          lineHeight: 1.06,
        }}
      >
        {cta.linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {cta.italico}
        </span>
      </div>
      <div
        style={{
          opacity: b,
          marginTop: 60,
          color: COR.areia,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 40,
        }}
      >
        {cta.acao}
      </div>
      <div
        style={{
          marginTop: 18,
          height: 3,
          width: 420 * fio,
          backgroundColor: COR.nude,
        }}
      />
    </AbsoluteFill>
  );
};

export const Diario: React.FC<DiarioProps> = (p) => {
  const { fps } = useVideoConfig();
  const ini = p.cenas.map((_, i) =>
    p.cenas.slice(0, i).reduce((t, c) => t + q(c), 0),
  );
  const durFilme = p.cenas.reduce((t, c) => t + q(c), 0);
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {p.cenas.map((c, i) => {
        const anterior =
          i === 0
            ? c.hora * 60 + c.min
            : p.cenas[i - 1].hora * 60 + p.cenas[i - 1].min;
        return (
          <Sequence
            key={i}
            from={ini[i]}
            durationInFrames={q(c)}
            premountFor={fps}
          >
            <Video
              src={staticFile(c.arquivo)}
              trimBefore={Math.round(c.inicio * fps)}
              muted
              objectFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(to top, rgba(7,33,38,0.95) 0%, rgba(7,33,38,0.82) 30%, rgba(32,63,81,0) 62%)",
              }}
            />
            <Relogio de={anterior} ate={c.hora * 60 + c.min} />
          </Sequence>
        );
      })}
      {p.legendas.map((l, i) => (
        <Sequence
          key={i}
          from={Math.round(l.de * fps)}
          durationInFrames={Math.round((l.ate - l.de) * fps)}
        >
          <Fala texto={l.texto} duracao={Math.round((l.ate - l.de) * fps)} />
        </Sequence>
      ))}
      <Sequence
        from={durFilme}
        durationInFrames={Math.round(p.cta.segundos * fps)}
        premountFor={fps}
      >
        <TelaCTA cta={p.cta} />
      </Sequence>
      {p.narracao ? <Audio src={staticFile(p.narracao)} /> : null}
    </AbsoluteFill>
  );
};

export const DIARIO: DiarioProps = {
  cenas: [
    { arquivo: B + "7884.mp4", inicio: 2.0, fim: 6.0, hora: 14, min: 18 },
    { arquivo: B + "7919.mp4", inicio: 0, fim: 2.5, hora: 15, min: 2 },
    { arquivo: B + "7925.mp4", inicio: 0.5, fim: 3.0, hora: 15, min: 9 },
    { arquivo: B + "8027.mp4", inicio: 0, fim: 2.0, hora: 16, min: 46 },
    { arquivo: B + "8035.mp4", inicio: 5.0, fim: 7.0, hora: 16, min: 53 },
    { arquivo: B + "8054.mp4", inicio: 0, fim: 2.0, hora: 17, min: 9 },
    { arquivo: B + "8103.mp4", inicio: 1.5, fim: 4.0, hora: 18, min: 15 },
    { arquivo: B + "8105.mp4", inicio: 1.0, fim: 3.5, hora: 18, min: 17 },
    { arquivo: B + "8146.mp4", inicio: 3.8, fim: 6.3, hora: 19, min: 5 },
    { arquivo: B + "8219.mp4", inicio: 1.5, fim: 4.0, hora: 19, min: 33 },
  ],
  narracao: null,
  // provisórias = roteiro enviado; serão sincronizadas com a narração gravada
  legendas: [
    {
      texto: "Das duas da tarde até a festa: um casamento pelos bastidores.",
      de: 0.2,
      ate: 4.0,
    },
    {
      texto: "Antes da cerimônia, a gente confere o espaço e recebe a família.",
      de: 4.0,
      ate: 9.0,
    },
    {
      texto:
        "Revisa o roteiro com o noivo, arruma a cauda do vestido, ajusta o véu.",
      de: 9.0,
      ate: 15.0,
    },
    {
      texto: "Depois do sim, organiza as fotos com quem precisa estar nelas.",
      de: 15.0,
      ate: 20.0,
    },
    {
      texto: "E na festa, segue acompanhando cada momento.",
      de: 20.0,
      ate: 25.0,
    },
  ],
  cta: {
    linha: "Pra que vocês só",
    italico: "precisem viver o dia.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 4.0,
  },
};
