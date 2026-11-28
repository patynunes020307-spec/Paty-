import { Audio, Video } from "@remotion/media";
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
import { COR } from "./marca";
import { SANS } from "./fontes";
import { LEGENDA_CORTEJO } from "./legendas/cortejo";

// Reels falados da Paty (instruções v2 de 28/11/2026 + Guia do Notion de 26/11/2026).
// - Voz real e contínua da Paty, sem acelerar e sem trocar palavras.
// - Gancho grande nos 2 primeiros segundos (subida suave), legenda falada >= 52 px.
// - Imagens de apoio por cima da fala, trocando a cada 2–4 s, aproximação lenta 100→105 %.
// - Sem logo no fim (Guia: logo só na capa). Sem SFX (a Paty coloca a música no app).

export const FPS = 30;

type Apoio = {
  /** Intervalo na linha do tempo da fala (s, no arquivo-fonte da fala). */
  de: number;
  ate: number;
  arquivo: string;
  /** Ponto de entrada no arquivo de apoio (s). */
  inicio: number;
  enquadramento?: string;
};

export type FalaPatyProps = {
  fala: string;
  /** Trecho usado da fala (s). */
  ini: number;
  fim: number;
  gancho: string[];
  legenda: readonly { texto: string; ini: number; fim: number }[];
  apoios: Apoio[];
};

export const duracaoFala = (p: FalaPatyProps) => Math.round((p.fim - p.ini) * FPS);

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const Aproximacao: React.FC<{ dur: number; ate: number; children: React.ReactNode }> = ({
  dur,
  ate,
  children,
}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1, ate], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

const Gancho: React.FC<{ linhas: string[] }> = ({ linhas }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = interpolate(f, [4, 4 + 0.45 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const sai = interpolate(f, [3.0 * fps, 3.3 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 1010,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 76,
        lineHeight: 1.12,
        letterSpacing: -0.5,
        color: "#FFFFFF",
        opacity: entra * sai,
        transform: `translateY(${(1 - entra) * 28}px)`,
        textShadow: "0 3px 18px rgba(7,33,38,0.55)",
      }}
    >
      {linhas.map((l, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>{l}</div>
      ))}
    </div>
  );
};

const Legenda: React.FC<{ texto: string }> = ({ texto }) => (
  <div
    style={{
      position: "absolute",
      top: 1360,
      left: 110,
      right: 110,
      textAlign: "center",
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 58,
      lineHeight: 1.18,
      color: "#FFFFFF",
      textShadow: "0 2px 12px rgba(7,33,38,0.7)",
    }}
  >
    {texto}
  </div>
);

export const FalaPaty: React.FC<FalaPatyProps> = (p) => {
  const total = duracaoFala(p);
  const q = (s: number) => Math.round((s - p.ini) * FPS);

  // Trechos em que a Paty aparece (entre as imagens de apoio), para a aproximação lenta.
  const apoios = [...p.apoios].sort((a, b) => a.de - b.de);
  const blocosPaty: { de: number; ate: number }[] = [];
  let cursor = p.ini;
  for (const a of apoios) {
    if (a.de > cursor) blocosPaty.push({ de: cursor, ate: a.de });
    cursor = a.ate;
  }
  if (cursor < p.fim) blocosPaty.push({ de: cursor, ate: p.fim });

  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {/* Paty falando (imagem muda; o som vem do <Audio> contínuo) */}
      {blocosPaty.map((b, i) => (
        <Sequence key={`p${i}`} from={q(b.de)} durationInFrames={q(b.ate) - q(b.de)} premountFor={FPS}>
          <Aproximacao dur={q(b.ate) - q(b.de)} ate={1.04}>
            <Video
              src={staticFile(p.fala)}
              trimBefore={Math.round(b.de * FPS)}
              muted
              objectFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </Aproximacao>
        </Sequence>
      ))}

      {/* Imagens de apoio por cima da fala */}
      {apoios.map((a, i) => (
        <Sequence key={`a${i}`} from={q(a.de)} durationInFrames={q(a.ate) - q(a.de)} premountFor={FPS}>
          <Aproximacao dur={q(a.ate) - q(a.de)} ate={1.05}>
            {a.arquivo.endsWith(".jpeg") || a.arquivo.endsWith(".jpg") ? (
              <Img
                src={staticFile(a.arquivo)}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: a.enquadramento }}
              />
            ) : (
              <Video
                src={staticFile(a.arquivo)}
                trimBefore={Math.round(a.inicio * FPS)}
                muted
                objectFit="cover"
                style={{ width: "100%", height: "100%", objectPosition: a.enquadramento }}
              />
            )}
          </Aproximacao>
        </Sequence>
      ))}

      {/* Voz da Paty, contínua */}
      <Audio
        src={staticFile(p.fala)}
        trimBefore={Math.round(p.ini * FPS)}
        trimAfter={Math.round(p.fim * FPS)}
      />

      {/* Degradê petróleo só na base, para leitura do texto */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(7,33,38,0.72) 0%, rgba(7,33,38,0.5) 28%, rgba(7,33,38,0) 52%)",
        }}
      />

      <Gancho linhas={p.gancho} />

      {p.legenda.map((l, i) => {
        const de = Math.max(0, q(l.ini));
        const ate = Math.min(total, q(l.fim));
        if (ate <= de) return null;
        return (
          <Sequence key={`l${i}`} from={de} durationInFrames={ate - de} layout="none">
            <Legenda texto={l.texto} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const CORTEJO: FalaPatyProps = {
  fala: "brutos/cortejo/fala.mp4",
  ini: 1.0,
  fim: 27.3,
  gancho: ["Quem decide a ordem", "das entradas?"],
  legenda: LEGENDA_CORTEJO,
  apoios: [
    // "Quem entra com você, em qual ordem, qual a música" — noiva e pai de costas, véu
    { de: 5.36, ate: 8.55, arquivo: "brutos/cortejo/entrada-9635.mp4", inicio: 2.0 },
    // "A gente alinha o que vocês desejam…" — equipe com prancheta (1080p)
    { de: 11.14, ate: 14.3, arquivo: "brutos/cortejo/equipe-9608.mp4", inicio: 0.5 },
    { de: 14.3, ate: 17.32, arquivo: "brutos/cortejo/equipe-9608.mp4", inicio: 6.0 },
    // "Assim, cada entrada tem o ritmo e tem um sentido" — corredor, de longe
    { de: 17.32, ate: 20.88, arquivo: "brutos/cortejo/entrada-9635.mp4", inicio: 9.0 },
  ],
};

// Logo oficial usada só na capa (Logo-original-1.png, Drive › 08 — MARKETING › 00 — Marca).
export const LOGO_CAPA = "marca/Logo-original-1.png";
