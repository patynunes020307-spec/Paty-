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
import { BlocoFrase, Frase } from "./CorteFilme";
import { SANS as sans, SERIF as serif } from "./fontes";
import { COR } from "./marca";

// Reels com os "motions" da referência (@mariananunes.mkt, 19/11/2026),
// adaptados ao Guia: texto digitado no gancho, checklist sendo marcado,
// tela final com CTA. Sem caixas, sem pulsar (cursor fixo, some ao terminar).

export const FPS = 30;
const DEGRADE =
  "linear-gradient(to top, rgba(7,33,38,0.96) 0%, rgba(7,33,38,0.85) 25%, rgba(32,63,81,0) 58%)";

type Cena = {
  arquivo: string;
  inicio: number;
  fim: number;
  enquadramento?: string;
  pb?: boolean; // preto e branco (emoção: cerimônia, lágrimas, beijo)
};
type TextoTimed = { frase: Frase; de: number; ate: number }; // segundos no Reel
type Item = { texto: string; em: number }; // segundos no Reel

export type MotionProps = {
  cenas: Cena[];
  gancho: { linha: string; italico: string; kicker: string; ate: number };
  textos: TextoTimed[];
  checklist?: { titulo: string; de: number; ate: number; itens: Item[] };
  cta: { linha: string; italico: string; acao: string; segundos: number };
  // áudio real (fala da equipe) + legenda sincronizada — opcional
  audio?: { arquivo: string; de: number };
  falas?: { texto: string; de: number; ate: number }[];
  // Guia seção 11 (20/11/2026): aproximação lenta 100→105% por cena,
  // CTA sobre a última cena (sem tela final), bloco de texto mais baixo se preciso
  zoom?: boolean;
  ctaNaCena?: boolean;
  bottom?: number;
};

// Legenda de fala (Montserrat, terço inferior)
const Fala: React.FC<{ texto: string; duracao: number }> = ({
  texto,
  duracao,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(
    frame,
    [0, 0.15 * fps, duracao - 0.15 * fps, duracao],
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
        textShadow: "0 2px 18px rgba(7,33,38,0.6)",
      }}
    >
      {texto}
    </div>
  );
};

const dur = (c: Cena) => Math.round((c.fim - c.inicio) * FPS);
export const duracaoMotion = (p: MotionProps) =>
  p.cenas.reduce((t, c) => t + dur(c), 0) +
  (p.ctaNaCena ? 0 : Math.round(p.cta.segundos * FPS));

// Cena em tela cheia; com zoom, aproximação lenta e contínua (100% → 105%), num sentido só.
const CenaVideo: React.FC<{ c: Cena; zoom?: boolean }> = ({ c, zoom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = dur(c);
  const esc = zoom
    ? interpolate(frame, [0, total], [1, 1.05], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return (
    <Video
      src={staticFile(c.arquivo)}
      trimBefore={Math.round(c.inicio * fps)}
      muted
      objectFit="cover"
      style={{
        width: "100%",
        height: "100%",
        objectPosition: c.enquadramento ?? "50% 50%",
        scale: esc,
        filter: c.pb ? "grayscale(1)" : undefined,
      }}
    />
  );
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 1) Texto sendo digitado no gancho
const Digitado: React.FC<{
  g: MotionProps["gancho"];
  duracao: number;
  bottom?: number;
}> = ({ g, duracao, bottom = 470 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = g.linha.length + g.italico.length;
  const porLetra = 0.045 * fps;
  const n = Math.floor(frame / porLetra);
  const l1 = g.linha.slice(0, Math.min(n, g.linha.length));
  const l2 = g.italico.slice(0, Math.max(0, n - g.linha.length));
  const digitando = n < total;
  const saida = interpolate(
    frame,
    [duracao - 0.4 * fps, duracao],
    [1, 0],
    clamp,
  );
  const cursor = (
    <span style={{ fontStyle: "normal", color: COR.nude, fontWeight: 400 }}>
      |
    </span>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 60,
        bottom,
        opacity: saida,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginBottom: 26,
        }}
      >
        <div style={{ width: 64, height: 3, backgroundColor: COR.nude }} />
        <div
          style={{
            color: COR.nude,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          {g.kicker}
        </div>
      </div>
      <div
        style={{
          color: COR.fundoClaro,
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 84,
          lineHeight: 1.08,
          minHeight: 2 * 84 * 1.08,
        }}
      >
        {l1}
        {digitando && n <= g.linha.length ? cursor : null}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {l2}
          {digitando && n > g.linha.length ? cursor : null}
        </span>
      </div>
    </div>
  );
};

// 3) Checklist sendo marcado — traço de check desenhado, sem caixas
const Check: React.FC<{ inicio: number }> = ({ inicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame - inicio, [0, 0.35 * fps], [1, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
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

const Checklist: React.FC<{
  c: NonNullable<MotionProps["checklist"]>;
  duracao: number;
  bottom?: number;
}> = ({ c, duracao, bottom = 430 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(
    frame,
    [0, 0.4 * fps, duracao - 0.4 * fps, duracao],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 60,
        bottom,
        opacity: v,
      }}
    >
      <div
        style={{
          color: COR.fundoClaro,
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 72,
          lineHeight: 1.08,
          marginBottom: 34,
        }}
      >
        {c.titulo}
      </div>
      {c.itens.map((it, i) => {
        const em = Math.round((it.em - c.de) * fps);
        const op = interpolate(frame, [em - 0.3 * fps, em], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              marginBottom: 18,
              opacity: op,
            }}
          >
            <Check inicio={em} />
            <div
              style={{
                color: COR.fundoClaro,
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 40,
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

// 6) Tela final com CTA — fundo petróleo (modelo C do Guia), fio desenhado sob a ação
const TelaCTA: React.FC<{ cta: MotionProps["cta"] }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
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
        // aproximação lenta e contínua (nada parado; sem pulsar)
        scale: interpolate(frame, [0, cta.segundos * fps], [0.97, 1], clamp),
      }}
    >
      <div
        style={{
          opacity: a,
          translate: `0px ${interpolate(a, [0, 1], [24, 0])}px`,
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

export const MotionReel: React.FC<MotionProps> = (p) => {
  const { fps } = useVideoConfig();
  const inicios = p.cenas.map((_, i) =>
    p.cenas.slice(0, i).reduce((t, c) => t + dur(c), 0),
  );
  const durFilme = p.cenas.reduce((t, c) => t + dur(c), 0);
  const s = (x: number) => Math.round(x * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {p.cenas.map((c, i) => (
        <Sequence
          key={i}
          from={inicios[i]}
          durationInFrames={dur(c)}
          premountFor={fps}
        >
          <CenaVideo c={c} zoom={p.zoom} />
        </Sequence>
      ))}
      <Sequence durationInFrames={durFilme}>
        <AbsoluteFill style={{ background: DEGRADE }} />
      </Sequence>
      <Sequence durationInFrames={s(p.gancho.ate)} premountFor={fps}>
        <Digitado g={p.gancho} duracao={s(p.gancho.ate)} bottom={p.bottom} />
      </Sequence>
      {p.textos.map((t, i) => (
        <Sequence
          key={i}
          from={s(t.de)}
          durationInFrames={s(t.ate - t.de)}
          premountFor={fps}
        >
          <BlocoFrase
            frase={t.frase}
            duracao={s(t.ate - t.de)}
            bottom={p.bottom}
          />
        </Sequence>
      ))}
      {p.checklist ? (
        <Sequence
          from={s(p.checklist.de)}
          durationInFrames={s(p.checklist.ate - p.checklist.de)}
          premountFor={fps}
        >
          <Checklist
            c={p.checklist}
            duracao={s(p.checklist.ate - p.checklist.de)}
            bottom={p.bottom ? p.bottom - 40 : undefined}
          />
        </Sequence>
      ) : null}
      {p.ctaNaCena ? (
        <Sequence
          from={durFilme - s(p.cta.segundos)}
          durationInFrames={s(p.cta.segundos)}
          premountFor={fps}
        >
          <BlocoFrase
            frase={{
              kicker: p.cta.acao,
              linha: p.cta.linha,
              italico: p.cta.italico,
            }}
            duracao={s(p.cta.segundos) + Math.round(0.4 * fps)}
            bottom={p.bottom}
          />
        </Sequence>
      ) : (
        <Sequence
          from={durFilme}
          durationInFrames={s(p.cta.segundos)}
          premountFor={fps}
        >
          <TelaCTA cta={p.cta} />
        </Sequence>
      )}
      {(p.falas ?? []).map((f, i) => (
        <Sequence
          key={"f" + i}
          from={s(f.de)}
          durationInFrames={s(f.ate - f.de)}
        >
          <Fala texto={f.texto} duracao={s(f.ate - f.de)} />
        </Sequence>
      ))}
      {p.audio ? (
        <Sequence from={s(p.audio.de)}>
          <Audio src={staticFile(p.audio.arquivo)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

const L = "brutos/lote/";

// Reel A — Proposta 9 do Banco de Ideias. Só ações visíveis nas cenas.
export const ASSESSORA: MotionProps = {
  cenas: [
    { arquivo: L + "IMG_3400.mp4", inicio: 0, fim: 2.8 },
    { arquivo: L + "IMG_3401.mp4", inicio: 0.2, fim: 7.1 },
    { arquivo: L + "IMG_3402.mp4", inicio: 0, fim: 6.0 },
    { arquivo: L + "IMG_9998.mp4", inicio: 0, fim: 2.38 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "A assessora apareceu pouco.",
    italico: "O que ela estava fazendo?",
    ate: 4.4,
  },
  textos: [
    {
      frase: {
        kicker: "01",
        linha: "Posicionando os noivos",
        italico: "no altar.",
      },
      de: 4.6,
      ate: 9.6,
    },
    {
      frase: {
        kicker: "02",
        linha: "Ajustando cada detalhe",
        italico: "antes do sim.",
      },
      de: 9.8,
      ate: 15.6,
    },
    {
      frase: {
        kicker: "03",
        linha: "Orientando",
        italico: "o próximo momento.",
      },
      de: 15.8,
      ate: 18.0,
    },
  ],
  cta: {
    linha: "Nem toda entrega",
    italico: "cabe no filme.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Reel B — coordenação de montagem (06/09/2026). Itens = só o que aparece nas cenas.
export const MONTAGEM: MotionProps = {
  cenas: [
    // só trechos nítidos (medição de nitidez; o resto do material tem tremida)
    { arquivo: L + "31f6a747.mp4", inicio: 0, fim: 1.2 },
    { arquivo: L + "31f6a747.mp4", inicio: 17.7, fim: 22.5 },
    { arquivo: L + "6b3af2ce.mp4", inicio: 0, fim: 2.2 },
    { arquivo: L + "a36508ed.mp4", inicio: 0, fim: 1.7 },
    { arquivo: L + "e4e6e22f.mp4", inicio: 4.2, fim: 6.0 },
    { arquivo: L + "e4e6e22f.mp4", inicio: 8.0, fim: 9.1 },
  ],
  gancho: {
    kicker: "Dia de montagem",
    linha: "Antes da decoração,",
    italico: "a gente confere o básico.",
    ate: 4.4,
  },
  textos: [],
  checklist: {
    titulo: "Na lista de hoje:",
    de: 4.6,
    ate: 12.8,
    itens: [
      { texto: "Suíte da noiva pronta", em: 5.0 },
      { texto: "Banheiros abastecidos", em: 6.6 },
      { texto: "Banheiro acessível", em: 10.2 },
    ],
  },
  cta: {
    linha: "O cuidado começa",
    italico: "antes de chegar o primeiro convidado.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Reel C — "Bastidor em 15 s" (Guia): equipe Impactar de bege, 18/04 e 01/05/2026.
// 2298 e 2303 gravados a 60 fps → câmera lenta real 0,5x (sem interpolar quadros).
export const ANTES_CONVIDADOS: MotionProps = {
  cenas: [
    { arquivo: L + "IMG_2298_lento.mp4", inicio: 0, fim: 7.7 },
    { arquivo: L + "IMG_2303_lento.mp4", inicio: 0, fim: 3.85 },
    { arquivo: L + "IMG_2791.mp4", inicio: 0, fim: 2.45 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Os convidados ainda não chegaram.",
    italico: "A gente já está aqui.",
    ate: 4.0,
  },
  textos: [],
  checklist: {
    titulo: "Antes da cerimônia:",
    de: 4.2,
    ate: 14.0,
    itens: [
      { texto: "Flores no corredor", em: 4.8 },
      { texto: "Cada cadeira conferida", em: 8.0 },
      { texto: "Kits organizados", em: 11.8 },
    ],
  },
  cta: {
    linha: "Quando vocês chegam,",
    italico: "tudo já está no lugar.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Reel D — "Antes de os padrinhos entrarem" (Banco de Ideias, Referência 2). Casamento 09/08/2025.
const DI = "brutos/diario/";
export const PADRINHOS: MotionProps = {
  cenas: [
    { arquivo: DI + "8011.mp4", inicio: 1.5, fim: 4.5 },
    { arquivo: DI + "8017.mp4", inicio: 2.0, fim: 6.5 },
    { arquivo: DI + "8027.mp4", inicio: 2.0, fim: 4.5 },
    { arquivo: DI + "8032.mp4", inicio: 0, fim: 6.0 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Antes de os padrinhos entrarem,",
    italico: "muita coisa já aconteceu.",
    ate: 4.4,
  },
  textos: [
    {
      frase: {
        kicker: "01",
        linha: "Uma conversa rápida",
        italico: "antes da fila.",
      },
      de: 4.6,
      ate: 7.4,
    },
    {
      frase: {
        kicker: "02",
        linha: "Últimos combinados",
        italico: "com o noivo.",
      },
      de: 7.6,
      ate: 9.9,
    },
    {
      frase: {
        kicker: "03",
        linha: "E o cortejo entra",
        italico: "no tempo certo.",
      },
      de: 10.1,
      ate: 15.9,
    },
  ],
  cta: {
    linha: "A calma dos noivos",
    italico: "começa antes da cerimônia.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Reel E — "Ninguém vê, mas alguém arruma a cauda" (Bastidor em 15 s). Casamento 09/08/2025.
export const CAUDA: MotionProps = {
  cenas: [
    { arquivo: DI + "8035.mp4", inicio: 4.0, fim: 11.0 },
    { arquivo: DI + "8054.mp4", inicio: 2.0, fim: 5.0 },
    { arquivo: DI + "8103.mp4", inicio: 3.8, fim: 5.6 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Ninguém vê,",
    italico: "mas alguém arruma a cauda.",
    ate: 3.6,
  },
  textos: [
    {
      frase: {
        kicker: "01",
        linha: "Antes da entrada,",
        italico: "no chão, com calma.",
      },
      de: 3.8,
      ate: 7.0,
    },
    {
      frase: { kicker: "02", linha: "No altar,", italico: "o véu no lugar." },
      de: 7.2,
      ate: 10.0,
    },
    {
      frase: {
        kicker: "03",
        linha: "Depois do sim,",
        italico: "ainda cuidando.",
      },
      de: 10.1,
      ate: 11.8,
    },
  ],
  cta: {
    linha: "Cada detalhe,",
    italico: "até o último.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Reel F — "Enquanto todo mundo olha para o altar, a gente olha para o roteiro". Casamento 09/08/2025.
export const ROTEIRO: MotionProps = {
  cenas: [
    { arquivo: DI + "8030.mp4", inicio: 0.2, fim: 4.2 },
    { arquivo: DI + "8033.mp4", inicio: 12.2, fim: 15.3 },
    { arquivo: DI + "8054.mp4", inicio: 5.0, fim: 8.0 },
    { arquivo: DI + "8053.mp4", inicio: 2.0, fim: 6.0 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Enquanto todo mundo olha para o altar,",
    italico: "a gente olha para o roteiro.",
    ate: 4.1,
  },
  textos: [
    {
      frase: {
        kicker: "01",
        linha: "Cada momento",
        italico: "na ordem certa.",
      },
      de: 4.3,
      ate: 7.2,
    },
    {
      frase: {
        kicker: "02",
        linha: "Um olho no roteiro,",
        italico: "outro no véu.",
      },
      de: 7.4,
      ate: 10.2,
    },
    {
      frase: { kicker: "03", linha: "E acompanha", italico: "cada palavra." },
      de: 10.4,
      ate: 14.0,
    },
  ],
  cta: {
    linha: "Vocês vivem o sim.",
    italico: "A gente cuida do resto.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Reel G — "Até a aliança tem ensaio": fala real da cerimonialista orientando a noiva (23/05/2026).
const LD = "brutos/l20d/";
export const ALIANCA: MotionProps = {
  cenas: [
    { arquivo: LD + "92062e38.mp4", inicio: 0.5, fim: 3.5 },
    { arquivo: LD + "4112.mp4", inicio: 0, fim: 17.67 },
    { arquivo: LD + "IMG_3374.mp4", inicio: 0, fim: 2.7 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Até a aliança",
    italico: "tem ensaio.",
    ate: 3.0,
  },
  textos: [
    {
      frase: {
        kicker: "Na hora",
        linha: "E no altar,",
        italico: "sem pressa.",
      },
      de: 20.7,
      ate: 23.4,
    },
  ],
  // exceção à regra "sem som": a Paty liberou o áudio da fala das alianças (20/11)
  audio: { arquivo: "audio/4112.wav", de: 3.0 },
  falas: [
    {
      texto:
        "Você vai pegar as alianças assim, aparecendo essa parte de cima aqui,",
      de: 3.0,
      ate: 7.1,
    },
    {
      texto: "e na hora de colocar você vai bem devagar. Tá vendo?",
      de: 7.2,
      ate: 10.6,
    },
    {
      texto: "Vem devagar, olha pra ele, dá um sorriso pra ele.",
      de: 10.6,
      ate: 15.0,
    },
    {
      texto: "Pegou a mão, beijou, tá bom? É a mesma coisa aí.",
      de: 15.0,
      ate: 19.0,
    },
    { texto: "Prontinho!", de: 19.1, ate: 20.6 },
  ],
  cta: {
    linha: "Cada momento ensaiado",
    italico: "para ser vivido com calma.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Reel H — "A última volta antes de abrir as portas" (06/03/2026). Clipes de Live Photo (0,2 s) em sequência rápida.
export const ULTIMA_VOLTA: MotionProps = {
  cenas: [
    { arquivo: LD + "IMG_1270.mp4", inicio: 0, fim: 4.1 },
    { arquivo: LD + "IMG_1273.mp4", inicio: 0, fim: 0.2 },
    { arquivo: LD + "IMG_1275.mp4", inicio: 0, fim: 0.16 },
    { arquivo: LD + "IMG_1277.mp4", inicio: 0, fim: 0.2 },
    { arquivo: LD + "IMG_1279.mp4", inicio: 0, fim: 0.96 },
    { arquivo: LD + "IMG_1281.mp4", inicio: 0, fim: 0.2 },
    { arquivo: LD + "IMG_1337_lento.mp4", inicio: 0, fim: 2.95 },
    { arquivo: LD + "IMG_1291_lento.mp4", inicio: 0, fim: 4.7 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "A última volta",
    italico: "antes de abrir as portas.",
    ate: 4.0,
  },
  textos: [],
  checklist: {
    titulo: "Conferido:",
    de: 4.1,
    ate: 13.4,
    itens: [
      { texto: "Banheiros revisados", em: 4.4 },
      { texto: "Taças separadas", em: 6.2 },
      { texto: "Decoração no lugar", em: 9.2 },
    ],
  },
  cta: {
    linha: "Quando as portas abrem,",
    italico: "tudo já foi visto.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Reel I — Impactar 15 (perfil próprio, Guia): festa de 15 anos de 04/07/2026, vídeos do Drive (procaptures).
const PC = "brutos/pc/";
export const QUINZE_FESTA: MotionProps = {
  cenas: [
    { arquivo: PC + "IMG_0753.mp4", inicio: 0, fim: 5.2 },
    { arquivo: PC + "IMG_0769.mp4", inicio: 0, fim: 5.7 },
    { arquivo: PC + "IMG_0805.mp4", inicio: 0, fim: 4.85 },
  ],
  gancho: {
    kicker: "Impactar 15",
    linha: "Enquanto você dança,",
    italico: "a gente cuida da festa.",
    ate: 5.1,
  },
  textos: [
    {
      frase: { kicker: "01", linha: "Cuidando de", italico: "quem chega." },
      de: 5.3,
      ate: 10.8,
    },
    {
      frase: { kicker: "02", linha: "E presente", italico: "a festa inteira." },
      de: 11.0,
      ate: 15.7,
    },
  ],
  cta: {
    linha: "Seus 15 anos,",
    italico: "vividos sem preocupação.",
    acao: "Manda a data no direct.",
    segundos: 3.5,
  },
};

// Reel J — Banco de Ideias, Proposta 1 "Qual parte ficou por sua conta?". Casamento 09/08/2025.
export const CONJUNTO: MotionProps = {
  cenas: [
    { arquivo: DI + "7883.mp4", inicio: 0, fim: 5.0 },
    { arquivo: DI + "7884.mp4", inicio: 0.5, fim: 3.5 },
    { arquivo: DI + "7967.mp4", inicio: 2.0, fim: 5.4 },
    { arquivo: DI + "8146.mp4", inicio: 2.0, fim: 5.5 },
    { arquivo: DI + "8148.mp4", inicio: 0, fim: 2.0 },
  ],
  gancho: {
    kicker: "Bastidores da Impactar",
    linha: "Qual parte do casamento",
    italico: "ficou por sua conta?",
    ate: 5.0,
  },
  textos: [
    {
      frase: {
        kicker: "01",
        linha: "Quem confere o horário",
        italico: "de montagem de todos?",
      },
      de: 5.2,
      ate: 8.0,
    },
    {
      frase: {
        kicker: "02",
        linha: "Quem alinha a chegada",
        italico: "de cada fornecedor?",
      },
      de: 8.2,
      ate: 11.4,
    },
    {
      frase: {
        kicker: "03",
        linha: "Quem decide",
        italico: "se algo atrasar?",
      },
      de: 11.6,
      ate: 16.9,
    },
  ],
  cta: {
    linha: "Alguém precisa olhar",
    italico: "o casamento inteiro.",
    acao: "Manda a data e a cidade no direct.",
    segundos: 3.5,
  },
};

// Filme do casamento (videomaker @leo_henriquephotos, Drive › Banco de imagens › Videos), sem som.
// Guia seção 11 (20/11/2026): zoom lento, CTA sobre a última cena, sem tela final.
const VF = "brutos/votos-filme/filme.mp4";

// Reel — votos (pedido da Paty, 20/11): passo a passo sem a fala, cerimônia em P&B.
export const VOTOS_DICAS: MotionProps = {
  zoom: true,
  ctaNaCena: true,
  bottom: 380,
  cenas: [
    { arquivo: VF, inicio: 46.2, fim: 50.4, pb: true },
    { arquivo: VF, inicio: 136.0, fim: 141.0, pb: true },
    { arquivo: VF, inicio: 115.0, fim: 120.0, pb: true },
    { arquivo: VF, inicio: 110.2, fim: 114.2, pb: true },
    { arquivo: VF, inicio: 155.3, fim: 159.5, pb: true },
  ],
  gancho: {
    kicker: "Para quem vai casar",
    linha: "Vai escrever",
    italico: "os seus votos?",
    ate: 4.2,
  },
  textos: [
    {
      frase: {
        kicker: "01",
        linha: "Comece por uma lembrança",
        italico: "que só vocês dois têm.",
      },
      de: 4.4,
      ate: 9.0,
    },
    {
      frase: {
        kicker: "02",
        linha: "Troque frases prontas",
        italico: "por promessas do dia a dia.",
      },
      de: 9.2,
      ate: 13.9,
    },
    {
      frase: {
        kicker: "03",
        linha: "Leia em voz alta antes",
        italico: "e leve tudo impresso.",
      },
      de: 14.1,
      ate: 18.2,
    },
  ],
  cta: {
    linha: "Vocês cuidam das palavras.",
    italico: "A gente cuida do dia.",
    acao: "Manda para quem vai casar",
    segundos: 4.2,
  },
};

// Reel — véspera do casamento: checklist marcado no que aparece na cena (cor: detalhes e making of).
export const VESPERA: MotionProps = {
  zoom: true,
  ctaNaCena: true,
  bottom: 380,
  cenas: [
    { arquivo: VF, inicio: 0.3, fim: 6.4 },
    { arquivo: VF, inicio: 22.2, fim: 24.6 },
    { arquivo: VF, inicio: 28.9, fim: 31.3 },
    { arquivo: VF, inicio: 13.6, fim: 19.6 },
  ],
  gancho: {
    kicker: "Para quem vai casar",
    linha: "O que separar",
    italico: "na véspera?",
    ate: 3.0,
  },
  textos: [],
  checklist: {
    titulo: "Separe num só lugar:",
    de: 3.2,
    ate: 11.4,
    itens: [
      { texto: "Sapatos", em: 3.9 },
      { texto: "Joias e acessórios", em: 4.7 },
      { texto: "Convite para as fotos", em: 5.5 },
      { texto: "Vestido pendurado", em: 8.7 },
    ],
  },
  cta: {
    linha: "Na manhã do casamento,",
    italico: "só o que importa.",
    acao: "Salva para a sua véspera",
    segundos: 5.0,
  },
};
