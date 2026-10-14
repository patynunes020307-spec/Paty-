import { Video } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS as sans, SERIF as serif } from "./fontes";

// Cores da marca (padrão visual Impactar v6)
const AZUL = "#203F51";
const PESSEGO = "#E9CEBB";
const AREIA = "#FAF7F3";

const BRUTOS = "brutos/bastidores-semana";

// Duração total: 600 frames = 20 s a 30 fps
export const BASTIDORES_DURACAO = 600;

const entradaSaida = (frame: number, duracao: number, fps: number) =>
  interpolate(
    frame,
    [0, 0.35 * fps, duracao - 0.35 * fps, duracao],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

// Rótulo do dia, no canto superior esquerdo (fora da área da interface do Reels)
const RotuloDia: React.FC<{ texto: string; duracao: number }> = ({
  texto,
  duracao,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = entradaSaida(frame, duracao, fps);

  return (
    <Interactive.Div
      name={`Rotulo ${texto}`}
      style={{
        position: "absolute",
        top: 250,
        left: 72,
        padding: "16px 30px",
        borderRadius: 999,
        backgroundColor: "rgba(32, 63, 81, 0.88)",
        color: PESSEGO,
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 38,
        letterSpacing: 4,
        textTransform: "uppercase",
        opacity: v,
        translate: `${interpolate(v, [0, 1], [-30, 0])}px 0px`,
      }}
    >
      {texto}
    </Interactive.Div>
  );
};

// Título de abertura
const Titulo: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = entradaSaida(frame, duracao, fps);

  return (
    <Interactive.Div
      name="Titulo Bastidores"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1040,
        textAlign: "center",
        color: "#FFFFFF",
        textShadow: "0 4px 30px rgba(0,0,0,0.45)",
        opacity: v,
        translate: `0px ${interpolate(v, [0, 1], [40, 0])}px`,
      }}
    >
      <div
        style={{
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 12,
          textTransform: "uppercase",
        }}
      >
        Bastidores
      </div>
      <div
        style={{
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 132,
          lineHeight: 1,
          marginTop: 8,
        }}
      >
        da semana
      </div>
    </Interactive.Div>
  );
};

// Fechamento com o selo
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
          width: 560,
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          // Aproximação lenta e contínua, sem pulsar
          scale: interpolate(frame, [0, 3.3 * fps], [0.94, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1430,
          height: 4,
          width: 220,
          backgroundColor: PESSEGO,
          opacity: interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1470,
          color: AZUL,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: 6,
          opacity: interpolate(frame, [0.5 * fps, fps], [0, 1], {
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

export const BastidoresSemana: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {/* 1. Ter 06/10 — deck, câmera lenta 0,5x (já convertida) */}
        <TransitionSeries.Sequence durationInFrames={63} premountFor={fps}>
          <Video
            name="Deck 06/10"
            src={staticFile(`${BRUTOS}/deck-slow.mp4`)}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
          <RotuloDia texto="ter · 06/10" duracao={63} />
          <Titulo duracao={63} />
        </TransitionSeries.Sequence>

        {/* 2. Sáb 10/10 — banda, trecho A (1,33 s a 5,6 s, sem a criança) */}
        <TransitionSeries.Sequence durationInFrames={128} premountFor={fps}>
          <Video
            name="Banda A 10/10"
            src={staticFile(`${BRUTOS}/banda.mp4`)}
            trimBefore={40}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
          <RotuloDia texto="sáb · 10/10" duracao={128} />
        </TransitionSeries.Sequence>

        {/* 3. Banda, trecho B (13,07 s a 16,3 s, sem a criança) */}
        <TransitionSeries.Sequence durationInFrames={97} premountFor={fps}>
          <Video
            name="Banda B 10/10"
            src={staticFile(`${BRUTOS}/banda.mp4`)}
            trimBefore={392}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </TransitionSeries.Sequence>

        {/* 4. Seg 12/10 — noite */}
        <TransitionSeries.Sequence durationInFrames={212} premountFor={fps}>
          <Video
            name="Noite 12/10"
            src={staticFile(`${BRUTOS}/noite.mp4`)}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
          <RotuloDia texto="seg · 12/10" duracao={212} />
        </TransitionSeries.Sequence>

        {/* 5. Fechamento — 100 frames (completa 600) */}
        <TransitionSeries.Sequence durationInFrames={100} premountFor={fps}>
          <CardFinal />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
