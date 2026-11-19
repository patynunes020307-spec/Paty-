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
const GANCHO_SEGUNDOS = 3.5;

export type CorteProps = {
  arquivo: string; // em public/
  credito: string;
  // trecho do vídeo original, em segundos
  inicio: number;
  fim: number;
  // enquadramento fixo do recorte vertical (CSS object-position); nunca segue rosto
  enquadramento: string;
  pretoEBranco: boolean;
  gancho: { antes: string; italico: string; depois: string };
  textos: string[];
};

export const duracaoCorte = (p: CorteProps) =>
  Math.round((p.fim - p.inicio) * FPS);

const visivel = (frame: number, duracao: number, fps: number, entradaImediata = false) =>
  interpolate(
    frame,
    [0, entradaImediata ? 0.15 * fps : 0.35 * fps, duracao - 0.35 * fps, duracao],
    [entradaImediata ? 0.6 : 0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

// Área de texto: acima da interface do Reels (legenda/botões ficam abaixo de ~1560 px)
const TEXTO_BASE = 460;

const Gancho: React.FC<{ gancho: CorteProps["gancho"]; duracao: number }> = ({
  gancho,
  duracao,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = visivel(frame, duracao, fps, true);

  return (
    <Interactive.Div
      name="Gancho"
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: TEXTO_BASE,
        color: COR.fundoClaro,
        fontFamily: serif,
        fontWeight: 600,
        fontSize: 104,
        lineHeight: 1.04,
        textAlign: "center",
        opacity: v,
        translate: `0px ${interpolate(v, [0, 1], [20, 0])}px`,
      }}
    >
      {gancho.antes}
      <span style={{ fontStyle: "italic", fontWeight: 500, color: COR.nude }}>
        {gancho.italico}
      </span>
      {gancho.depois}
    </Interactive.Div>
  );
};

const Texto: React.FC<{ texto: string; duracao: number }> = ({ texto, duracao }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = visivel(frame, duracao, fps);

  return (
    <Interactive.Div
      name="Texto"
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        bottom: TEXTO_BASE,
        color: COR.fundoClaro,
        fontFamily: sans,
        fontWeight: 500,
        fontSize: 50,
        lineHeight: 1.36,
        textAlign: "center",
        opacity: v,
        translate: `0px ${interpolate(v, [0, 1], [20, 0])}px`,
      }}
    >
      {texto}
    </Interactive.Div>
  );
};

export const CorteFilme: React.FC<CorteProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const durGancho = Math.round(GANCHO_SEGUNDOS * fps);
  const porTexto = Math.floor((durationInFrames - durGancho) / props.textos.length);

  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {/* Vídeo real em tela cheia, recorte vertical fixo */}
      <Video
        name="Filme"
        src={staticFile(props.arquivo)}
        trimBefore={Math.round(props.inicio * fps)}
        muted
        premountFor={fps}
        objectFit="cover"
        style={{
          width: "100%",
          height: "100%",
          objectPosition: props.enquadramento,
          filter: props.pretoEBranco ? "grayscale(1)" : undefined,
        }}
      />
      {/* Degradê petróleo só na base */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(7,33,38,0.92) 0%, rgba(32,63,81,0.78) 22%, rgba(32,63,81,0) 48%)",
        }}
      />
      {/* Logo original, pequena (arquivo oficial — trocar pelo do Drive quando anexado) */}
      <Img
        src={staticFile("marca/logo-impactar.png")}
        style={{ position: "absolute", top: 230, left: 72, width: 150 }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 330,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COR.fundoClaro,
          opacity: 0.7,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: 2,
        }}
      >
        {props.credito}
      </div>

      <Sequence durationInFrames={durGancho} premountFor={fps}>
        <Gancho gancho={props.gancho} duracao={durGancho} />
      </Sequence>
      {props.textos.map((texto, i) => (
        <Sequence
          key={i}
          from={durGancho + i * porTexto}
          durationInFrames={porTexto}
          premountFor={fps}
        >
          <Texto texto={texto} duracao={porTexto} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const ARQUIVO = "brutos/casamento-tc/filme.mp4";
const CREDITO = "Filme: Thiago Costa Filmes";

// Tempos = segundos do vídeo original, alinhados aos cortes de cena. 15–30 s cada.
export const CORTES: Record<string, CorteProps> = {
  CasamentoTC1MakingOf: {
    arquivo: ARQUIVO,
    credito: CREDITO,
    inicio: 11.97,
    fim: 35.7,
    enquadramento: "50% 50%",
    pretoEBranco: false,
    gancho: { antes: "Making of sem ", italico: "correria", depois: "" },
    textos: [
      "Separe acessórios, perfume e convite num só lugar antes de a equipe de foto chegar.",
      "Defina quem fica no quarto da noiva. Menos gente, menos interrupção.",
      "Deixe uma folga no cronograma antes da saída para a cerimônia.",
    ],
  },
  CasamentoTC2Entrada: {
    arquivo: ARQUIVO,
    credito: CREDITO,
    inicio: 47.13,
    fim: 70.07,
    enquadramento: "50% 50%",
    pretoEBranco: true,
    gancho: { antes: "O que acontece antes de cada ", italico: "entrada", depois: "" },
    textos: [
      "Cada entrada tem ordem, música e sinal combinados com antecedência.",
      "Antes de abrir a porta, a assessoria confere se todos estão prontos e posicionados.",
      "Assim o casal e a família só precisam viver o momento.",
    ],
  },
  CasamentoTC3Aliancas: {
    arquivo: ARQUIVO,
    credito: CREDITO,
    inicio: 87.03,
    fim: 111.83,
    enquadramento: "50% 50%",
    pretoEBranco: true,
    gancho: { antes: "Quem leva as ", italico: "alianças", depois: "?" },
    textos: [
      "Um detalhe que costuma ficar para a última hora: quem guarda e quem entrega.",
      "Defina antes: quem leva, em que momento entrega e onde elas ficam até lá.",
      "No dia, as alianças são conferidas antes de a cerimônia começar.",
    ],
  },
  CasamentoTC4Brinde: {
    arquivo: ARQUIVO,
    credito: CREDITO,
    inicio: 140.8,
    fim: 158.63,
    enquadramento: "50% 50%",
    pretoEBranco: false,
    gancho: { antes: "Um brinde no tempo ", italico: "certo", depois: "" },
    textos: [
      "Taças servidas, fotografia posicionada e casal avisado antes.",
      "Quando os noivos chegam à mesa, o momento já está pronto para acontecer.",
    ],
  },
};
