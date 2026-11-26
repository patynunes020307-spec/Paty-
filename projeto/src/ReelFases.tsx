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
import { SANS as sans, SERIF as serif } from "./fontes";
import { COR } from "./marca";

// MODELO "Reel em fases" (26/11/2026), a partir do Reel "Fluxo do dia" aprovado pela Paty.
// Estrutura: gancho digitado → N fases (título + até 3 checks, um por vez) → frase final + CTA
// sobre a última cena. Uma foto real colorida por cena, aproximação lenta num sentido só.
// Animações só da seção 2B do Guia. Sem som; sem tela final e sem logo no fim (logo só na capa).
// Para uma peça nova: criar um objeto ReelFasesProps e registrar em Root.tsx.

export const FPS = 30;
const DEGRADE =
  "linear-gradient(to top, rgba(7,33,38,0.92) 0%, rgba(7,33,38,0.78) 30%, rgba(7,33,38,0.35) 46%, rgba(7,33,38,0) 60%)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);

export type Cena = {
  foto: string; // caminho em public/
  origem: string; // ponto de interesse do recorte ("x% y%")
  zoom: [number, number]; // aproximação do início ao fim (máx. sem ampliar além do original)
};

export type FaseReel = Cena & {
  num: string;
  etiqueta: string;
  linha: string;
  italico: string;
  itens: string[];
};

export type ReelFasesProps = {
  gancho: Cena & { etiqueta: string; linha: string; italico: string };
  fases: FaseReel[];
  final: Cena & { etiqueta: string; linha: string; italico: string };
  tempos?: { gancho: number; fase: number; final: number }; // segundos
};

const T_PADRAO = { gancho: 3.5, fase: 5, final: 3.5 };

export const duracaoReelFases = (p: ReelFasesProps) => {
  const t = p.tempos ?? T_PADRAO;
  return Math.round((t.gancho + p.fases.length * t.fase + t.final) * FPS);
};

const Foto: React.FC<{ c: Cena; dur: number }> = ({ c, dur }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, Math.max(dur, 1)], c.zoom, clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(c.foto)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: c.origem,
          filter: "contrast(1.04) saturate(1.05)",
          transformOrigin: c.origem,
          scale: String(s),
        }}
      />
    </AbsoluteFill>
  );
};

const Fio: React.FC<{ pronto?: boolean }> = ({ pronto }) => {
  const frame = useCurrentFrame() + (pronto ? 1000 : 0);
  const { fps } = useVideoConfig();
  const w = interpolate(frame, [0, 0.5 * fps], [0, 64], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{ width: w, height: 3, backgroundColor: COR.nude }} />;
};

const Etiqueta: React.FC<{ texto: string; fioPronto?: boolean }> = ({
  texto,
  fioPronto,
}) => {
  const compacta = texto.length > 26;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        marginBottom: 26,
      }}
    >
      <Fio pronto={fioPronto} />
      <div
        style={{
          color: COR.nude,
          fontFamily: sans,
          fontWeight: 600,
          fontSize: compacta ? 26 : 30,
          letterSpacing: compacta ? 4 : 6,
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const titulo = (tamanho: number): React.CSSProperties => ({
  color: COR.fundoClaro,
  fontFamily: serif,
  fontWeight: 500,
  fontSize: tamanho,
  lineHeight: 1.05,
  textShadow: "0 2px 18px rgba(7,33,38,0.5)",
});

// tamanho do título que cabe em 2 linhas na largura útil (~924 px)
const tamanhoTitulo = (a: string, b: string, max: number) =>
  Math.min(max, Math.floor(1850 / Math.max(a.length, b.length)));

const Gancho: React.FC<{ g: ReelFasesProps["gancho"]; dur: number }> = ({
  g,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.floor(frame / (fps / 25));
  const a = g.linha.slice(0, Math.min(n, g.linha.length));
  const b = g.italico.slice(0, Math.max(0, n - g.linha.length));
  const digitando = n < g.linha.length + g.italico.length;
  const saida = interpolate(frame, [dur - 0.3 * fps, dur], [1, 0], clamp);
  const t = tamanhoTitulo(g.linha, g.italico, 104);
  const cursor = (
    <span style={{ color: COR.nude, fontStyle: "normal" }}>|</span>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 60,
        bottom: 460,
        opacity: saida,
      }}
    >
      <Etiqueta texto={g.etiqueta} />
      <div style={{ ...titulo(t), minHeight: 2 * t * 1.05 }}>
        {a}
        {digitando && n <= g.linha.length ? cursor : null}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {b}
          {digitando && n > g.linha.length ? cursor : null}
        </span>
      </div>
    </div>
  );
};

const Check: React.FC<{ inicio: number }> = ({ inicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame - inicio, [0, 0.3 * fps], [1, 0], {
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

const BlocoFase: React.FC<{ f: FaseReel; dur: number }> = ({ f, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = interpolate(frame, [0, 0.45 * fps], [0, 1], {
    ...clamp,
    easing: suave,
  });
  const sai = interpolate(frame, [dur - 0.3 * fps, dur], [1, 0], clamp);
  const tItem = (i: number) => Math.round((1.0 + i * 1.05) * fps);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 60,
        bottom: 330,
        opacity: Math.min(entra, sai),
        translate: `0px ${interpolate(entra, [0, 1], [24, 0])}px`,
      }}
    >
      <Etiqueta texto={`${f.num} — ${f.etiqueta}`} />
      <div
        style={{
          ...titulo(tamanhoTitulo(f.linha, f.italico, 96)),
          marginBottom: 40,
        }}
      >
        {f.linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {f.italico}
        </span>
      </div>
      {f.itens.map((t, i) => {
        const em = tItem(i);
        const op = interpolate(frame, [em - 0.25 * fps, em], [0, 1], clamp);
        return (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              marginBottom: 20,
              opacity: op,
              translate: `0px ${interpolate(op, [0, 1], [20, 0])}px`,
            }}
          >
            <Check inicio={em} />
            <div
              style={{
                color: COR.fundoClaro,
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 44,
                lineHeight: 1.25,
                textShadow: "0 2px 14px rgba(7,33,38,0.55)",
                textWrap: "balance",
              }}
            >
              {t}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const BlocoFinal: React.FC<{ f: ReelFasesProps["final"] }> = ({ f }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = interpolate(frame, [0, 0.45 * fps], [0, 1], {
    ...clamp,
    easing: suave,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 60,
        bottom: 460,
        opacity: entra,
        translate: `0px ${interpolate(entra, [0, 1], [24, 0])}px`,
      }}
    >
      <Etiqueta texto={f.etiqueta} />
      <div style={titulo(tamanhoTitulo(f.linha, f.italico, 96))}>
        {f.linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {f.italico}
        </span>
      </div>
    </div>
  );
};

export const ReelFases: React.FC<ReelFasesProps> = (p) => {
  const { fps } = useVideoConfig();
  const t = p.tempos ?? T_PADRAO;
  const s = (x: number) => Math.round(x * fps);
  const dG = s(t.gancho);
  const dF = s(t.fase);
  const dC = s(t.final);
  const inicioFinal = dG + p.fases.length * dF;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Sequence durationInFrames={dG} premountFor={fps}>
        <Foto c={p.gancho} dur={dG} />
      </Sequence>
      {p.fases.map((f, i) => (
        <Sequence
          key={f.num}
          from={dG + i * dF}
          durationInFrames={dF}
          premountFor={fps}
        >
          <Foto c={f} dur={dF} />
        </Sequence>
      ))}
      <Sequence from={inicioFinal} durationInFrames={dC} premountFor={fps}>
        <Foto c={p.final} dur={dC} />
      </Sequence>
      <AbsoluteFill style={{ background: DEGRADE }} />
      <Sequence durationInFrames={dG}>
        <Gancho g={p.gancho} dur={dG} />
      </Sequence>
      {p.fases.map((f, i) => (
        <Sequence key={"t" + f.num} from={dG + i * dF} durationInFrames={dF}>
          <BlocoFase f={f} dur={dF} />
        </Sequence>
      ))}
      <Sequence from={inicioFinal} durationInFrames={dC}>
        <BlocoFinal f={p.final} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Capa (1080 × 1920): foto do gancho, gancho completo, logo PNG original pequena
export const CapaReelFases: React.FC<ReelFasesProps> = ({ gancho }) => {
  const t = tamanhoTitulo(gancho.linha, gancho.italico, 104);
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Foto c={{ ...gancho, zoom: [gancho.zoom[0], gancho.zoom[0]] }} dur={1} />
      <AbsoluteFill style={{ background: DEGRADE }} />
      <Img
        src={staticFile("marca/png/script-nude.png")}
        style={{ position: "absolute", right: 72, bottom: 250, width: 230 }}
      />
      <div style={{ position: "absolute", left: 96, right: 60, bottom: 460 }}>
        <Etiqueta texto={gancho.etiqueta} fioPronto />
        <div style={titulo(t)}>
          {gancho.linha}
          <br />
          <span style={{ fontStyle: "italic", color: COR.nude }}>
            {gancho.italico}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ——— Peça: Lista de convidados sem neura (26/11/2026) ———
// Fatos: proposta vigente 19/10/2026 (3 disparos automáticos em todos os planos; confirmação ativa
// incluída no Premium) + modelo Assessoria VIP de 13/11 (prazos). Fotos: Drive › Banco › "Equipe em ação".
export const LISTA_CONVIDADOS: ReelFasesProps = {
  gancho: {
    foto: "lista/equipe-504-conferindo.jpg",
    origem: "66% 30%",
    zoom: [1.08, 1.13],
    etiqueta: "Bastidores da Impactar",
    linha: "A lista de convidados",
    italico: "sem neura",
  },
  fases: [
    {
      num: "01",
      foto: "lista/equipe-498-prancheta.jpg",
      origem: "97% 35%",
      zoom: [1.02, 1.07],
      etiqueta: "A lista",
      linha: "Uma lista,",
      italico: "um lugar só",
      itens: [
        "Lista completa no app, meses antes",
        "Usada no save the date, convites e confirmação",
        "Restrições alimentares registradas",
      ],
    },
    {
      num: "02",
      foto: "lista/equipe-pre6-vestido.jpg",
      origem: "58% 40%",
      zoom: [1, 1.04],
      etiqueta: "Convites",
      linha: "Convite entregue,",
      italico: "prazo combinado",
      itens: [
        "Site do casamento no ar antes do save the date",
        "Convites entregues até 30 dias antes",
        "Confirmação de presença pelo site",
      ],
    },
    {
      num: "03",
      foto: "lista/equipe-77-conduzindo.jpg",
      origem: "52% 40%",
      zoom: [1.02, 1.07],
      etiqueta: "Confirmação",
      linha: "Sem cobrança",
      italico: "constrangedora",
      itens: [
        "Até 3 disparos automáticos",
        "Respostas direto na lista",
        "No Premium, a equipe contata quem não respondeu",
      ],
    },
    {
      num: "04",
      foto: "lista/equipe-143-entrada.jpg",
      origem: "60% 40%",
      zoom: [1.02, 1.07],
      etiqueta: "Número final",
      linha: "O número certo",
      italico: "para o buffet",
      itens: [
        "Lista fechada 15 dias antes",
        "Quantidades do buffet ajustadas",
        "Reservados identificados no dia",
      ],
    },
  ],
  final: {
    foto: "lista/equipe-80-com-casal.jpg",
    origem: "41% 35%",
    zoom: [1.06, 1.1],
    etiqueta: "Salva para montar a sua lista",
    linha: "Menos planilha.",
    italico: "Mais presença.",
  },
};
