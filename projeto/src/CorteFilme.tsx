import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS as sans, SERIF as serif } from "./fontes";
import { COR } from "./marca";

// Reel no modelo A do Guia de Publicações (Notion, 02/11/2026):
// vídeo real em tela cheia, degradê petróleo só na base, título em Cormorant com
// uma palavra-chave em itálico, um texto por vez, logo original pequena,
// 15–30 s, termina na cena (sem tela final de logo). Música entra pelo Instagram.

export const FPS = 30;
const GANCHO_SEGUNDOS = 3;
export const FINAL_SEGUNDOS = 2;

export type Frase = { kicker: string; linha: string; italico: string };

export type CorteProps = {
  arquivo: string; // em public/
  credito: string;
  // cenas do vídeo original, em segundos (só as aprovadas na medição de nitidez)
  // enquadramento = recorte vertical fixo por cena (CSS object-position); nunca segue rosto
  // arquivo na cena substitui o arquivo padrão (vídeos com vários brutos)
  cenas: {
    inicio: number;
    fim: number;
    enquadramento: string;
    arquivo?: string;
  }[];
  pretoEBranco: boolean;
  gancho: Frase;
  textos: Frase[];
};

const quadros = (c: { inicio: number; fim: number }) =>
  Math.round((c.fim - c.inicio) * FPS);

export const duracaoCorte = (p: CorteProps) =>
  p.cenas.reduce((t, c) => t + quadros(c), 0) +
  Math.round(FINAL_SEGUNDOS * FPS);

const visivel = (
  frame: number,
  duracao: number,
  fps: number,
  imediato = false,
) =>
  interpolate(
    frame,
    [0, imediato ? 0.15 * fps : 0.4 * fps, duracao - 0.4 * fps, duracao],
    [imediato ? 0.5 : 0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

// Bloco de texto das referências aprovadas: fio + etiqueta Montserrat,
// frase em Cormorant com a segunda linha em itálico nude. Alinhado à esquerda, terço inferior.
export const BlocoFrase: React.FC<{
  frase: Frase;
  duracao: number;
  imediato?: boolean;
}> = ({ frase, duracao, imediato }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = visivel(frame, duracao, fps, imediato);

  return (
    <Interactive.Div
      name="Frase"
      style={{
        position: "absolute",
        left: 96,
        right: 60,
        bottom: 470,
        opacity: v,
        translate: `0px ${interpolate(v, [0, 1], [18, 0])}px`,
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
          {frase.kicker}
        </div>
      </div>
      <div
        style={{
          color: COR.fundoClaro,
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 74,
          lineHeight: 1.08,
        }}
      >
        {frase.linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>
          {frase.italico}
        </span>
      </div>
    </Interactive.Div>
  );
};

// Fechamento como no Reel aprovado de 02/11/2026: fundo claro + logo oficial.
const Fechamento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COR.fundoClaro,
        justifyContent: "center",
        alignItems: "center",
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <Img
        src={staticFile("marca/oficial/logo-script-nude-verdeagua.jpg")}
        style={{
          width: 620,
          mixBlendMode: "multiply",
          // aproximação lenta e contínua, sem pulsar
          scale: interpolate(frame, [0, FINAL_SEGUNDOS * fps], [0.96, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};

export const CorteFilme: React.FC<CorteProps> = (props) => {
  const { fps } = useVideoConfig();
  const durFilme = props.cenas.reduce((t, c) => t + quadros(c), 0);
  const inicios = props.cenas.map((_, i) =>
    props.cenas.slice(0, i).reduce((t, c) => t + quadros(c), 0),
  );
  const durGancho = Math.round(GANCHO_SEGUNDOS * fps);
  const porTexto = Math.floor((durFilme - durGancho) / props.textos.length);

  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Sequence durationInFrames={durFilme} premountFor={fps}>
        {/* Vídeo real em tela cheia, cortes secos, recorte vertical fixo por cena */}
        {props.cenas.map((c, i) => (
          <Sequence
            key={i}
            from={inicios[i]}
            durationInFrames={quadros(c)}
            premountFor={fps}
          >
            <Video
              name={`Cena ${i + 1}`}
              src={staticFile(c.arquivo ?? props.arquivo)}
              trimBefore={Math.round(c.inicio * fps)}
              muted
              objectFit="cover"
              style={{
                width: "100%",
                height: "100%",
                objectPosition: c.enquadramento,
                filter: props.pretoEBranco ? "grayscale(1)" : undefined,
              }}
            />
          </Sequence>
        ))}
        {/* Degradê petróleo só na base */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(7,33,38,0.96) 0%, rgba(7,33,38,0.85) 25%, rgba(32,63,81,0) 58%)",
          }}
        />
        {props.credito ? (
          <div
            style={{
              position: "absolute",
              bottom: 360,
              left: 96,
              color: COR.fundoClaro,
              opacity: 0.6,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: 2,
            }}
          >
            {props.credito}
          </div>
        ) : null}
        <Sequence durationInFrames={durGancho} premountFor={fps}>
          <BlocoFrase frase={props.gancho} duracao={durGancho} imediato />
        </Sequence>
        {props.textos.map((frase, i) => (
          <Sequence
            key={i}
            from={durGancho + i * porTexto}
            durationInFrames={porTexto}
            premountFor={fps}
          >
            <BlocoFrase frase={frase} duracao={porTexto} />
          </Sequence>
        ))}
      </Sequence>
      <Sequence
        from={durFilme}
        durationInFrames={Math.round(FINAL_SEGUNDOS * fps)}
        premountFor={fps}
      >
        <Fechamento />
      </Sequence>
    </AbsoluteFill>
  );
};

const ARQUIVO = "brutos/casamento-tc/filme.mp4";
const CREDITO = "Filme: Thiago Costa Filmes";

// Tempos = segundos do vídeo original, alinhados aos cortes de cena. 15–30 s cada (com fechamento).
export const CORTES: Record<string, CorteProps> = {
  CasamentoTC1MakingOf: {
    arquivo: ARQUIVO,
    credito: CREDITO,
    cenas: [
      { inicio: 11.97, fim: 13.0, enquadramento: "50% 50%" },
      { inicio: 16.57, fim: 18.2, enquadramento: "50% 50%" },
      { inicio: 20.4, fim: 27.67, enquadramento: "50% 50%" },
      { inicio: 37.7, fim: 42.47, enquadramento: "50% 50%" },
    ],
    pretoEBranco: false,
    gancho: {
      kicker: "Dica para os noivos",
      linha: "Making of",
      italico: "sem correria.",
    },
    textos: [
      {
        kicker: "01",
        linha: "Acessórios, perfume e convite",
        italico: "num só lugar.",
      },
      {
        kicker: "02",
        linha: "No quarto da noiva,",
        italico: "só quem precisa estar.",
      },
      {
        kicker: "03",
        linha: "Uma folga no cronograma",
        italico: "antes da saída.",
      },
    ],
  },
  CasamentoTC2Entrada: {
    arquivo: ARQUIVO,
    credito: CREDITO,
    cenas: [
      { inicio: 50.1, fim: 52.93, enquadramento: "50% 50%" },
      { inicio: 64.33, fim: 70.07, enquadramento: "50% 50%" },
      { inicio: 79.77, fim: 83.43, enquadramento: "50% 50%" },
      { inicio: 87.03, fim: 92.4, enquadramento: "50% 50%" },
    ],
    pretoEBranco: true,
    gancho: {
      kicker: "Bastidores da Impactar",
      linha: "Antes de cada",
      italico: "entrada.",
    },
    textos: [
      {
        kicker: "01",
        linha: "Ordem, música e sinal",
        italico: "combinados antes.",
      },
      {
        kicker: "02",
        linha: "Conferimos quem está pronto",
        italico: "antes de abrir a porta.",
      },
      { kicker: "03", linha: "Para que vocês", italico: "só vivam o momento." },
    ],
  },
  CasamentoTC3Aliancas: {
    arquivo: ARQUIVO,
    credito: CREDITO,
    cenas: [
      { inicio: 92.4, fim: 98.9, enquadramento: "50% 50%" },
      { inicio: 98.9, fim: 105.37, enquadramento: "50% 50%" },
      { inicio: 117.1, fim: 124.1, enquadramento: "50% 50%" },
    ],
    pretoEBranco: true,
    gancho: {
      kicker: "Erro e prevenção",
      linha: "Quem leva",
      italico: "as alianças?",
    },
    textos: [
      {
        kicker: "01",
        linha: "Definam antes quem guarda",
        italico: "e quem entrega.",
      },
      {
        kicker: "02",
        linha: "Combinem o momento",
        italico: "e onde elas ficam.",
      },
      {
        kicker: "03",
        linha: "No dia, conferimos",
        italico: "antes de começar.",
      },
    ],
  },
  CasamentoTC4Brinde: {
    arquivo: ARQUIVO,
    credito: CREDITO,
    cenas: [
      { inicio: 140.8, fim: 150.87, enquadramento: "50% 50%" },
      { inicio: 150.87, fim: 152.93, enquadramento: "50% 50%" },
      { inicio: 152.93, fim: 155.43, enquadramento: "50% 50%" },
      { inicio: 155.43, fim: 158.63, enquadramento: "50% 50%" },
    ],
    pretoEBranco: false,
    gancho: {
      kicker: "Bastidores da Impactar",
      linha: "Um brinde",
      italico: "no tempo certo.",
    },
    textos: [
      {
        kicker: "01",
        linha: "Taças servidas,",
        italico: "fotografia posicionada.",
      },
      {
        kicker: "02",
        linha: "Quando vocês chegam,",
        italico: "tudo está pronto.",
      },
    ],
  },
  // Ensaio da cerimônia — 06/04/2025 (vídeos de celular da Paty, 1080×1920)
  Ensaio1AntesDoGrandeDia: {
    arquivo: "brutos/ensaio/153521913.mp4",
    credito: "",
    cenas: [
      {
        inicio: 2.0,
        fim: 8.0,
        enquadramento: "50% 50%",
        arquivo: "brutos/ensaio/153521913.mp4",
      },
      {
        inicio: 0.4,
        fim: 4.4,
        enquadramento: "50% 50%",
        arquivo: "brutos/ensaio/152006934.mp4",
      },
      {
        inicio: 3.0,
        fim: 8.5,
        enquadramento: "50% 50%",
        arquivo: "brutos/ensaio/153820775.mp4",
      },
      {
        inicio: 1.0,
        fim: 5.5,
        enquadramento: "50% 50%",
        arquivo: "brutos/ensaio/154637375.mp4",
      },
      {
        inicio: 19.0,
        fim: 25.0,
        enquadramento: "50% 50%",
        arquivo: "brutos/ensaio/155522387.mp4",
      },
      {
        inicio: 0.0,
        fim: 1.45,
        enquadramento: "50% 50%",
        arquivo: "brutos/ensaio/155554714.mp4",
      },
    ],
    pretoEBranco: false,
    gancho: {
      kicker: "Bastidores da Impactar",
      linha: "Antes do grande dia,",
      italico: "um ensaio.",
    },
    textos: [
      { kicker: "01", linha: "Quem entra,", italico: "com quem e quando." },
      { kicker: "02", linha: "Cada passo", italico: "já foi dado antes." },
      { kicker: "03", linha: "No dia,", italico: "só resta sentir." },
    ],
  },
};
