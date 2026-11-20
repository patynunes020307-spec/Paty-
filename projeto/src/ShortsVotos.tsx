import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIF } from "./fontes";
import { COR } from "./marca";
import { LEGENDAS, type Palavra } from "./shortsVotosLegendas";

// Shorts "votos do casamento" — 3 cortes do filme do videomaker (A, Drive › Banco de imagens › Videos).
// Briefing: briefings/2026-11-20-shorts-votos.md
// Gancho escrito nos 2–3 primeiros segundos (um texto por vez), depois legenda palavra a palavra.

export const FPS = 30;
const GANCHO_S = 2.6;
const FINAL_S = 2.0;

export type ShortVotosProps = {
  corte: 1 | 2 | 3;
  arquivo: string;
  duracaoS: number; // duração do corte em segundos
  etiqueta: string;
  linha: string;
  italico: string;
};

export const SHORTS_VOTOS: ShortVotosProps[] = [
  {
    corte: 1,
    arquivo: "brutos/shorts-votos/corte1.mp4",
    duracaoS: 28.2,
    etiqueta: "Votos da noiva",
    linha: "Pai, eu escolhi",
    italico: "o homem certo.",
  },
  {
    corte: 2,
    arquivo: "brutos/shorts-votos/corte2.mp4",
    duracaoS: 22.1,
    etiqueta: "Votos da noiva",
    linha: "O vestido",
    italico: "na vitrine.",
  },
  {
    corte: 3,
    arquivo: "brutos/shorts-votos/corte3.mp4",
    duracaoS: 28.5,
    etiqueta: "Votos da noiva",
    linha: "Eu prometo escolher",
    italico: "você todos os dias.",
  },
];

export const duracaoShortVotos = (p: ShortVotosProps) =>
  Math.round((p.duracaoS + FINAL_S) * FPS);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Bloco no terço inferior, alinhado à esquerda (linguagem do Reel aprovado).
const Gancho: React.FC<Pick<ShortVotosProps, "linha" | "italico">> = ({
  linha,
  italico,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = interpolate(frame, [0, 0.35 * fps], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const sai = interpolate(
    frame,
    [(GANCHO_S - 0.3) * fps, GANCHO_S * fps],
    [1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 80,
        bottom: 400,
        opacity: entra * sai,
        translate: `0px ${(1 - entra) * 16}px`,
      }}
    >
      <div
        style={{
          color: COR.fundoClaro,
          fontFamily: SERIF,
          fontWeight: 500,
          fontSize: 92,
          lineHeight: 1.04,
          textShadow: "0 2px 24px rgba(7,33,38,0.5)",
        }}
      >
        {linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>{italico}</span>
      </div>
    </div>
  );
};

// Legenda animada: página de até 3 palavras entra com um leve subir (0,15 s, uma vez);
// a palavra dita no momento fica nude.
const Legenda: React.FC<{ paginas: Palavra[][]; inicioMs: number }> = ({
  paginas,
  inicioMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  if (ms < inicioMs) return null;
  const idx = paginas.findIndex((p, i) => {
    const fim =
      i + 1 < paginas.length ? paginas[i + 1][0].s : p[p.length - 1].e + 400;
    return ms >= p[0].s && ms < fim;
  });
  if (idx < 0) return null;
  const pag = paginas[idx];
  const desde = Math.max(pag[0].s, inicioMs);
  const t = interpolate(ms, [desde, desde + 150], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 80,
        bottom: 420,
        opacity: t,
        translate: `0px ${(1 - t) * 14}px`,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 64,
        lineHeight: 1.15,
        color: COR.fundoClaro,
        textShadow: "0 2px 18px rgba(7,33,38,0.55)",
      }}
    >
      {pag.map((w, i) => (
        <span
          key={i}
          style={{ color: ms >= w.s && ms < w.e ? COR.nude : COR.fundoClaro }}
        >
          {w.t}
          {i < pag.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};

// Fechamento: fundo claro, frase + chamada + logo oficial (Reel aprovado de 02/11/2026).
const Fechamento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = interpolate(frame, [0, 0.3 * fps], [0, 1], clamp);
  const b = interpolate(frame, [0.35 * fps, 0.7 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COR.fundoClaro,
        justifyContent: "center",
        alignItems: "center",
        opacity: a,
      }}
    >
      <div
        style={{
          color: COR.petroleo,
          fontFamily: SERIF,
          fontWeight: 500,
          fontSize: 80,
          lineHeight: 1.05,
          textAlign: "center",
        }}
      >
        Cada história merece
        <br />
        <span style={{ fontStyle: "italic", color: COR.azulAuxiliar }}>
          ser bem cuidada.
        </span>
      </div>
      <Img
        src={staticFile("marca/oficial/logo-script-nude-verdeagua.jpg")}
        style={{ width: 460, marginTop: 70, mixBlendMode: "multiply" }}
      />
      <div
        style={{
          opacity: b,
          marginTop: 56,
          color: COR.petroleo,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: 5,
          textTransform: "uppercase",
        }}
      >
        Chame a gente no direct
      </div>
    </AbsoluteFill>
  );
};

export const ShortVotos: React.FC<ShortVotosProps> = (p) => {
  const { fps } = useVideoConfig();
  const durCorte = Math.round(p.duracaoS * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Sequence name="Corte" durationInFrames={durCorte} premountFor={fps}>
        <Video
          name={`Corte ${p.corte}`}
          src={staticFile(p.arquivo)}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
        {/* Degradê petróleo só na base */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(7,33,38,0.88) 0%, rgba(7,33,38,0.55) 28%, rgba(7,33,38,0) 50%)",
          }}
        />
        <Sequence name="Gancho" durationInFrames={Math.round(GANCHO_S * fps)}>
          <Gancho linha={p.linha} italico={p.italico} />
        </Sequence>
        <Legenda paginas={LEGENDAS[p.corte]} inicioMs={GANCHO_S * 1000} />
      </Sequence>
      <Sequence
        name="Fechamento"
        from={durCorte}
        durationInFrames={Math.round(FINAL_S * fps)}
      >
        <Fechamento />
      </Sequence>
    </AbsoluteFill>
  );
};
