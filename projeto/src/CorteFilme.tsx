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

// Cores da marca (padrão visual Impactar v6 — confirmar se ainda é o vigente)
const AZUL = "#203F51";
const PESSEGO = "#E9CEBB";
const AREIA = "#FAF7F3";

const FILME = "brutos/casamento-tc/filme.mp4";
// Fonte 854×374 → largura cheia 1080 px (ampliação de ~1,26x, sem recorte)
const FAIXA_ALTURA = Math.round((1080 * 374) / 854);
const FAIXA_TOPO = 700;

export const FPS = 30;
export const FINAL_SEGUNDOS = 2.5;

export type CorteProps = {
  formato: string;
  titulo: string;
  // trecho do filme original, em segundos
  inicio: number;
  fim: number;
  cartoes: string[];
};

export const duracaoCorte = (p: CorteProps) =>
  Math.round((p.fim - p.inicio + FINAL_SEGUNDOS) * FPS);

const suave = (frame: number, de: number, ate: number, fps: number) =>
  interpolate(frame, [de, de + 0.4 * fps, ate - 0.4 * fps, ate], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const Cartao: React.FC<{ texto: string; duracao: number }> = ({
  texto,
  duracao,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = suave(frame, 0, duracao, fps);

  return (
    <Interactive.Div
      name="Cartao"
      style={{
        position: "absolute",
        top: FAIXA_TOPO + FAIXA_ALTURA + 90,
        left: 90,
        right: 90,
        color: AZUL,
        fontFamily: sans,
        fontWeight: 500,
        fontSize: 50,
        lineHeight: 1.38,
        textAlign: "center",
        opacity: v,
        translate: `0px ${interpolate(v, [0, 1], [24, 0])}px`,
      }}
    >
      {texto}
    </Interactive.Div>
  );
};

const CardFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: AREIA,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={staticFile("marca/selo-impactar.png")}
        style={{
          width: 520,
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          // Aproximação lenta e contínua, sem pulsar
          scale: interpolate(frame, [0, FINAL_SEGUNDOS * fps], [0.95, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1420,
          color: AZUL,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: 6,
          opacity: interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        @impactarcerimonial
      </div>
    </AbsoluteFill>
  );
};

export const CorteFilme: React.FC<CorteProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durFilme = Math.round((props.fim - props.inicio) * fps);
  const porCartao = Math.floor(durFilme / props.cartoes.length);
  const entrada = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: AREIA }}>
      <Sequence durationInFrames={durFilme} premountFor={fps}>
        {/* Rótulo do formato */}
        <div
          style={{
            position: "absolute",
            top: 300,
            left: 0,
            right: 0,
            textAlign: "center",
            color: AZUL,
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            opacity: entrada,
          }}
        >
          {props.formato}
        </div>
        {/* Título (capa) */}
        <div
          style={{
            position: "absolute",
            top: 360,
            left: 70,
            right: 70,
            textAlign: "center",
            color: AZUL,
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 96,
            lineHeight: 1.05,
            opacity: entrada,
            translate: `0px ${interpolate(entrada, [0, 1], [30, 0])}px`,
          }}
        >
          {props.titulo}
        </div>
        <div
          style={{
            position: "absolute",
            top: FAIXA_TOPO - 28,
            left: 470,
            right: 470,
            height: 4,
            backgroundColor: PESSEGO,
            opacity: entrada,
          }}
        />
        {/* Filme inteiro em faixa, sem recorte */}
        <Video
          name="Filme"
          src={staticFile(FILME)}
          trimBefore={Math.round(props.inicio * fps)}
          muted
          premountFor={fps}
          style={{
            position: "absolute",
            top: FAIXA_TOPO,
            left: 0,
            width: 1080,
            height: FAIXA_ALTURA,
          }}
        />
        {/* Crédito da produtora */}
        <div
          style={{
            position: "absolute",
            top: FAIXA_TOPO + FAIXA_ALTURA + 18,
            right: 30,
            color: AZUL,
            opacity: 0.6,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: 2,
          }}
        >
          Filme: Thiago Costa Filmes
        </div>
        {props.cartoes.map((texto, i) => (
          <Sequence
            key={i}
            from={i * porCartao}
            durationInFrames={porCartao}
            premountFor={fps}
          >
            <Cartao texto={texto} duracao={porCartao} />
          </Sequence>
        ))}
      </Sequence>
      <Sequence
        from={durFilme}
        durationInFrames={Math.round(FINAL_SEGUNDOS * fps)}
        premountFor={fps}
      >
        <CardFinal />
      </Sequence>
    </AbsoluteFill>
  );
};

// Os 4 cortes (tempos = segundos do vídeo original, alinhados aos cortes de cena)
export const CORTES: Record<string, CorteProps> = {
  CasamentoTC1MakingOf: {
    formato: "Dica para os noivos",
    titulo: "Making of sem correria",
    inicio: 11.97,
    fim: 42.47,
    cartoes: [
      "Separe acessórios, perfume e convite num só lugar antes de a equipe de foto chegar.",
      "Defina quem fica no quarto da noiva. Menos gente, menos interrupção.",
      "Deixe uma folga no cronograma antes da saída para a cerimônia.",
    ],
  },
  CasamentoTC2Entrada: {
    formato: "Bastidor explicado",
    titulo: "O que acontece antes de cada entrada",
    inicio: 47.13,
    fim: 79.77,
    cartoes: [
      "Cada entrada tem ordem, música e sinal combinados com antecedência.",
      "Antes de abrir a porta, a assessoria confere se todos estão prontos e posicionados.",
      "Assim o casal e a família só precisam viver o momento.",
    ],
  },
  CasamentoTC3Aliancas: {
    formato: "Erro e prevenção",
    titulo: "Quem leva as alianças?",
    inicio: 83.43,
    fim: 111.83,
    cartoes: [
      "Um detalhe que costuma ficar para a última hora: quem guarda e quem entrega as alianças.",
      "Defina antes: quem leva, em que momento entrega e onde elas ficam até lá.",
      "No dia, as alianças são conferidas antes de a cerimônia começar.",
    ],
  },
  CasamentoTC4Brinde: {
    formato: "Bastidor explicado",
    titulo: "Um brinde no tempo certo",
    inicio: 140.8,
    fim: 158.63,
    cartoes: [
      "Taças servidas, fotografia posicionada e casal avisado antes.",
      "Quando os noivos chegam à mesa, o momento já está pronto para acontecer.",
    ],
  },
};
