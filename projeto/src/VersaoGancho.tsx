import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS as sans, SERIF as serif } from "./fontes";
import { COR } from "./marca";

// Método "uma gravação, vários ganchos": cada versão = 1 gancho + o MESMO corpo.
// Os dados vêm de ganchos/<slug>.json (gerado por scripts/achar-ganchos.mjs e
// confirmado pela Paty) e são renderizados por scripts/versoes-gancho.mjs.
// É um modelo único controlado por dados (de propósito): as 5 versões precisam
// ser idênticas fora do gancho, então os trechos não são editados um a um no Studio.
//
// Regras do CLAUDE.md aplicadas: sem tremida, sem pulsar, sem seguir rosto
// (enquadramento fixo), nenhum SFX aqui (sem risco de som empilhado),
// e nada parado > 2 s (legenda troca a cada 2–4 palavras + zoom a cada corte).

export const FPS = 30;

type Trecho = { inicio: number; fim: number; texto?: string };

export type VersaoGanchoProps = {
  arquivo: string; // em public/
  legendas: string; // em public/ (Caption[] em ms, tempo do arquivo original)
  enquadramento: string; // object-position fixo, ex.: "50% 35%"
  palavrasChave: string[]; // destacadas em Cormorant itálico nude
  ganchos: Trecho[];
  corpo: Trecho[];
  versao: number; // 1 = primeiro gancho
  captions?: Caption[]; // preenchido pelo calculateMetadata
};

const quadros = (t: Trecho) => Math.round((t.fim - t.inicio) * FPS);

export const trechosDaVersao = (p: VersaoGanchoProps) => [
  p.ganchos[p.versao - 1],
  ...p.corpo,
];

export const calcularVersao: CalculateMetadataFunction<
  VersaoGanchoProps
> = async ({ props }) => {
  const captions: Caption[] = props.legendas
    ? await fetch(staticFile(props.legendas)).then((r) => r.json())
    : [];
  const trechos = trechosDaVersao(props).filter(Boolean);
  return {
    durationInFrames: Math.max(
      1,
      trechos.reduce((t, c) => t + quadros(c), 0),
    ),
    props: { ...props, captions },
  };
};

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

// Legenda: 2–4 palavras por vez, Montserrat clara; palavra-chave em Cormorant itálico nude.
// Centralizada, acima da área dos botões do Instagram.
const Legenda: React.FC<{
  captions: Caption[];
  trecho: Trecho;
  palavrasChave: string[];
}> = ({ captions, trecho, palavrasChave }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chaves = new Set(palavrasChave.map(normalizar));

  // Palavras deste trecho, com o tempo relativo ao início do trecho
  const locais = captions
    .filter(
      (c) =>
        c.startMs >= trecho.inicio * 1000 - 50 &&
        c.endMs <= trecho.fim * 1000 + 50,
    )
    .map((c) => ({
      ...c,
      startMs: c.startMs - trecho.inicio * 1000,
      endMs: c.endMs - trecho.inicio * 1000,
      timestampMs:
        c.timestampMs === null ? null : c.timestampMs - trecho.inicio * 1000,
    }));

  const { pages } = createTikTokStyleCaptions({
    captions: locais,
    combineTokensWithinMilliseconds: 900,
  });
  const agoraMs = (frame / fps) * 1000;
  const pagina = pages.find(
    (p, i) =>
      agoraMs >= p.startMs &&
      agoraMs < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400),
  );
  if (!pagina) return null;

  const entrada = interpolate(agoraMs - pagina.startMs, [0, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        bottom: 560,
        textAlign: "center",
        opacity: entrada,
        translate: `0px ${interpolate(entrada, [0, 1], [12, 0])}px`,
      }}
    >
      {pagina.tokens.map((t, i) => {
        const chave = chaves.has(normalizar(t.text));
        return (
          <span
            key={i}
            style={{
              whiteSpace: "pre",
              fontFamily: chave ? serif : sans,
              fontStyle: chave ? "italic" : "normal",
              fontWeight: 600,
              fontSize: chave ? 92 : 64,
              color: chave ? COR.nude : COR.fundoClaro,
              lineHeight: 1.15,
            }}
          >
            {t.text}
          </span>
        );
      })}
    </div>
  );
};

export const VersaoGancho: React.FC<VersaoGanchoProps> = (props) => {
  const { fps } = useVideoConfig();
  const trechos = trechosDaVersao(props).filter(Boolean);
  const inicios = trechos.map((_, i) =>
    trechos.slice(0, i).reduce((t, c) => t + quadros(c), 0),
  );

  if (!props.arquivo || trechos.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: COR.petroleoEscuro,
          color: COR.nude,
          fontFamily: sans,
          fontSize: 44,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 120,
        }}
      >
        Sem gravação configurada. Rode scripts/achar-ganchos.mjs e
        scripts/versoes-gancho.mjs.
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {trechos.map((t, i) => {
        const dur = quadros(t);
        // fade de 2 quadros no som em cada corte: evita estalo sem "engolir" palavra
        const volume = (f: number) =>
          interpolate(f, [0, 2, dur - 2, dur], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        return (
          <Sequence
            key={i}
            name={i === 0 ? `Gancho ${props.versao}` : `Corpo ${i}`}
            from={inicios[i]}
            durationInFrames={dur}
            premountFor={fps}
          >
            <Video
              src={staticFile(props.arquivo)}
              trimBefore={Math.round(t.inicio * fps)}
              volume={volume}
              objectFit="cover"
              style={{
                width: "100%",
                height: "100%",
                objectPosition: props.enquadramento,
                // zoom leve alternado a cada corte (disfarça o pulo do corte seco);
                // valor fixo dentro do trecho: não pulsa nem segue rosto
                scale: i % 2 === 0 ? 1 : 1.08,
              }}
            />
            {/* Degradê petróleo só na base, para leitura da legenda */}
            <AbsoluteFill
              style={{
                background: `linear-gradient(to top, ${COR.petroleoEscuro}cc 0%, ${COR.petroleoEscuro}00 45%)`,
              }}
            />
            <Legenda
              captions={props.captions ?? []}
              trecho={t}
              palavrasChave={props.palavrasChave}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const VERSAO_GANCHO_PADRAO: VersaoGanchoProps = {
  arquivo: "",
  legendas: "",
  enquadramento: "50% 35%",
  palavrasChave: [],
  ganchos: [],
  corpo: [],
  versao: 1,
};
