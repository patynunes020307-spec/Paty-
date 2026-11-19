import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { BlocoFrase, Frase } from "./CorteFilme";
import { SANS as sans, SERIF as serif } from "./fontes";
import { COR } from "./marca";

const DEGRADE =
  "linear-gradient(to top, rgba(7,33,38,0.96) 0%, rgba(7,33,38,0.85) 25%, rgba(32,63,81,0) 58%)";

// Story: uma cena real em tela cheia + uma frase (máx. 2 linhas, Guia).
export type StoryProps = { arquivo: string; inicio: number; frase: Frase };

export const Story: React.FC<StoryProps> = ({ arquivo, inicio, frase }) => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Video
        name="Cena"
        src={staticFile(arquivo)}
        trimBefore={Math.round(inicio * fps)}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
      <AbsoluteFill style={{ background: DEGRADE }} />
      <Sequence durationInFrames={durationInFrames} premountFor={fps}>
        <BlocoFrase frase={frase} duracao={durationInFrames} imediato />
      </Sequence>
    </AbsoluteFill>
  );
};

// Capa do Reel — modelo A "Foto protagonista" (Guia, 03/11/2026).
export const CapaEnsaio: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Video
        name="Foto"
        src={staticFile("brutos/ensaio/153820775.mp4")}
        trimBefore={Math.round(5 * fps)}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
      <AbsoluteFill style={{ background: DEGRADE }} />
      <Img
        src={staticFile("marca/oficial/logo-script-nude-verdeagua.jpg")}
        style={{
          position: "absolute",
          top: 120,
          left: 380,
          width: 320,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 60,
          bottom: 520,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginBottom: 30,
          }}
        >
          <div style={{ width: 64, height: 3, backgroundColor: COR.nude }} />
          <div
            style={{
              color: COR.nude,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Bastidores da Impactar
          </div>
        </div>
        <div
          style={{
            color: COR.fundoClaro,
            fontFamily: serif,
            fontWeight: 500,
            fontSize: 112,
            lineHeight: 1.04,
          }}
        >
          Antes do grande dia,
          <br />
          <span style={{ fontStyle: "italic", color: COR.nude }}>
            um ensaio.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const STORIES: Record<string, StoryProps> = {
  StoryEnsaio1: {
    arquivo: "brutos/ensaio/153521913.mp4",
    inicio: 10,
    frase: {
      kicker: "Bastidores da Impactar",
      linha: "Já viu um ensaio",
      italico: "de casamento?",
    },
  },
  StoryEnsaio2: {
    arquivo: "brutos/ensaio/153820775.mp4",
    inicio: 3,
    frase: {
      kicker: "Ensaio",
      linha: "Cada par aprende",
      italico: "quando entrar.",
    },
  },
  StoryEnsaio3: {
    arquivo: "brutos/ensaio/155522387.mp4",
    inicio: 19,
    frase: { kicker: "Enquete", linha: "Vocês vão fazer", italico: "ensaio?" },
  },
  StoryEnsaio4: {
    arquivo: "brutos/ensaio/154637375.mp4",
    inicio: 1,
    frase: { kicker: "No perfil", linha: "Veja o Reel", italico: "do ensaio." },
  },
};
