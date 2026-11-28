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
import { LEGENDA_CORTEJO } from "./legendas/cortejo";
import { LEGENDA_ENTRADA } from "./legendas/entrada";
import { LEGENDA_UNICO } from "./legendas/unico";

// Reels falados da Paty em estilo EDITORIAL — mecânica da referência enviada em 28/11/2026
// (referencias/ref-2026-11-28-efeitos.mp4), adaptada à identidade da Impactar:
// capa de revista na abertura · palavras gigantes · tela dividida (fala em cima, bastidor embaixo) ·
// cartão flutuante · tela tipográfica no fim. Sem caixas atrás da legenda, cores e fontes oficiais.
// Paty (28/11): "Crie todos os vídeos" nesse estilo.

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.22, 1, 0.36, 1);
const CJ = "brutos/cortejo/";

type Palavra = {
  texto: string;
  de: number;
  ate: number;
  top?: number;
  tamanho?: number;
};
type Apoio = { arquivo: string; inicio?: number; enquadramento?: string };
type ApoioTempo = Apoio & { ate: number };

type Cena =
  | {
      tipo: "capa";
      de: number;
      ate: number;
      titulo: string;
      tamanhoTitulo?: number;
      linha: string;
      italico: string;
      origemQuadro?: string;
    }
  | {
      tipo: "paty";
      de: number;
      ate: number;
      zoom?: number;
      palavras?: Palavra[];
    }
  | ({ tipo: "apoio"; de: number; ate: number; palavras?: Palavra[] } & Apoio)
  | {
      tipo: "dividida";
      de: number;
      ate: number;
      apoios: ApoioTempo[];
      lista?: { titulo: string; itens: { texto: string; em: number }[] };
    }
  | {
      tipo: "cartao";
      de: number;
      ate: number;
      cartao: Apoio;
      topoCartao?: number;
    }
  | {
      tipo: "final";
      de: number;
      ate: number;
      kicker: string;
      antes: string;
      gigante: string;
      depois?: string;
      tamanhoGigante?: number;
    };

export type EditorialProps = {
  fala: string;
  ini: number;
  fimVoz: number;
  /** Ponto fixo das aproximações da Paty: rosto alto "50% 22%", rosto baixo "50% 100%". */
  origemPaty: string;
  /** Deslocamento vertical do vídeo da Paty na metade de cima da tela dividida (px). */
  topoDividida: number;
  cenas: Cena[];
  legenda: readonly { texto: string; ini: number; fim: number }[];
};

export const duracaoEditorial = (p: EditorialProps) =>
  Math.round((Math.max(...p.cenas.map((c) => c.ate)) - p.ini) * FPS);

const DEGRADE =
  "linear-gradient(to top, rgba(7,33,38,0.72) 0%, rgba(7,33,38,0) 42%)";

// ---------- peças ----------

const Midia: React.FC<{ a: Apoio; style?: React.CSSProperties }> = ({
  a,
  style,
}) =>
  /\.(jpe?g|png)$/i.test(a.arquivo) ? (
    <Img
      src={staticFile(a.arquivo)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: a.enquadramento,
        ...style,
      }}
    />
  ) : (
    <OffthreadVideo
      src={staticFile(a.arquivo)}
      trimBefore={Math.round((a.inicio ?? 0) * FPS)}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: a.enquadramento,
        ...style,
      }}
    />
  );

const Aproxima: React.FC<{
  dur: number;
  base?: number;
  origem?: string;
  children: React.ReactNode;
}> = ({ dur, base = 1, origem = "50% 50%", children }) => {
  const f = useCurrentFrame();
  const s = base * interpolate(f, [0, dur], [1, 1.04], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origem }}>
      {children}
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
}> = ({ texto, dur, top, tamanho = 220, cor = COR.fundoClaro }) => {
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
          cor === COR.fundoClaro ? "0 4px 30px rgba(7,33,38,0.4)" : undefined,
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

const Palavras: React.FC<{ palavras?: Palavra[]; de: number }> = ({
  palavras,
  de,
}) => (
  <>
    {(palavras ?? []).map((w, i) => {
      const dur = Math.round((w.ate - w.de) * FPS);
      return (
        <Sequence
          key={i}
          from={Math.round((w.de - de) * FPS)}
          durationInFrames={dur}
          layout="none"
        >
          <PalavraGigante
            texto={w.texto}
            dur={dur}
            top={w.top ?? 110}
            tamanho={w.tamanho}
          />
        </Sequence>
      );
    })}
  </>
);

// ---------- cenas ----------

const CenaCapa: React.FC<{
  c: Extract<Cena, { tipo: "capa" }>;
  fala: string;
  dur: number;
}> = ({ c, fala, dur }) => {
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
        texto={c.titulo}
        dur={dur + 10}
        top={215}
        tamanho={c.tamanhoTitulo ?? 250}
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
          style={{
            transform: "scale(1.25)",
            transformOrigin: c.origemQuadro ?? "50% 60%",
          }}
        >
          <OffthreadVideo
            src={staticFile(fala)}
            trimBefore={Math.round(c.de * FPS)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1500,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 70,
          lineHeight: 1.1,
          color: COR.petroleo,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
        }}
      >
        {c.linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.azulAuxiliar }}>
          {c.italico}
        </span>
      </div>
    </AbsoluteFill>
  );
};

const CenaDividida: React.FC<{
  c: Extract<Cena, { tipo: "dividida" }>;
  fala: string;
  topo: number;
}> = ({ c, fala, topo }) => {
  const f = useCurrentFrame();
  const fio = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: suave });
  let cursor = c.de;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
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
            top: topo,
            left: 0,
            width: 1080,
            height: 1920,
          }}
        >
          <OffthreadVideo
            src={staticFile(fala)}
            trimBefore={Math.round(c.de * FPS)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
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
        {c.apoios.map((a, i) => {
          const de = cursor;
          cursor = a.ate;
          const dur = Math.round((a.ate - de) * FPS);
          return (
            <Sequence
              key={i}
              from={Math.round((de - c.de) * FPS)}
              durationInFrames={dur}
              layout="none"
            >
              <Aproxima dur={dur}>
                <Midia a={a} />
              </Aproxima>
            </Sequence>
          );
        })}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(7,33,38,0.85) 0%, rgba(7,33,38,0.4) 45%, rgba(7,33,38,0) 70%)",
          }}
        />
      </div>
      {c.lista ? (
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
            {c.lista.titulo}
          </div>
          {c.lista.itens.map((it, i) => {
            const em = Math.round((it.em - c.de) * FPS);
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
      ) : null}
    </AbsoluteFill>
  );
};

const Cartao: React.FC<{ a: Apoio; dur: number; topo: number }> = ({
  a,
  dur,
  topo,
}) => {
  const f = useCurrentFrame();
  const e = interpolate(f, [2, 15], [0, 1], { ...clamp, easing: suave });
  const sai = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: topo,
        right: 48,
        width: 400,
        height: 620,
        borderRadius: 28,
        overflow: "hidden",
        opacity: e * sai,
        transform: `translateY(${(1 - e) * 36}px)`,
        boxShadow: "0 12px 40px rgba(7,33,38,0.28)",
      }}
    >
      <Midia a={a} />
    </div>
  );
};

const CenaFinal: React.FC<{
  c: Extract<Cena, { tipo: "final" }>;
  dur: number;
}> = ({ c, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: suave });
  const b = interpolate(f, [16, 28], [0, 1], { ...clamp, easing: suave });
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundoClaro }}>
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-block" }}>
          <Etiqueta texto={c.kicker} fio={a} cor={COR.azulAuxiliar} />
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 80,
            color: COR.azulAuxiliar,
            opacity: a,
            transform: `translateY(${(1 - a) * 22}px)`,
          }}
        >
          {c.antes}
        </div>
      </div>
      <PalavraGigante
        texto={c.gigante}
        dur={dur + 30}
        top={780}
        tamanho={c.tamanhoGigante ?? 200}
        cor={COR.petroleo}
      />
      {c.depois ? (
        <div
          style={{
            position: "absolute",
            top: 1010,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 80,
            color: COR.azulAuxiliar,
            opacity: b,
            transform: `translateY(${(1 - b) * 22}px)`,
          }}
        >
          {c.depois}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- composição ----------

export const Editorial: React.FC<EditorialProps> = (p) => {
  const q = (s: number) => Math.round((s - p.ini) * FPS);
  // Legenda some na capa, na tela dividida com lista e na tela final (um texto de cada vez).
  const ocupado = p.cenas.filter(
    (c) =>
      c.tipo === "capa" ||
      c.tipo === "final" ||
      (c.tipo === "dividida" && c.lista),
  );
  const livre = (t: number) =>
    !ocupado.some((c) => t >= c.de - 0.05 && t < c.ate);

  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {p.cenas.map((c, i) => {
        const dur = q(c.ate) - q(c.de);
        return (
          <Sequence
            key={i}
            from={q(c.de)}
            durationInFrames={dur}
            premountFor={FPS}
          >
            {c.tipo === "capa" ? (
              <CenaCapa c={c} fala={p.fala} dur={dur} />
            ) : c.tipo === "paty" ? (
              <>
                <Aproxima dur={dur} base={c.zoom ?? 1.08} origem={p.origemPaty}>
                  <Midia a={{ arquivo: p.fala, inicio: c.de }} />
                </Aproxima>
                <AbsoluteFill style={{ background: DEGRADE }} />
                <Palavras palavras={c.palavras} de={c.de} />
              </>
            ) : c.tipo === "apoio" ? (
              <>
                <Aproxima dur={dur}>
                  <Midia a={c} />
                </Aproxima>
                <AbsoluteFill style={{ background: DEGRADE }} />
                <Palavras palavras={c.palavras} de={c.de} />
              </>
            ) : c.tipo === "dividida" ? (
              <CenaDividida c={c} fala={p.fala} topo={p.topoDividida} />
            ) : c.tipo === "cartao" ? (
              <>
                <Aproxima
                  dur={dur}
                  base={1.3}
                  origem={p.origemPaty.replace(/^50%/, "100%")}
                >
                  <Midia a={{ arquivo: p.fala, inicio: c.de }} />
                </Aproxima>
                <AbsoluteFill style={{ background: DEGRADE }} />
                <Cartao a={c.cartao} dur={dur} topo={c.topoCartao ?? 250} />
              </>
            ) : (
              <CenaFinal c={c} dur={dur} />
            )}
          </Sequence>
        );
      })}

      {/* Voz da Paty, contínua */}
      <Audio
        src={staticFile(p.fala)}
        trimBefore={Math.round(p.ini * FPS)}
        trimAfter={Math.round(p.fimVoz * FPS)}
      />

      {p.legenda.map((l, i) => {
        if (!livre(l.ini)) return null;
        const de = Math.max(0, q(l.ini));
        const ate = q(l.fim);
        if (ate <= de) return null;
        return (
          <Sequence
            key={`l${i}`}
            from={de}
            durationInFrames={ate - de}
            layout="none"
          >
            <Legenda texto={l.texto} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================= os 3 vídeos =======================

// Vídeo 1 — Cortejo (rosto alto no quadro). Tempos no arquivo da fala (s).
export const ED_CORTEJO: EditorialProps = {
  fala: `${CJ}fala-ret.mp4`,
  ini: 1.0,
  fimVoz: 27.3,
  origemPaty: "50% 22%",
  topoDividida: -80,
  legenda: LEGENDA_CORTEJO,
  cenas: [
    {
      tipo: "capa",
      de: 1.0,
      ate: 3.94,
      titulo: "CORTEJO",
      tamanhoTitulo: 200,
      linha: "não começa quando",
      italico: "a música toca…",
      origemQuadro: "50% 30%",
    },
    {
      tipo: "paty",
      de: 3.94,
      ate: 5.36,
      palavras: [
        { texto: "ANTES", de: 4.32, ate: 5.36, top: 1060, tamanho: 210 },
      ],
    },
    {
      tipo: "dividida",
      de: 5.36,
      ate: 8.55,
      apoios: [
        { arquivo: `${CJ}entrada-9635.mp4`, inicio: 2.0, ate: 6.9 },
        { arquivo: `${CJ}corredor-9647.mp4`, inicio: 10.0, ate: 8.55 },
      ],
      lista: {
        titulo: "Alinhado semanas antes:",
        itens: [
          { texto: "Quem entra com você", em: 5.4 },
          { texto: "Em qual ordem", em: 6.7 },
          { texto: "Qual a música", em: 7.6 },
        ],
      },
    },
    {
      tipo: "paty",
      de: 8.55,
      ate: 11.14,
      zoom: 1.2,
      palavras: [
        { texto: "NA HORA", de: 10.24, ate: 11.14, top: 1060, tamanho: 190 },
      ],
    },
    {
      tipo: "cartao",
      de: 11.14,
      ate: 14.3,
      cartao: { arquivo: `${CJ}equipe-9608.mp4`, inicio: 0.5 },
      topoCartao: 560,
    },
    {
      tipo: "apoio",
      de: 14.3,
      ate: 17.32,
      arquivo: `${CJ}equipe-roda-9605.jpg`,
      enquadramento: "50% 40%",
    },
    {
      tipo: "apoio",
      de: 17.32,
      ate: 20.88,
      arquivo: `${CJ}corredor-9647.mp4`,
      inicio: 14.0,
      palavras: [
        { texto: "RITMO", de: 19.15, ate: 19.95, top: 200 },
        { texto: "SENTIDO", de: 20.05, ate: 20.88, top: 200, tamanho: 190 },
      ],
    },
    {
      tipo: "paty",
      de: 20.88,
      ate: 23.2,
      zoom: 1.2,
      palavras: [
        { texto: "TRANQUILA", de: 22.38, ate: 23.2, top: 1060, tamanho: 150 },
      ],
    },
    { tipo: "paty", de: 23.2, ate: 25.06 },
    {
      tipo: "final",
      de: 25.06,
      ate: 28.4,
      kicker: "No dia",
      antes: "a equipe já sabe",
      gigante: "O QUE FAZER",
      tamanhoGigante: 140,
    },
  ],
};

// Vídeo 2 — Entrada e ritmo (rosto baixo no quadro; fala montada de IMG_9673, quadros suavizados).
export const ED_ENTRADA: EditorialProps = {
  fala: "brutos/entrada/fala-ret.mp4",
  ini: 0,
  fimVoz: 47.15,
  origemPaty: "50% 100%",
  topoDividida: -560,
  legenda: LEGENDA_ENTRADA,
  cenas: [
    {
      tipo: "capa",
      de: 0,
      ate: 4.76,
      titulo: "DECORAÇÃO",
      tamanhoTitulo: 140,
      linha: "Sua cerimônia pode ter",
      italico: "a mais linda do mundo…",
    },
    {
      tipo: "apoio",
      de: 4.76,
      ate: 7.7,
      arquivo: `${CJ}altar-decoracao-9600.jpg`,
      enquadramento: "50% 45%",
      palavras: [{ texto: "LINDA", de: 5.55, ate: 7.7, top: 160 }],
    },
    { tipo: "paty", de: 7.7, ate: 10.93, zoom: 1.2 },
    {
      tipo: "paty",
      de: 10.93,
      ate: 14.7,
      palavras: [
        { texto: "CONFUSA", de: 11.36, ate: 13.3, top: 120, tamanho: 190 },
      ],
    },
    {
      tipo: "paty",
      de: 14.7,
      ate: 17.53,
      zoom: 1.2,
      palavras: [
        { texto: "LEMBRAR", de: 16.52, ate: 17.53, top: 60, tamanho: 190 },
      ],
    },
    {
      tipo: "cartao",
      de: 17.53,
      ate: 22.28,
      cartao: {
        arquivo: `${CJ}altar-decoracao-9600.jpg`,
        enquadramento: "50% 45%",
      },
    },
    {
      tipo: "paty",
      de: 22.28,
      ate: 26.29,
      zoom: 1.2,
      palavras: [{ texto: "RITMO", de: 24.9, ate: 26.29, top: 60 }],
    },
    {
      tipo: "dividida",
      de: 26.29,
      ate: 36.04,
      apoios: [
        { arquivo: `${CJ}entrada-9635.mp4`, inicio: 9.0, ate: 29.77 },
        { arquivo: `${CJ}corredor-9647.mp4`, inicio: 1.0, ate: 33.07 },
        { arquivo: `${CJ}altar-9636.mp4`, inicio: 2.2, ate: 36.04 },
      ],
      lista: {
        titulo: "O ritmo é:",
        itens: [
          { texto: "A entrada no tempo certo", em: 26.4 },
          { texto: "A música que entra junto", em: 29.8 },
          { texto: "A pausa antes do sim", em: 33.1 },
        ],
      },
    },
    { tipo: "paty", de: 36.04, ate: 39.95 },
    {
      tipo: "paty",
      de: 39.95,
      ate: 42.29,
      zoom: 1.2,
      palavras: [
        { texto: "SENTIDO", de: 40.69, ate: 42.29, top: 60, tamanho: 190 },
      ],
    },
    {
      tipo: "final",
      de: 42.29,
      ate: 48.4,
      kicker: "Bastidores da Impactar",
      antes: "a entrada começa",
      gigante: "ANTES",
      depois: "do dia.",
    },
  ],
};

// Vídeo 3 — Seu único trabalho (mesmo roteiro do EditorialUnico v1).
export const ED_UNICO: EditorialProps = {
  fala: "brutos/unico/fala-ret.mp4",
  ini: 0,
  fimVoz: 17.07,
  origemPaty: "50% 100%",
  topoDividida: -560,
  legenda: LEGENDA_UNICO,
  cenas: [
    {
      tipo: "capa",
      de: 0,
      ate: 2.09,
      titulo: "O DIA",
      linha: "do seu",
      italico: "casamento…",
    },
    {
      tipo: "paty",
      de: 2.09,
      ate: 5.12,
      palavras: [
        { texto: "ÚNICO", de: 2.35, ate: 4.1, top: 130 },
        { texto: "NOIVA", de: 4.12, ate: 5.12, top: 130 },
      ],
    },
    {
      tipo: "dividida",
      de: 5.12,
      ate: 9.37,
      apoios: [
        {
          arquivo: `${CJ}equipe-9608.mp4`,
          inicio: 0.5,
          ate: 7.0,
          enquadramento: "50% 40%",
        },
        {
          arquivo: `${CJ}equipe-roda-9605.jpg`,
          ate: 9.37,
          enquadramento: "50% 45%",
        },
      ],
      lista: {
        titulo: "Quem resolve?",
        itens: [
          { texto: "Se o fornecedor atrasar", em: 5.45 },
          { texto: "Se um convidado se perder", em: 6.72 },
          { texto: "Se a chuva apertar", em: 8.17 },
        ],
      },
    },
    { tipo: "paty", de: 9.37, ate: 10.64 },
    {
      tipo: "paty",
      de: 10.64,
      ate: 12.85,
      zoom: 1.2,
      palavras: [
        { texto: "VOCÊ", de: 11.73, ate: 12.85, top: 70, tamanho: 210 },
      ],
    },
    {
      tipo: "cartao",
      de: 12.85,
      ate: 15.62,
      cartao: { arquivo: `${CJ}equipe-9608.mp4`, inicio: 6.0 },
    },
    {
      tipo: "final",
      de: 15.62,
      ate: 18.6,
      kicker: "No dia",
      antes: "você só vive o",
      gigante: "MOMENTO",
    },
  ],
};
