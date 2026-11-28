import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COR } from "./marca";
import { SANS, SERIF } from "./fontes";
import { LEGENDA_CORTEJO } from "./legendas/cortejo";
import { LEGENDA_ENTRADA } from "./legendas/entrada";
import { LEGENDA_UNICO } from "./legendas/unico";

// Reels falados da Paty — instruções v2 (28/11/2026) + Guia do Notion (26/11/2026, seção 11).
// Paty (28/11): "texto conforme o guia, motions, cortes, edições mais animadas".
// - Voz real e contínua, sem acelerar e sem trocar palavras.
// - Texto do Guia: fio nude + etiqueta Montserrat maiúscula + frase Cormorant (2ª linha itálico nude),
//   alinhado à esquerda no terço de baixo. Gancho digitado (~25 letras/s), cursor fixo.
// - Animações só da lista do Guia: digitação, fade + subida curta, fio desenhado, check desenhado,
//   aproximação lenta contínua. Cortes secos. Uma animação de cada vez.
// - Sem logo no fim (logo só na capa). Sem SFX (música pelo app).

export const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.22, 1, 0.36, 1);

type Corte =
  | { de: number; ate: number; paty: true; zoom?: number }
  | {
      de: number;
      ate: number;
      arquivo: string;
      inicio?: number;
      enquadramento?: string;
    };

type Bloco = {
  kicker: string;
  linha: string;
  italico: string;
  de: number;
  ate: number;
};

export type FalaPatyProps = {
  fala: string;
  ini: number;
  fim: number;
  cortes: Corte[];
  gancho: Bloco;
  checklist?: {
    titulo: string;
    de: number;
    ate: number;
    itens: { texto: string; em: number }[];
  };
  blocos: Bloco[];
  legenda: readonly { texto: string; ini: number; fim: number }[];
  /** Ponto fixo da aproximação nos planos da Paty (rosto alto: "50% 22%"; rosto baixo: "50% 100%" puxa o rosto para cima). */
  origemPaty?: string;
};

export const duracaoFala = (p: FalaPatyProps) =>
  Math.round((p.fim - p.ini) * FPS);

// ---------- peças de texto (padrão do Guia) ----------

const Etiqueta: React.FC<{ texto: string; fio: number }> = ({ texto, fio }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 24 }}
  >
    <div style={{ width: 64 * fio, height: 3, backgroundColor: COR.nude }} />
    <div
      style={{
        color: COR.nude,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 28,
        letterSpacing: 5,
        textTransform: "uppercase",
        opacity: fio,
      }}
    >
      {texto}
    </div>
  </div>
);

const POS_BLOCO = {
  position: "absolute",
  left: 96,
  right: 60,
  bottom: 560,
} as const;
const TITULO = {
  color: COR.fundoClaro,
  fontFamily: SERIF,
  fontWeight: 500,
  fontSize: 88,
  lineHeight: 1.06,
  textShadow: "0 2px 22px rgba(7,33,38,0.45)",
} as const;

// Gancho digitado letra por letra, cursor fino parado (sem piscar), some ao terminar.
const GanchoDigitado: React.FC<{ b: Bloco; duracao: number }> = ({
  b,
  duracao,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const porLetra = fps / 25;
  const n = Math.floor(f / porLetra);
  const total = b.linha.length + b.italico.length;
  const l1 = b.linha.slice(0, Math.min(n, b.linha.length));
  const l2 = b.italico.slice(0, Math.max(0, n - b.linha.length));
  const fio = interpolate(f, [0, 0.5 * fps], [0, 1], {
    ...clamp,
    easing: suave,
  });
  const sai = interpolate(f, [duracao - 0.3 * fps, duracao], [1, 0], clamp);
  const cursor = (
    <span style={{ fontStyle: "normal", color: COR.nude, fontWeight: 400 }}>
      |
    </span>
  );
  return (
    <div style={{ ...POS_BLOCO, opacity: sai }}>
      <Etiqueta texto={b.kicker} fio={fio} />
      <div style={{ ...TITULO, minHeight: 2 * 88 * 1.06 }}>
        {l1}
        {n < total && n <= b.linha.length ? cursor : null}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {l2}
          {n < total && n > b.linha.length ? cursor : null}
        </span>
      </div>
    </div>
  );
};

// Frase do Guia: entra com fade + subida curta (0,45 s), fio se desenha, sai com fade.
const Frase: React.FC<{ b: Bloco; duracao: number }> = ({ b, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fio = interpolate(f, [0, 0.5 * fps], [0, 1], {
    ...clamp,
    easing: suave,
  });
  const a = interpolate(f, [0.1 * fps, 0.55 * fps], [0, 1], {
    ...clamp,
    easing: suave,
  });
  const sai = interpolate(f, [duracao - 0.3 * fps, duracao], [1, 0], clamp);
  return (
    <div style={{ ...POS_BLOCO, opacity: sai }}>
      <Etiqueta texto={b.kicker} fio={fio} />
      <div
        style={{
          ...TITULO,
          opacity: a,
          transform: `translateY(${(1 - a) * 26}px)`,
        }}
      >
        {b.linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {b.italico}
        </span>
      </div>
    </div>
  );
};

const Check: React.FC<{ em: number }> = ({ em }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(f - em, [0, 0.3 * fps], [1, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <svg width="46" height="46" viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
      <path
        d="M6 23 L17 34 L38 9"
        fill="none"
        stroke={COR.nude}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={p}
      />
    </svg>
  );
};

// Lista com check: um item por vez, no momento em que a Paty fala.
const Lista: React.FC<{
  c: NonNullable<FalaPatyProps["checklist"]>;
  duracao: number;
}> = ({ c, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = interpolate(f, [0, 0.45 * fps], [0, 1], {
    ...clamp,
    easing: suave,
  });
  const sai = interpolate(f, [duracao - 0.3 * fps, duracao], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 60,
        bottom: 470,
        opacity: sai,
      }}
    >
      <div
        style={{
          ...TITULO,
          fontSize: 80,
          marginBottom: 34,
          opacity: a,
          transform: `translateY(${(1 - a) * 24}px)`,
        }}
      >
        <span
          style={{
            fontStyle: "italic",
            color: COR.fundoClaro,
            textShadow: "0 2px 18px rgba(7,33,38,0.85)",
          }}
        >
          {c.titulo}
        </span>
      </div>
      {c.itens.map((it, i) => {
        const em = Math.round((it.em - c.de) * fps);
        const op = interpolate(f, [em, em + 0.3 * fps], [0, 1], {
          ...clamp,
          easing: suave,
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              marginBottom: 16,
              opacity: op,
              transform: `translateY(${(1 - op) * 20}px)`,
            }}
          >
            <Check em={em} />
            <div
              style={{
                color: COR.fundoClaro,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 52,
                textShadow: "0 2px 14px rgba(7,33,38,0.6)",
              }}
            >
              {it.texto}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Legenda da fala: Montserrat 52 px, esquerda, abaixo do bloco do Guia, acima da faixa de botões.
const Legenda: React.FC<{ texto: string }> = ({ texto }) => (
  <div
    style={{
      position: "absolute",
      left: 96,
      right: 96,
      bottom: 400,
      color: "#FFFFFF",
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 52,
      lineHeight: 1.22,
      textShadow: "0 2px 14px rgba(7,33,38,0.75)",
    }}
  >
    {texto}
  </div>
);

// Aproximação lenta e contínua, num sentido só (Guia: 100 → 105 %).
const Aproximacao: React.FC<{
  dur: number;
  base: number;
  origem?: string;
  children: React.ReactNode;
}> = ({ dur, base, origem = "50% 50%", children }) => {
  const f = useCurrentFrame();
  const s = base * interpolate(f, [0, dur], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origem }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- composição ----------

export const FalaPaty: React.FC<FalaPatyProps> = (p) => {
  const total = duracaoFala(p);
  const q = (s: number) =>
    Math.max(0, Math.min(total, Math.round((s - p.ini) * FPS)));

  // Legenda some enquanto a lista ou um bloco do Guia (exceto o gancho) está na tela: um texto de cada vez.
  const ocupado = [...p.blocos, ...(p.checklist ? [p.checklist] : [])];
  const livre = (ini: number) =>
    !ocupado.some((b) => ini >= b.de - 0.05 && ini < b.ate);

  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {p.cortes.map((c, i) => {
        const d = q(c.ate) - q(c.de);
        return (
          <Sequence
            key={`c${i}`}
            from={q(c.de)}
            durationInFrames={d}
            premountFor={FPS}
          >
            <Aproximacao
              dur={d}
              base={"paty" in c ? (c.zoom ?? 1) : 1}
              origem={"paty" in c ? (p.origemPaty ?? "50% 22%") : undefined}
            >
              {"paty" in c ? (
                <OffthreadVideo
                  src={staticFile(p.fala)}
                  trimBefore={Math.round(c.de * FPS)}
                  muted
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : /\.(jpe?g|png)$/i.test(c.arquivo) ? (
                <Img
                  src={staticFile(c.arquivo)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: c.enquadramento,
                  }}
                />
              ) : (
                <OffthreadVideo
                  src={staticFile(c.arquivo)}
                  trimBefore={Math.round((c.inicio ?? 0) * FPS)}
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: c.enquadramento,
                  }}
                />
              )}
            </Aproximacao>
          </Sequence>
        );
      })}

      {/* Voz da Paty, contínua por baixo de todos os cortes */}
      <Audio
        src={staticFile(p.fala)}
        trimBefore={Math.round(p.ini * FPS)}
        trimAfter={Math.round(p.fim * FPS)}
      />

      {/* Degradê petróleo escuro só na base */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(7,33,38,0.82) 0%, rgba(7,33,38,0.6) 24%, rgba(7,33,38,0) 50%)",
        }}
      />

      <Sequence
        from={q(p.gancho.de)}
        durationInFrames={q(p.gancho.ate) - q(p.gancho.de)}
        layout="none"
      >
        <GanchoDigitado
          b={p.gancho}
          duracao={q(p.gancho.ate) - q(p.gancho.de)}
        />
      </Sequence>

      {p.checklist ? (
        <Sequence
          from={q(p.checklist.de)}
          durationInFrames={q(p.checklist.ate) - q(p.checklist.de)}
          layout="none"
        >
          <Lista
            c={p.checklist}
            duracao={q(p.checklist.ate) - q(p.checklist.de)}
          />
        </Sequence>
      ) : null}

      {p.blocos.map((b, i) => (
        <Sequence
          key={`b${i}`}
          from={q(b.de)}
          durationInFrames={q(b.ate) - q(b.de)}
          layout="none"
        >
          <Frase b={b} duracao={q(b.ate) - q(b.de)} />
        </Sequence>
      ))}

      {p.legenda.map((l, i) => {
        if (!livre(l.ini)) return null;
        const de = q(l.ini);
        const ate = q(l.fim);
        if (ate <= de) return null;
        return (
          <Sequence
            key={`l${i}`}
            from={de}
            durationInFrames={ate - de}
            layout="none"
          >
            <Legenda texto={l.texto} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Vídeo 1: Cortejo ----------
const CJ = "brutos/cortejo/";
export const CORTEJO: FalaPatyProps = {
  fala: `${CJ}fala-ret.mp4`, // retoque global (sem rastrear rosto): pele, cor neutra, batom suave
  ini: 1.0,
  fim: 27.3,
  // cortes secos; "zoom" = enquadramento mais fechado no corte (não é animação)
  cortes: [
    { de: 1.0, ate: 3.94, paty: true, zoom: 1.08 },
    { de: 3.94, ate: 5.36, paty: true, zoom: 1.22 },
    { de: 5.36, ate: 6.9, arquivo: `${CJ}entrada-9635.mp4`, inicio: 2.0 }, // noiva e pai de costas, véu
    { de: 6.9, ate: 8.55, arquivo: `${CJ}corredor-9647.mp4`, inicio: 10.0 }, // corredor decorado
    { de: 8.55, ate: 11.14, paty: true, zoom: 1.22 },
    { de: 11.14, ate: 12.9, arquivo: `${CJ}equipe-9608.mp4`, inicio: 0.5 }, // equipe com prancheta
    {
      de: 12.9,
      ate: 14.87,
      arquivo: `${CJ}equipe-roda-9605.jpg`,
      enquadramento: "50% 40%",
    },
    { de: 14.87, ate: 17.32, arquivo: `${CJ}equipe-9608.mp4`, inicio: 6.0 },
    { de: 17.32, ate: 19.0, paty: true, zoom: 1.08 },
    { de: 19.0, ate: 20.88, arquivo: `${CJ}corredor-9647.mp4`, inicio: 14.0 },
    { de: 20.88, ate: 23.2, paty: true, zoom: 1.22 },
    { de: 23.2, ate: 27.3, paty: true, zoom: 1.08 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Quem decide a ordem",
    italico: "das entradas?",
    de: 1.0,
    ate: 4.6,
  },
  checklist: {
    titulo: "Alinhado semanas antes:",
    de: 5.36,
    ate: 8.55,
    itens: [
      { texto: "Quem entra com você", em: 5.4 },
      { texto: "Em qual ordem", em: 6.7 },
      { texto: "Qual a música", em: 7.6 },
    ],
  },
  blocos: [
    {
      kicker: "O cortejo",
      linha: "Cada entrada tem ritmo",
      italico: "e tem sentido.",
      de: 17.32,
      ate: 20.88,
    },
    {
      kicker: "No dia",
      linha: "A equipe já sabe",
      italico: "o que vai fazer.",
      de: 24.31,
      ate: 27.3,
    },
  ],
  legenda: LEGENDA_CORTEJO,
};

// Logo oficial usada só na capa (Logo-original-1.png, Drive › 08 — MARKETING › 00 — Marca).
export const LOGO_CAPA = "marca/Logo-original-1.png";

// ---------- Capa (1080 × 1920): Paty olhando para a câmera + gancho + logo original pequena ----------
export type CapaFalaProps = {
  foto: string;
  kicker: string;
  linha: string;
  italico: string;
  /** aproximação fixa da foto (rosto baixo no quadro: 1.15 com origem embaixo) */
  zoom?: number;
  origem?: string;
};

export const CapaFala: React.FC<CapaFalaProps> = (c) => (
  <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
    <Img
      src={staticFile(c.foto)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${c.zoom ?? 1})`,
        transformOrigin: c.origem ?? "50% 50%",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to top, rgba(7,33,38,0.85) 0%, rgba(7,33,38,0.62) 26%, rgba(7,33,38,0) 50%)",
      }}
    />
    {/* logo original pequena, no canto, dentro da área 4:5 do perfil, sem cobrir o rosto */}
    <Img
      src={staticFile(LOGO_CAPA)}
      style={{ position: "absolute", top: 310, left: 64, width: 210 }}
    />
    <div style={{ ...POS_BLOCO, bottom: 470 }}>
      <Etiqueta texto={c.kicker} fio={1} />
      <div style={{ ...TITULO, fontSize: 100 }}>
        {c.linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {c.italico}
        </span>
      </div>
    </div>
  </AbsoluteFill>
);

export const CAPA_CORTEJO: CapaFalaProps = {
  foto: `${CJ}capa.jpg`,
  kicker: "Bastidores da Impactar",
  linha: "Quem decide a ordem",
  italico: "das entradas?",
};

// ---------- Vídeo 2: Entrada e ritmo (IMG_9673, 2 tomadas montadas; sem "o convidado larga o celular") ----------
// Junções da montagem (s): 7,70 · 17,53 · 26,29 · 36,04 · 42,29 — todas escondidas por apoio ou troca de enquadramento.
const ENTRADA_BASE: FalaPatyProps = {
  fala: "brutos/entrada/fala-ret.mp4",
  ini: 0,
  fim: 47.1,
  origemPaty: "50% 100%",
  cortes: [
    { de: 0, ate: 3.6, paty: true, zoom: 1.08 },
    {
      de: 3.6,
      ate: 5.8,
      arquivo: `${CJ}altar-decoracao-9600.jpg`,
      enquadramento: "50% 45%",
    }, // altar decorado
    { de: 5.8, ate: 7.7, arquivo: `${CJ}corredor-9647.mp4`, inicio: 10.0 }, // corredor decorado
    { de: 7.7, ate: 10.9, paty: true, zoom: 1.22 },
    { de: 10.9, ate: 14.7, paty: true, zoom: 1.08 },
    { de: 14.7, ate: 17.53, paty: true, zoom: 1.22 },
    { de: 17.53, ate: 20.4, paty: true, zoom: 1.08 },
    { de: 20.4, ate: 22.28, arquivo: `${CJ}entrada-9635.mp4`, inicio: 2.0 }, // véu, de costas
    { de: 22.28, ate: 24.9, paty: true, zoom: 1.22 },
    { de: 24.9, ate: 26.29, paty: true, zoom: 1.08 },
    { de: 26.29, ate: 29.77, arquivo: `${CJ}entrada-9635.mp4`, inicio: 9.0 }, // entrada no corredor, de longe
    { de: 29.77, ate: 33.07, arquivo: `${CJ}corredor-9647.mp4`, inicio: 1.0 }, // coro e orquestra
    { de: 33.07, ate: 36.04, arquivo: `${CJ}altar-9636.mp4`, inicio: 2.2 }, // casal no altar, de costas
    { de: 36.04, ate: 39.95, paty: true, zoom: 1.08 },
    { de: 39.95, ate: 42.29, paty: true, zoom: 1.22 },
    { de: 42.29, ate: 47.15, paty: true, zoom: 1.08 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Decoração linda.",
    italico: "E o ritmo da entrada?",
    de: 0,
    ate: 3.8,
  },
  checklist: {
    titulo: "O ritmo é:",
    de: 26.29,
    ate: 36.04,
    itens: [
      { texto: "A entrada no tempo certo", em: 26.4 },
      { texto: "A música que entra junto", em: 29.8 },
      { texto: "A pausa antes do sim", em: 33.1 },
    ],
  },
  blocos: [
    {
      kicker: "O que fica",
      linha: "Não é a decoração,",
      italico: "é o ritmo.",
      de: 22.28,
      ate: 26.29,
    },
    {
      kicker: "Bastidores da Impactar",
      linha: "A entrada começa",
      italico: "antes do dia.",
      de: 42.29,
      ate: 47.15,
    },
  ],
  legenda: LEGENDA_ENTRADA,
};

// A cópia do Drive (IMG_9673 1080p) repete 1 quadro a cada 2 (imagem a 15 q/s → "travando").
// fala-ret.mp4 usa só os quadros reais + quadros intermediários calculados (minterpolate), mesma velocidade.
// (Teste de 28/11: boca × voz confere na escala 1,0 — o arquivo NÃO estava desacelerado.)
export const ENTRADA = ENTRADA_BASE;

// ---------- Vídeo 3: Seu único trabalho (IMG_9674; sem as frases "nem fica sabendo") ----------
// Junções da montagem (s): 12,85 · 15,62 — escondidas por apoio.
export const UNICO: FalaPatyProps = {
  fala: "brutos/unico/fala-ret.mp4",
  ini: 0,
  fim: 17.05,
  origemPaty: "50% 100%",
  cortes: [
    { de: 0, ate: 3.12, paty: true, zoom: 1.08 },
    { de: 3.12, ate: 5.12, paty: true, zoom: 1.22 },
    { de: 5.12, ate: 7.0, arquivo: `${CJ}equipe-9608.mp4`, inicio: 0.5 }, // equipe com prancheta
    {
      de: 7.0,
      ate: 9.37,
      arquivo: `${CJ}equipe-roda-9605.jpg`,
      enquadramento: "50% 40%",
    }, // equipe em roda, guarda-chuva
    { de: 9.37, ate: 10.64, paty: true, zoom: 1.08 },
    { de: 10.64, ate: 12.85, paty: true, zoom: 1.22 },
    { de: 12.85, ate: 15.62, arquivo: `${CJ}equipe-9608.mp4`, inicio: 6.0 },
    { de: 15.62, ate: 17.05, paty: true, zoom: 1.08 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Seu único trabalho:",
    italico: "ser noiva.",
    de: 0,
    ate: 3.4,
  },
  checklist: {
    titulo: "Quem resolve?",
    de: 5.12,
    ate: 9.37,
    itens: [
      { texto: "Se o fornecedor atrasar", em: 5.45 },
      { texto: "Se um convidado se perder", em: 6.72 },
      { texto: "Se a chuva apertar", em: 8.17 },
    ],
  },
  blocos: [
    {
      kicker: "No dia",
      linha: "Você só vive",
      italico: "o momento.",
      de: 14.24,
      ate: 17.05,
    },
  ],
  legenda: LEGENDA_UNICO,
};

export const CAPA_ENTRADA: CapaFalaProps = {
  foto: "brutos/entrada/capa.jpg",
  kicker: "Bastidores da Impactar",
  linha: "Decoração linda.",
  italico: "E o ritmo da entrada?",
  zoom: 1.15,
  origem: "50% 100%",
};

export const CAPA_UNICO: CapaFalaProps = {
  foto: "brutos/unico/capa.jpg",
  kicker: "Bastidores da Impactar",
  linha: "Seu único trabalho:",
  italico: "ser noiva.",
  zoom: 1.15,
  origem: "50% 100%",
};
