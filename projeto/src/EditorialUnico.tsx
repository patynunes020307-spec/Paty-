import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COR } from "./marca";
import { SANS, SERIF } from "./fontes";
import { Check, Etiqueta, Legenda } from "./FalaPaty";
import { LEGENDA_UNICO } from "./legendas/unico";

// "Seu único trabalho" em estilo editorial — mecânica da referência enviada pela Paty em 28/11/2026
// (referencias/ref-2026-11-28-efeitos.mp4): capa de revista na abertura, palavras gigantes acima da cabeça,
// tela dividida (fala em cima, bastidor embaixo), cartão flutuante e tela tipográfica no fim.
// Adaptado à identidade da Impactar (Cormorant/Montserrat, paleta oficial, sem caixas atrás da legenda).

const FPS = 30;
const FALA = "brutos/unico/fala-ret.mp4";
const CJ = "brutos/cortejo/";
const FIM_VOZ = 17.07;
export const DURACAO_EDITORIAL_UNICO = Math.round(18.6 * FPS);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.22, 1, 0.36, 1);
const q = (s: number) => Math.round(s * FPS);

// Paty: imagem muda (a voz vem do <Audio> contínuo). Enquadramento fixo por trecho, aproximação lenta.
const Paty: React.FC<{
  de: number;
  ate: number;
  zoom?: number;
  origem?: string;
  deslocaY?: number;
}> = ({ de, ate, zoom = 1.08, origem = "50% 100%", deslocaY = 0 }) => {
  const f = useCurrentFrame();
  const s = zoom * interpolate(f, [0, q(ate - de)], [1, 1.04], clamp);
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${deslocaY}px) scale(${s})`,
        transformOrigin: origem,
      }}
    >
      <OffthreadVideo
        src={staticFile(FALA)}
        trimBefore={q(de)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

// Palavra gigante: letras entram uma a uma (fade + subida curta), sem pular nem girar; sai com fade.
const PalavraGigante: React.FC<{
  texto: string;
  dur: number;
  top: number;
  tamanho?: number;
  cor?: string;
}> = ({ texto, dur, top, tamanho = 230, cor = COR.fundoClaro }) => {
  const f = useCurrentFrame();
  const sai = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 500,
        fontSize: tamanho,
        lineHeight: 1,
        letterSpacing: 4,
        color: cor,
        opacity: sai,
        textShadow:
          cor === COR.fundoClaro ? "0 4px 30px rgba(7,33,38,0.35)" : undefined,
        whiteSpace: "nowrap",
      }}
    >
      {texto.split("").map((l, i) => {
        const a = interpolate(f, [i * 1.6, i * 1.6 + 10], [0, 1], {
          ...clamp,
          easing: suave,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: a,
              transform: `translateY(${(1 - a) * 30}px)`,
            }}
          >
            {l === " " ? " " : l}
          </span>
        );
      })}
    </div>
  );
};

// 1) Abertura "capa de revista": título gigante, vídeo emoldurado, subtítulo em itálico.
const CapaRevista: React.FC = () => {
  const f = useCurrentFrame();
  const quadro = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: suave });
  const sub = interpolate(f, [14, 26], [0, 1], { ...clamp, easing: suave });
  return (
    <AbsoluteFill style={{ backgroundColor: COR.areia }}>
      <div style={{ position: "absolute", top: 150, left: 70 }}>
        <Etiqueta
          texto="Bastidores da Impactar"
          fio={quadro}
          cor={COR.azulAuxiliar}
        />
      </div>
      <PalavraGigante
        texto="O DIA"
        dur={q(2.1)}
        top={215}
        tamanho={250}
        cor={COR.petroleo}
      />
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 110,
          right: 110,
          height: 960,
          overflow: "hidden",
          opacity: quadro,
          transform: `translateY(${(1 - quadro) * 26}px)`,
        }}
      >
        <AbsoluteFill
          style={{ transform: "scale(1.25)", transformOrigin: "50% 60%" }}
        >
          <OffthreadVideo
            src={staticFile(FALA)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1500,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 74,
          lineHeight: 1.1,
          color: COR.petroleo,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
        }}
      >
        do seu
        <br />
        <span style={{ fontStyle: "italic", color: COR.azulAuxiliar }}>
          casamento…
        </span>
      </div>
    </AbsoluteFill>
  );
};

// 3) Tela dividida: Paty em cima, bastidor real embaixo, lista com check sobre o bastidor.
const itens = [
  { texto: "Se o fornecedor atrasar", em: 5.45 },
  { texto: "Se um convidado se perder", em: 6.72 },
  { texto: "Se a chuva apertar", em: 8.17 },
];
const TelaDividida: React.FC = () => {
  const f = useCurrentFrame();
  const ini = 5.12;
  const fio = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: suave });
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {/* metade de cima: Paty, rosto centralizado no painel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 958,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -560,
            left: 0,
            width: 1080,
            height: 1920,
          }}
        >
          <OffthreadVideo
            src={staticFile(FALA)}
            trimBefore={q(ini)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
      {/* fio nude que se desenha na divisão */}
      <div
        style={{
          position: "absolute",
          top: 958,
          left: 0,
          width: 1080 * fio,
          height: 4,
          backgroundColor: COR.nude,
        }}
      />
      {/* metade de baixo: equipe em ação */}
      <div
        style={{
          position: "absolute",
          top: 962,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <Sequence durationInFrames={q(7.0 - ini)} layout="none">
          <OffthreadVideo
            src={staticFile(`${CJ}equipe-9608.mp4`)}
            trimBefore={q(0.5)}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 40%",
            }}
          />
        </Sequence>
        <Sequence from={q(7.0 - ini)} layout="none">
          <Img
            src={staticFile(`${CJ}equipe-roda-9605.jpg`)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 45%",
            }}
          />
        </Sequence>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(7,33,38,0.85) 0%, rgba(7,33,38,0.4) 45%, rgba(7,33,38,0) 70%)",
          }}
        />
      </div>
      {/* lista: um item por vez, no momento da fala */}
      <div style={{ position: "absolute", left: 80, right: 60, bottom: 330 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 76,
            color: COR.nude,
            marginBottom: 22,
            opacity: fio,
            textShadow: "0 2px 18px rgba(7,33,38,0.8)",
          }}
        >
          Quem resolve?
        </div>
        {itens.map((it, i) => {
          const em = q(it.em - ini);
          const op = interpolate(f, [em, em + 9], [0, 1], {
            ...clamp,
            easing: suave,
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 12,
                opacity: op,
                transform: `translateY(${(1 - op) * 20}px)`,
              }}
            >
              <Check em={em} />
              <div
                style={{
                  color: COR.fundoClaro,
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: 50,
                  textShadow: "0 2px 14px rgba(7,33,38,0.7)",
                }}
              >
                {it.texto}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 4) Cartão flutuante: bastidor real num cartão ao lado da Paty.
const CartaoFlutuante: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [2, 15], [0, 1], { ...clamp, easing: suave });
  const sai = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        right: 48,
        width: 400,
        height: 620,
        borderRadius: 28,
        overflow: "hidden",
        opacity: a * sai,
        transform: `translateY(${(1 - a) * 36}px)`,
        boxShadow: "0 12px 40px rgba(7,33,38,0.28)",
      }}
    >
      <OffthreadVideo
        src={staticFile(`${CJ}equipe-9608.mp4`)}
        trimBefore={q(6.0)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "45% 50%",
        }}
      />
    </div>
  );
};

// 5) Tela tipográfica final (fundo claro, título petróleo grande — modelo B do Guia).
const TelaFinal: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: suave });
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundoClaro }}>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-block" }}>
          <Etiqueta texto="No dia" fio={a} cor={COR.azulAuxiliar} />
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 84,
            color: COR.azulAuxiliar,
            opacity: a,
            transform: `translateY(${(1 - a) * 22}px)`,
          }}
        >
          você só vive o
        </div>
      </div>
      <PalavraGigante
        texto="MOMENTO"
        dur={q(18.6 - 15.62) + 30}
        top={790}
        tamanho={200}
        cor={COR.petroleo}
      />
    </AbsoluteFill>
  );
};

export const EditorialUnico: React.FC = () => {
  const legendasLivres = LEGENDA_UNICO.filter(
    (l) => l.ini >= 2.0 && !(l.ini >= 5.1 && l.ini < 9.37) && l.ini < 15.6,
  );
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {/* 0–2,09 s: capa de revista */}
      <Sequence durationInFrames={q(2.09)}>
        <CapaRevista />
      </Sequence>

      {/* 2,09–5,12 s: Paty + palavras gigantes acima da cabeça */}
      <Sequence from={q(2.09)} durationInFrames={q(5.12 - 2.09)}>
        <Paty de={2.09} ate={5.12} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(7,33,38,0.7) 0%, rgba(7,33,38,0) 40%)",
          }}
        />
        <Sequence
          from={q(2.35 - 2.09)}
          durationInFrames={q(4.1 - 2.35)}
          layout="none"
        >
          <PalavraGigante texto="ÚNICO" dur={q(4.1 - 2.35)} top={130} />
        </Sequence>
        <Sequence from={q(4.12 - 2.09)} layout="none">
          <PalavraGigante texto="NOIVA" dur={q(5.12 - 4.12)} top={130} />
        </Sequence>
      </Sequence>

      {/* 5,12–9,37 s: tela dividida */}
      <Sequence from={q(5.12)} durationInFrames={q(9.37 - 5.12)}>
        <TelaDividida />
      </Sequence>

      {/* 9,37–12,85 s: Paty, corte para plano fechado, palavra gigante */}
      <Sequence from={q(9.37)} durationInFrames={q(10.64 - 9.37)}>
        <Paty de={9.37} ate={10.64} />
      </Sequence>
      <Sequence from={q(10.64)} durationInFrames={q(12.85 - 10.64)}>
        <Paty de={10.64} ate={12.85} zoom={1.2} />
        <Sequence from={q(11.73 - 10.64)} layout="none">
          <PalavraGigante
            texto="VOCÊ"
            dur={q(12.85 - 11.73)}
            top={70}
            tamanho={210}
          />
        </Sequence>
      </Sequence>
      <Sequence from={q(9.37)} durationInFrames={q(12.85 - 9.37)}>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(7,33,38,0.7) 0%, rgba(7,33,38,0) 40%)",
          }}
        />
      </Sequence>

      {/* 12,85–15,62 s: Paty deslocada para a esquerda + cartão flutuante com a equipe */}
      <Sequence from={q(12.85)} durationInFrames={q(15.62 - 12.85)}>
        <Paty de={12.85} ate={15.62} zoom={1.3} origem="100% 100%" />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(7,33,38,0.7) 0%, rgba(7,33,38,0) 40%)",
          }}
        />
        <CartaoFlutuante dur={q(15.62 - 12.85)} />
      </Sequence>

      {/* 15,62 s → fim: tela tipográfica */}
      <Sequence from={q(15.62)}>
        <TelaFinal />
      </Sequence>

      {/* Voz da Paty, contínua */}
      <Audio src={staticFile(FALA)} trimAfter={q(FIM_VOZ)} />

      {legendasLivres.map((l, i) => (
        <Sequence
          key={i}
          from={q(l.ini)}
          durationInFrames={q(l.fim) - q(l.ini)}
          layout="none"
        >
          <Legenda texto={l.texto} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
