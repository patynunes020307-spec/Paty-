import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIF } from "./fontes";
import { COR } from "./marca";

// Tipografia cinética (10 s) — receitas da skill kinetic-typography (iart-ai):
// revelação por máscara palavra a palavra (ease-out expo), palavra-chave em
// itálico nude com blur-in, fio nude desenhando. Sem pulsar, sem tremida:
// depois da entrada o bloco só deriva devagar (movimento linear, sem loop).

export const TIPO_FPS = 30;
export const TIPO_DURACAO = 10 * TIPO_FPS;

export type TipoProps = {
  texto: string; // frase inteira
  destaque?: string; // palavra(s) em itálico nude; padrão = última palavra
  etiqueta?: string; // Montserrat caixa-alta acima da frase (opcional)
};

export const TIPO_PADRAO: TipoProps = { texto: "[SEU TEXTO]" };

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// tamanho da fonte pela quantidade de caracteres (cabe em 888 px de largura)
const tamanho = (n: number) =>
  n <= 12 ? 190 : n <= 24 ? 150 : n <= 40 ? 124 : n <= 70 ? 100 : 82;

export const TipoCinetica: React.FC<TipoProps> = ({
  texto,
  destaque,
  etiqueta,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const palavras = texto.trim().split(/\s+/);
  const chave = (destaque ?? palavras[palavras.length - 1]).trim();
  const nChave = chave.split(/\s+/).length;
  const inicioChave = Math.max(0, palavras.length - nChave);
  const ehChave = (i: number) =>
    palavras.slice(inicioChave).join(" ") === chave
      ? i >= inicioChave
      : palavras[i] === chave;

  const fs = tamanho(texto.length);
  const passo = 3; // 100 ms entre palavras
  const entrada = Math.round(0.5 * fps);
  const fimEntrada = entrada + palavras.length * passo + 18;
  const saida = durationInFrames - Math.round(0.9 * fps);

  // deriva lenta e contínua do bloco depois da entrada (não é loop)
  const deriva = interpolate(frame, [entrada, saida], [0, -40], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {/* luz suave petróleo que sobe devagar — fundo nunca fica parado */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 30% ${interpolate(
            frame,
            [0, durationInFrames],
            [70, 52],
          )}%, ${COR.petroleo} 0%, rgba(7,33,38,0) 70%)`,
        }}
      />

      <div
        aria-label={texto}
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 700,
          translate: `0 ${deriva}px`,
        }}
      >
        {/* fio nude desenhando da esquerda */}
        <div
          style={{
            width: 120,
            height: 3,
            backgroundColor: COR.nude,
            transformOrigin: "left center",
            scale: `${interpolate(frame, [6, 6 + 0.6 * fps], [0, 1], { ...clamp, easing: EXPO })} 1`,
            opacity: interpolate(frame, [saida, saida + 12], [1, 0], clamp),
            marginBottom: etiqueta ? 28 : 48,
          }}
        />

        {etiqueta ? (
          <div
            style={{
              overflow: "hidden",
              marginBottom: 36,
            }}
          >
            <div
              aria-hidden
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 34,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: COR.verdeAgua,
                translate: `0 ${interpolate(frame, [10, 10 + 18], [110, 0], { ...clamp, easing: EXPO })}%`,
                opacity: interpolate(frame, [saida, saida + 12], [1, 0], clamp),
              }}
            >
              {etiqueta}
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: "0.24em",
            fontFamily: SERIF,
            fontWeight: 500,
            fontSize: fs,
            lineHeight: 1.08,
            letterSpacing: "-0.015em",
          }}
        >
          {palavras.map((p, i) => {
            const ini = entrada + i * passo;
            const kw = ehChave(i);
            const sai = saida + i * 2;
            const y =
              interpolate(frame, [ini, ini + 18], [135, 0], {
                ...clamp,
                easing: EXPO,
              }) +
              interpolate(frame, [sai, sai + 14], [0, -135], {
                ...clamp,
                easing: Easing.bezier(0.7, 0, 0.84, 0),
              });
            // palavra-chave: ganha foco (blur → nítido) e aperta o espaçamento
            const blur = kw
              ? interpolate(frame, [ini, ini + 0.8 * fps], [14, 0], clamp)
              : 0;
            const track = kw
              ? interpolate(frame, [ini, fimEntrada + 2 * fps], [0.08, -0.01], {
                  ...clamp,
                  easing: EXPO,
                })
              : -0.015;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  // folga para descendentes e itálico não serem cortados
                  padding: "0.04em 0.12em 0.16em 0",
                  margin: "-0.04em -0.12em -0.16em 0",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    translate: `0 ${y}%`,
                    filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                    color: kw ? COR.nude : COR.fundoClaro,
                    fontStyle: kw ? "italic" : "normal",
                    letterSpacing: `${track}em`,
                  }}
                >
                  {p}
                </span>
              </span>
            );
          })}
        </div>

        {/* segundo tempo (~3 s): fio verde-água sublinha a frase */}
        <div
          style={{
            marginTop: 44,
            width: 360,
            height: 2,
            backgroundColor: COR.verdeAgua,
            transformOrigin: "left center",
            scale: `${interpolate(frame, [3 * fps, 4.2 * fps], [0, 1], { ...clamp, easing: EXPO })} 1`,
            opacity: interpolate(frame, [saida, saida + 12], [0.8, 0], clamp),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
