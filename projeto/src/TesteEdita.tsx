import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS } from "./fontes";


// Teste de configuração: 5 s, tela cheia, "EDITA" entrando letra a letra.
export const TesteEdita: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letras = "EDITA".split("");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0E0E10",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.6} />
      <Interactive.Div
        name="Titulo EDITA"
        style={{
          display: "flex",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 260,
          lineHeight: 1,
          color: "#F5F1E8",
          letterSpacing: 8,
          // Aproximação lenta e contínua: evita quadro parado sem pulsar
          scale: interpolate(frame, [0, 5 * fps], [1, 1.08], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.33, 0, 0.67, 1),
          }),
        }}
      >
        {letras.map((letra, i) => {
          const entrada = spring({
            frame,
            fps,
            delay: 4 + i * 4,
            config: { damping: 200 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: entrada,
                translate: `0px ${interpolate(entrada, [0, 1], [140, 0])}px`,
              }}
            >
              {letra}
            </span>
          );
        })}
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          bottom: 760,
          height: 10,
          width: 560,
          backgroundColor: "#C9A96E",
          transformOrigin: "left center",
          scale: `${interpolate(frame, [28, 28 + fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })} 1`,
        }}
      />
    </AbsoluteFill>
  );
};
