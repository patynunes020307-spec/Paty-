import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIF } from "./fontes";
import { COR } from "./marca";

// TESTE DE ESTILO (24/11/2026) — inspirado na linguagem da referência enviada pela Paty
// (título serifado grande, legenda acompanhando a fala, tela dividida), com a identidade
// da Impactar. Não é mudança do Guia. Voz original a 1,0x, sem música e sem SFX.
// Bruto: IMG_4362 (cópia H.264 em public/brutos/teste-4362/).
const BRUTO = "brutos/teste-4362/IMG_4362.mp4";
export const TESTE_ESTILO_DURACAO = 162; // 70 + 92 quadros (5,4 s)
const SPLIT_INI = 70; // "o que está pendente"
const SPLIT_FIM = 106; // "e o que ainda..." volta para a tela cheia

// Quadros já no tempo final (silêncios cortados, 1,0x).
const PALAVRAS: { t: string; de: number }[] = [
  { t: "Nele,", de: 2 }, { t: "você", de: 13 },
  { t: "acompanha", de: 27 }, { t: "o", de: 40 }, { t: "que", de: 42 },
  { t: "já", de: 47 }, { t: "foi", de: 53 }, { t: "feito,", de: 60 },
  { t: "o", de: 71 }, { t: "que", de: 73 }, { t: "está", de: 79 },
  { t: "pendente", de: 89 },
  { t: "e", de: 106 }, { t: "o", de: 107 }, { t: "que", de: 110 }, { t: "ainda", de: 116 },
  { t: "precisa", de: 127 }, { t: "da", de: 132 },
  { t: "sua", de: 135 }, { t: "atenção.", de: 139 },
];
// Páginas de 1 a 3 palavras (índices em PALAVRAS)
const PAGINAS: [number, number][] = [
  [0, 1], [2, 4], [5, 7], [8, 10], [11, 11], [12, 15], [16, 17], [18, 19],
];

const entrada = (frame: number, de: number, fps: number) =>
  interpolate(frame - de, [0, 0.45 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const Legenda: React.FC<{ top: number }> = ({ top }) => {
  const frame = useCurrentFrame();
  const pagina = [...PAGINAS].reverse().find(([i]) => frame >= PALAVRAS[i].de);
  if (!pagina) return null;
  const [ini, fim] = pagina;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 58,
        color: "#FFFFFF",
        textShadow: "0 2px 12px rgba(7,33,38,0.6)",
      }}
    >
      {PALAVRAS.slice(ini, fim + 1).map((p, k) => {
        const falada = frame >= p.de;
        const atual =
          falada && (ini + k === fim || frame < PALAVRAS[ini + k + 1].de);
        return (
          <span key={k} style={{ color: atual ? COR.nude : "#FFFFFF" }}>
            {k > 0 ? " " : ""}
            {p.t}
          </span>
        );
      })}
    </div>
  );
};

// Título acima da cabeça: linha clara + palavra-chave em itálico nude.
const Titulo: React.FC<{ de: number; linha: string; italico: string }> = ({
  de,
  linha,
  italico,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = entrada(frame, de, fps);
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: SERIF,
        color: "#FFFFFF",
        lineHeight: 0.95,
        opacity: p,
        translate: `0px ${interpolate(p, [0, 1], [26, 0])}px`,
        textShadow: "0 2px 18px rgba(7,33,38,0.45)",
      }}
    >
      <div style={{ fontSize: 84, fontWeight: 500 }}>{linha}</div>
      <div style={{ fontSize: 150, fontWeight: 500, fontStyle: "italic", color: COR.nude }}>
        {italico}
      </div>
    </div>
  );
};

const TelaDividida: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fio = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const p = entrada(frame, 89 - SPLIT_INI, fps);
  return (
    <AbsoluteFill style={{ height: 960, backgroundColor: COR.petroleo }}>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 70 * fio, height: 2, backgroundColor: COR.nude }} />
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: 9,
              color: COR.areia,
            }}
          >
            O QUE ESTÁ
          </div>
          <div style={{ width: 70 * fio, height: 2, backgroundColor: COR.nude }} />
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 210,
            lineHeight: 1,
            color: COR.nude,
            opacity: p,
            translate: `0px ${interpolate(p, [0, 1], [26, 0])}px`,
          }}
        >
          pendente
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TesteEstiloRef: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dividida = frame >= SPLIT_INI && frame < SPLIT_FIM;

  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Sequence name="Frase 1" durationInFrames={70} premountFor={fps}>
        <Video
          src={staticFile(BRUTO)}
          trimBefore={41}
          trimAfter={111}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </Sequence>
      <Sequence name="Frase 2" from={70} durationInFrames={92} premountFor={fps}>
        <AbsoluteFill
          style={
            dividida ? { top: 960, height: 960 } : { top: 0, height: 1920 }
          }
        >
          <Video
            src={staticFile(BRUTO)}
            trimBefore={124}
            trimAfter={216}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
              objectPosition: dividida ? "50% 20%" : "50% 50%",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence name="Título 1" from={42} durationInFrames={SPLIT_INI - 42}>
        <Titulo de={0} linha="já foi" italico="feito" />
      </Sequence>
      <Sequence name="Tela dividida" from={SPLIT_INI} durationInFrames={SPLIT_FIM - SPLIT_INI}>
        <TelaDividida />
      </Sequence>
      <Sequence name="Título 2" from={116}>
        <Titulo de={0} linha="precisa da sua" italico="atenção" />
      </Sequence>

      <Legenda top={dividida ? 1000 : 1230} />
    </AbsoluteFill>
  );
};
