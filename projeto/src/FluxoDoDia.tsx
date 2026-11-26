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

// Reel "Fluxo do dia" (26/11/2026) — versão em vídeo do carrossel aprovado em conteúdo.
// Foto real (cerimônia Renata e Pedro, crédito Celebrizar) em tela cheia, colorida
// (pedido da Paty em 26/11: imagem mais viva e realista, sobrepõe o P&B do Guia),
// recortes diferentes por fase com aproximação lenta 100% → 105% (um sentido só).
// Animações só da lista do Guia (seção 2B): digitação, fade + subida curta,
// fio desenhado, check desenhado um por vez. Sem som; música pela biblioteca do Instagram.

export const FPS = 30;
const FOTO = "fluxo/cerimonia-renata-pedro.jpg";
const DEGRADE =
  "linear-gradient(to top, rgba(7,33,38,0.92) 0%, rgba(7,33,38,0.78) 30%, rgba(7,33,38,0.35) 46%, rgba(7,33,38,0) 60%)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);

type Fase = {
  num: string;
  etiqueta: string;
  linha: string;
  italico: string;
  itens: string[];
  origem: string; // ponto de interesse do recorte
};

export const FASES: Fase[] = [
  {
    num: "01",
    etiqueta: "Antes de vocês chegarem",
    linha: "Tudo conferido",
    italico: "antes da entrada",
    itens: [
      "Chegada da equipe ao local",
      "Montagem e fornecedores conferidos",
      "Cronograma alinhado com cada equipe",
    ],
    origem: "30% 100%",
  },
  {
    num: "02",
    etiqueta: "Cerimônia",
    linha: "Cada entrada",
    italico: "no tempo certo",
    itens: [
      "Cortejo organizado e posicionado",
      "Sinal combinado para música e entrada",
      "Cerimônia acompanhada de perto",
    ],
    origem: "55% 100%",
  },
  {
    num: "03",
    etiqueta: "Recepção",
    linha: "A festa segue",
    italico: "o roteiro de vocês",
    itens: [
      "Entrada dos noivos na recepção",
      "Cada momento na hora combinada",
      "Fornecedores alinhados durante a festa",
    ],
    origem: "85% 100%",
  },
  {
    num: "04",
    etiqueta: "Encerramento",
    linha: "Presença até",
    italico: "o fim da festa",
    itens: [
      "Despedida dos convidados",
      "Últimos alinhamentos com fornecedores",
      "Encerramento do evento",
    ],
    origem: "15% 100%",
  },
];

// tempos em segundos
const T_GANCHO = 3.5;
const T_FASE = 5;
const T_CTA = 3.5;
export const DURACAO_FLUXO = Math.round(
  (T_GANCHO + FASES.length * T_FASE + T_CTA) * FPS,
);

// Foto em tela cheia: aproximação lenta e contínua, sem upscale além do arquivo
// (cover = 75% do original; zoom máximo 1,32 mantém ≥ 1 px de origem por px).
const Foto: React.FC<{ de: number; ate: number; origem: string; dur: number }> = ({
  de,
  ate,
  origem,
  dur,
}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, dur], [de, ate], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(FOTO)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: origem,
          filter: "contrast(1.04) saturate(1.05)",
          transformOrigin: origem,
          scale: String(s),
        }}
      />
    </AbsoluteFill>
  );
};

const Fio: React.FC<{ inicio: number }> = ({ inicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = interpolate(frame - inicio, [0, 0.5 * fps], [0, 64], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{ width: w, height: 3, backgroundColor: COR.nude }} />;
};

const Etiqueta: React.FC<{ texto: string }> = ({ texto }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 26 }}>
    <Fio inicio={0} />
    <div
      style={{
        color: COR.nude,
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: 6,
        textTransform: "uppercase",
      }}
    >
      {texto}
    </div>
  </div>
);

// 1) Gancho digitado (~25 letras/s), cursor fino parado
const Gancho: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = "Quem cuida do dia";
  const l2 = "enquanto você vive";
  const n = Math.floor(frame / (fps / 25));
  const a = l1.slice(0, Math.min(n, l1.length));
  const b = l2.slice(0, Math.max(0, n - l1.length));
  const digitando = n < l1.length + l2.length;
  const saida = interpolate(frame, [dur - 0.3 * fps, dur], [1, 0], clamp);
  const cursor = <span style={{ color: COR.nude, fontStyle: "normal" }}>|</span>;
  return (
    <div style={{ position: "absolute", left: 96, right: 60, bottom: 460, opacity: saida }}>
      <Etiqueta texto="Bastidores da Impactar" />
      <div
        style={{
          color: COR.fundoClaro,
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 104,
          lineHeight: 1.05,
          minHeight: 2 * 104 * 1.05,
        }}
      >
        {a}
        {digitando && n <= l1.length ? cursor : null}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {b}
          {digitando && n > l1.length ? cursor : null}
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

// 2) Fase: etiqueta + título entram (fade + subida), depois um check por vez
const BlocoFase: React.FC<{ f: Fase; dur: number }> = ({ f, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = interpolate(frame, [0, 0.45 * fps], [0, 1], { ...clamp, easing: suave });
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
          color: COR.fundoClaro,
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 96,
          lineHeight: 1.05,
          marginBottom: 40,
          textShadow: "0 2px 18px rgba(7,33,38,0.5)",
        }}
      >
        {f.linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>{f.italico}</span>
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

// 3) Final sobre a cena (sem tela final e sem logo — decisão de 20/11/2026)
const BlocoCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = interpolate(frame, [0, 0.45 * fps], [0, 1], { ...clamp, easing: suave });
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
      <Etiqueta texto="Manda para quem vai casar com você" />
      <div
        style={{
          color: COR.fundoClaro,
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 96,
          lineHeight: 1.05,
        }}
      >
        Vocês vivem o dia.
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          A gente conduz o fluxo.
        </span>
      </div>
    </div>
  );
};

export const FluxoDoDia: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const dG = s(T_GANCHO);
  const dF = s(T_FASE);
  const dC = s(T_CTA);
  const inicioCTA = dG + FASES.length * dF;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Sequence durationInFrames={dG} premountFor={fps}>
        <Foto de={1} ate={1.05} origem="50% 45%" dur={dG} />
      </Sequence>
      {FASES.map((f, i) => (
        <Sequence key={f.num} from={dG + i * dF} durationInFrames={dF} premountFor={fps}>
          <Foto de={1.22} ate={1.28} origem={f.origem} dur={dF} />
        </Sequence>
      ))}
      <Sequence from={inicioCTA} durationInFrames={dC} premountFor={fps}>
        <Foto de={1.05} ate={1.1} origem="50% 45%" dur={dC} />
      </Sequence>
      <AbsoluteFill style={{ background: DEGRADE }} />
      <Sequence durationInFrames={dG}>
        <Gancho dur={dG} />
      </Sequence>
      {FASES.map((f, i) => (
        <Sequence key={"t" + f.num} from={dG + i * dF} durationInFrames={dF}>
          <BlocoFase f={f} dur={dF} />
        </Sequence>
      ))}
      <Sequence from={inicioCTA} durationInFrames={dC}>
        <BlocoCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

// Capa do Reel: foto real protagonista, gancho, degradê na base, logo PNG original pequena
export const CapaFluxo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
    <Foto de={1} ate={1} origem="50% 45%" dur={1} />
    <AbsoluteFill style={{ background: DEGRADE }} />
    <Img
      src={staticFile("marca/png/script-nude.png")}
      style={{ position: "absolute", right: 72, bottom: 250, width: 230 }}
    />
    <div style={{ position: "absolute", left: 96, right: 60, bottom: 460 }}>
      <Etiqueta texto="Bastidores da Impactar" />
      <div
        style={{
          color: COR.fundoClaro,
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 104,
          lineHeight: 1.05,
        }}
      >
        Quem cuida do dia
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>enquanto você vive</span>
      </div>
    </div>
  </AbsoluteFill>
);
