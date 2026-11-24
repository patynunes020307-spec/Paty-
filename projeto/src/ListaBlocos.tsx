import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS as sans, SERIF as serif } from "./fontes";
import { COR } from "./marca";

// Formato "lista em blocos + comenta PALAVRA" (estudo de referência de 24/11/2026,
// estilos/ref-2026-11-24-tutorial-e-lista.md), adaptado ao Guia:
// fundo petróleo escuro + selo suave no canto, Cormorant com palavra-chave em
// itálico nude, etiquetas Montserrat, destaques em verde-água (escolha da Paty).
// Sem caixas, pílulas, ícones ou tela final de logo. Sem som (música pelo Instagram).

export const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MARGEM = 96;

type Bloco = {
  titulo: string;
  italico: string;
  itens: string[];
  segundos: number;
};

export type ListaProps = {
  gancho: { kicker: string; linha: string; italico: string; segundos: number };
  blocos: Bloco[];
  cta: { antes: string; palavra: string; depois: string; segundos: number };
};

export const duracaoLista = (p: ListaProps) =>
  Math.round(
    (p.gancho.segundos +
      p.blocos.reduce((t, b) => t + b.segundos, 0) +
      p.cta.segundos) *
      FPS,
  );

// entrada: sobe 24 px, desfoque 10 → 0, opacidade 0 → 1 em 0,35 s (uma vez)
const useEntrada = (atraso: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(
    frame,
    [atraso * fps, (atraso + 0.35) * fps],
    [0, 1],
    { ...clamp, easing: Easing.out(Easing.cubic) },
  );
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * 24}px)`,
    filter: `blur(${(1 - t) * 10}px)`,
  };
};

// saída seca e rápida (0,2 s) no fim de cada tela
const useSaida = (duracao: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [duracao - 0.2 * fps, duracao], [1, 0], clamp);
};

const Etiqueta: React.FC<{ texto: string; duracao: number }> = ({
  texto,
  duracao,
}) => {
  const frame = useCurrentFrame();
  // fio verde-água cresce durante a tela inteira: mostra o tempo do bloco
  // e mantém movimento contínuo (nada parado > 2 s), sem pulsar
  const largura = interpolate(frame, [0, duracao], [24, 140], clamp);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        marginBottom: 30,
        ...useEntrada(0),
      }}
    >
      <div style={{ width: largura, height: 3, backgroundColor: COR.verdeAgua }} />
      <div
        style={{
          color: COR.verdeAgua,
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const Titulo: React.FC<{ linha: string; italico: string; tamanho: number }> = ({
  linha,
  italico,
  tamanho,
}) => (
  <div
    style={{
      fontFamily: serif,
      fontWeight: 500,
      fontSize: tamanho,
      lineHeight: 1.05,
      color: COR.fundoClaro,
      ...useEntrada(0.08),
    }}
  >
    {linha}
    <br />
    <span style={{ fontStyle: "italic", color: COR.nude }}>{italico}</span>
  </div>
);

const Gancho: React.FC<{ g: ListaProps["gancho"]; duracao: number }> = ({
  g,
  duracao,
}) => (
  <AbsoluteFill style={{ opacity: useSaida(duracao) }}>
    <div style={{ position: "absolute", left: MARGEM, right: 80, top: 700 }}>
      <Etiqueta texto={g.kicker} duracao={duracao} />
      <Titulo linha={g.linha} italico={g.italico} tamanho={118} />
    </div>
  </AbsoluteFill>
);

const Item: React.FC<{ n: number; texto: string; atraso: number }> = ({
  n,
  texto,
  atraso,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: 30,
      marginTop: 34,
      ...useEntrada(atraso),
    }}
  >
    <div
      style={{
        width: 56,
        flexShrink: 0,
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 30,
        color: COR.verdeAgua,
        letterSpacing: 2,
      }}
    >
      {String(n).padStart(2, "0")}
    </div>
    <div
      style={{
        fontFamily: serif,
        fontWeight: 500,
        fontSize: 62,
        lineHeight: 1.1,
        color: COR.fundoClaro,
      }}
    >
      {texto}
    </div>
  </div>
);

const TelaBloco: React.FC<{
  b: Bloco;
  indice: number;
  total: number;
  duracao: number;
}> = ({ b, indice, total, duracao }) => (
  <AbsoluteFill style={{ opacity: useSaida(duracao) }}>
    <div style={{ position: "absolute", left: MARGEM, right: 80, top: 540 }}>
      <Etiqueta texto={`Bloco ${indice + 1}/${total}`} duracao={duracao} />
      <Titulo linha={b.titulo} italico={b.italico} tamanho={92} />
      <div style={{ marginTop: 40 }}>
        {b.itens.map((t, i) => (
          <Item key={t} n={i + 1} texto={t} atraso={0.45 + i * 0.18} />
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

const Cta: React.FC<{ c: ListaProps["cta"] }> = ({ c }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: MARGEM, right: 80, top: 640 }}>
      <div
        style={{
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 96,
          color: COR.fundoClaro,
          ...useEntrada(0),
        }}
      >
        {c.antes}
      </div>
      <div
        style={{
          fontFamily: serif,
          fontWeight: 600,
          fontStyle: "italic",
          fontSize: 176,
          lineHeight: 1,
          color: COR.nude,
          marginTop: 6,
          ...useEntrada(0.25),
        }}
      >
        “{c.palavra}”
      </div>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.45,
          color: COR.areia,
          marginTop: 44,
          maxWidth: 820,
          ...useEntrada(0.6),
        }}
      >
        {c.depois}
      </div>
      <div
        style={{
          width: 140,
          height: 3,
          backgroundColor: COR.verdeAgua,
          marginTop: 48,
          ...useEntrada(0.8),
        }}
      />
    </div>
  </AbsoluteFill>
);

export const ListaBlocos: React.FC<ListaProps> = (p) => {
  const { fps } = useVideoConfig();
  const g = Math.round(p.gancho.segundos * fps);
  let cursor = g;
  const blocos = p.blocos.map((b, i) => {
    const d = Math.round(b.segundos * fps);
    const el = (
      <Sequence key={b.titulo} from={cursor} durationInFrames={d}>
        <TelaBloco b={b} indice={i} total={p.blocos.length} duracao={d} />
      </Sequence>
    );
    cursor += d;
    return el;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
      {/* selo suave no canto (sinal da marca em telas sem foto) */}
      <Img
        src={staticFile("marca/png/selo-nude.png")}
        style={{
          position: "absolute",
          right: 80,
          bottom: 300,
          width: 150,
          opacity: 0.35,
        }}
      />
      <Sequence durationInFrames={g}>
        <Gancho g={p.gancho} duracao={g} />
      </Sequence>
      {blocos}
      <Sequence from={cursor}>
        <Cta c={p.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};

// TESTE — brinde FICTÍCIO (pedido da Paty, 24/11/2026). Não publicar sem um
// checklist real pronto para enviar a quem comentar.
export const VESPERA: ListaProps = {
  gancho: {
    kicker: "Checklist da véspera",
    linha: "O que resolver",
    italico: "um dia antes do sim",
    segundos: 2.6,
  },
  blocos: [
    {
      titulo: "Documentos e",
      italico: "alianças",
      itens: [
        "Alianças com o padrinho certo",
        "Documentos do civil separados",
        "Votos impressos, com cópia extra",
      ],
      segundos: 3.6,
    },
    {
      titulo: "Kit de",
      italico: "emergência",
      itens: [
        "Agulha e linha na cor do vestido",
        "Fita dupla face",
        "Curativo e analgésico",
        "Carregador de celular",
      ],
      segundos: 4,
    },
    {
      titulo: "Fornecedores",
      italico: "confirmados",
      itens: [
        "Horários confirmados por escrito",
        "Contato de quem chega primeiro",
        "Pagamentos finais separados",
      ],
      segundos: 3.6,
    },
    {
      titulo: "E vocês",
      italico: "dois",
      itens: [
        "Jantar leve",
        "Dormir cedo",
        "Celular com alguém de confiança",
      ],
      segundos: 3.4,
    },
  ],
  cta: {
    antes: "Comenta",
    palavra: "VÉSPERA",
    depois: "que eu te envio o checklist completo da véspera do casamento",
    segundos: 4,
  },
};
