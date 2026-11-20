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
export type StoryProps = {
  arquivo: string;
  inicio: number;
  frase: Frase;
  enquadramento?: string;
};

export const Story: React.FC<StoryProps> = ({
  arquivo,
  inicio,
  frase,
  enquadramento,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Video
        name="Cena"
        src={staticFile(arquivo)}
        trimBefore={Math.round(inicio * fps)}
        muted
        objectFit="cover"
        style={{
          width: "100%",
          height: "100%",
          objectPosition: enquadramento ?? "50% 50%",
        }}
      />
      <AbsoluteFill style={{ background: DEGRADE }} />
      <Sequence durationInFrames={durationInFrames} premountFor={fps}>
        <BlocoFrase frase={frase} duracao={durationInFrames} imediato />
      </Sequence>
    </AbsoluteFill>
  );
};

// Capa do Reel — modelo A "Foto protagonista" (Guia, 03/11/2026).
export type CapaProps = {
  arquivo: string;
  inicio: number;
  enquadramento: string;
  frase: Frase;
  // posição da logo (precisa cair sobre área clara: a logo é JPG com fundo branco)
  logo?: { top: number; left: number; width: number };
  bottom?: number; // altura do bloco de texto (padrão 520)
};

export const CAPA_ENSAIO: CapaProps = {
  arquivo: "brutos/ensaio/153820775.mp4",
  inicio: 5,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Bastidores da Impactar",
    linha: "Antes do grande dia,",
    italico: "um ensaio.",
  },
};

export const CAPA_DAMARYS: CapaProps = {
  arquivo: "brutos/damaris/filme.mp4",
  inicio: 20,
  enquadramento: "41% 50%",
  frase: {
    kicker: "Damarys & Alex",
    linha: "Juntos,",
    italico: "em cada passo.",
  },
};

export const CAPA_ASSESSORA: CapaProps = {
  arquivo: "brutos/lote/IMG_9998.mp4",
  inicio: 1,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Bastidores da Impactar",
    linha: "A assessora apareceu pouco.",
    italico: "O que ela fazia?",
  },
};

export const CAPA_MONTAGEM: CapaProps = {
  arquivo: "brutos/lote/31f6a747.mp4",
  inicio: 19,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Bastidores da Impactar",
    linha: "Dia de",
    italico: "montagem.",
  },
};

export const CAPA_ANTES_CONVIDADOS: CapaProps = {
  arquivo: "brutos/lote/IMG_2303_lento.mp4",
  inicio: 1.5,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Bastidores da Impactar",
    linha: "Antes dos convidados,",
    italico: "a gente já está aqui.",
  },
  logo: { top: 70, left: 60, width: 300 },
};

export const CAPA_PADRINHOS: CapaProps = {
  arquivo: "brutos/diario/8017.mp4",
  inicio: 4.5,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Bastidores da Impactar",
    linha: "Antes de os padrinhos",
    italico: "entrarem.",
  },
  logo: { top: 90, left: 60, width: 300 },
};

export const CAPA_CAUDA: CapaProps = {
  arquivo: "brutos/diario/8054.mp4",
  inicio: 3.0,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Bastidores da Impactar",
    linha: "Ninguém vê,",
    italico: "mas alguém arruma a cauda.",
  },
  logo: { top: 6, left: 560, width: 250 },
};

export const CAPA_DIARIO: CapaProps = {
  arquivo: "brutos/diario/7919.mp4",
  inicio: 6.5,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Das 14h às 19h33",
    linha: "Um casamento",
    italico: "pelos bastidores.",
  },
  logo: { top: 10, left: 760, width: 290 },
};

export const CAPA_ROTEIRO: CapaProps = {
  arquivo: "brutos/diario/8030.mp4",
  inicio: 0.5,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Enquanto todos olham o altar",
    linha: "A gente olha",
    italico: "para o roteiro.",
  },
  logo: { top: 60, left: 700, width: 300 },
};

export const CAPA_ALIANCA: CapaProps = {
  arquivo: "brutos/l20d/4112.mp4",
  inicio: 9.0,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Bastidores da Impactar",
    linha: "Até a aliança",
    italico: "tem ensaio.",
  },
  logo: { top: 120, left: 380, width: 320 },
};

export const CAPA_ULTIMA_VOLTA: CapaProps = {
  arquivo: "brutos/l20d/IMG_1291_lento.mp4",
  inicio: 2.0,
  enquadramento: "50% 50%",
  frase: {
    kicker: "Bastidores da Impactar",
    linha: "A última volta",
    italico: "antes de abrir as portas.",
  },
  logo: { top: 60, left: 60, width: 300 },
};

export const Capa: React.FC<CapaProps> = ({
  arquivo,
  inicio,
  enquadramento,
  frase,
  logo,
  bottom = 520,
}) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      <Video
        name="Foto"
        src={staticFile(arquivo)}
        trimBefore={Math.round(inicio * fps)}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%", objectPosition: enquadramento }}
      />
      <AbsoluteFill style={{ background: DEGRADE }} />
      <Img
        src={staticFile("marca/oficial/logo-script-nude-verdeagua.jpg")}
        style={{
          position: "absolute",
          top: logo?.top ?? 120,
          left: logo?.left ?? 380,
          width: logo?.width ?? 320,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 60,
          bottom,
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
            {frase.kicker}
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
          {frase.linha}
          <br />
          <span style={{ fontStyle: "italic", color: COR.nude }}>
            {frase.italico}
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
  StoryDamarys1: {
    arquivo: "brutos/damaris/filme.mp4",
    inicio: 3.0,
    enquadramento: "35% 50%",
    frase: {
      kicker: "Casamento real",
      linha: "Ela só precisou",
      italico: "respirar.",
    },
  },
  StoryDamarys2: {
    arquivo: "brutos/damaris/filme.mp4",
    inicio: 13.4,
    enquadramento: "65% 50%",
    frase: {
      kicker: "Enquete",
      linha: "Carro clássico",
      italico: "ou moderno?",
    },
  },
  StoryDamarys3: {
    arquivo: "brutos/damaris/filme.mp4",
    inicio: 44.35,
    enquadramento: "46% 50%",
    frase: {
      kicker: "No perfil",
      linha: "Veja o Reel de",
      italico: "Damarys & Alex.",
    },
  },
  // Casamento 09/08/2025 — fotos depois do sim (enquete) e pirulito
  StoryFotos1: {
    arquivo: "brutos/diario/8104.mp4",
    inicio: 0,
    frase: {
      kicker: "Depois do sim",
      linha: "Quem organiza",
      italico: "as fotos?",
    },
  },
  StoryFotos2: {
    arquivo: "brutos/diario/8107.mp4",
    inicio: 1.5,
    frase: {
      kicker: "Bastidores da Impactar",
      linha: "Cada grupo,",
      italico: "na hora certa.",
    },
  },
  StoryFotos3: {
    arquivo: "brutos/diario/8104.mp4",
    inicio: 4.3,
    frase: {
      kicker: "Enquete",
      linha: "Vocês já fizeram a lista",
      italico: "de fotos com a família?",
    },
  },
  StoryPirulito: {
    arquivo: "brutos/diario/8045.mp4",
    inicio: 0.1,
    frase: {
      kicker: "Na pochete da cerimonialista",
      linha: "Tem até pirulito",
      italico: "para acalmar uma criança.",
    },
  },
};
