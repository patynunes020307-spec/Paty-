// Uso (dentro de projeto/):
//   node scripts/achar-ganchos.mjs <slug> [--ganchos 5] [--pausa 1.0]
// Lê public/legendas/<slug>.json, separa a fala em blocos pelas pausas
// e mostra cada bloco com início, fim e texto.
// Se ganchos/<slug>.json ainda não existir, grava um RASCUNHO:
// os N primeiros blocos viram ganchos, o resto vira corpo, já sem as pausas internas.
// O rascunho NUNCA é usado sem a Paty confirmar onde começa e termina cada gancho.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const slug = args[0];
const opcao = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i === -1 ? padrao : Number(args[i + 1]);
};
const N_GANCHOS = opcao("ganchos", 5);
const PAUSA_BLOCO = opcao("pausa", 1.0); // s de silêncio que separam ganchos/corpo
const PAUSA_CORTE = 0.45; // s de silêncio dentro do corpo que vale cortar
const FOLGA = 0.12; // s de respiro antes e depois de cada trecho (não picotar o som)

if (!slug) {
  console.error(
    "Uso: node scripts/achar-ganchos.mjs <slug> [--ganchos 5] [--pausa 1.0]",
  );
  process.exit(1);
}

const RAIZ = path.resolve(import.meta.dirname, "..");
const legendas = JSON.parse(
  readFileSync(path.join(RAIZ, "public", "legendas", `${slug}.json`), "utf8"),
);

// Agrupa palavras em blocos separados por pausas >= limite
const agrupar = (palavras, limite) => {
  const blocos = [];
  for (const p of palavras) {
    const ultimo = blocos.at(-1);
    if (ultimo && p.startMs - ultimo.at(-1).endMs < limite * 1000) {
      ultimo.push(p);
    } else {
      blocos.push([p]);
    }
  }
  return blocos;
};

const s = (ms) => Math.round(ms) / 1000;
const trecho = (bloco) => ({
  inicio: Math.max(0, s(bloco[0].startMs - FOLGA * 1000)),
  fim: s(bloco.at(-1).endMs + FOLGA * 1000),
});
const texto = (bloco) =>
  bloco
    .map((p) => p.text)
    .join("")
    .trim();

const blocos = agrupar(legendas, PAUSA_BLOCO);
console.log(`\n${blocos.length} blocos de fala (pausa ≥ ${PAUSA_BLOCO}s):\n`);
blocos.forEach((b, i) => {
  const t = trecho(b);
  console.log(
    `${String(i + 1).padStart(2)}. ${t.inicio.toFixed(2)}–${t.fim.toFixed(2)}s  ${texto(b)}`,
  );
});

const destino = path.join(RAIZ, "ganchos", `${slug}.json`);
if (existsSync(destino)) {
  console.log(
    `\n${path.relative(process.cwd(), destino)} já existe — não sobrescrevi.`,
  );
  process.exit(0);
}

const ganchos = blocos
  .slice(0, N_GANCHOS)
  .map((b) => ({ ...trecho(b), texto: texto(b) }));
const corpo = blocos
  .slice(N_GANCHOS)
  .flatMap((b) => agrupar(b, PAUSA_CORTE))
  .map((b) => ({ ...trecho(b), texto: texto(b) }));

mkdirSync(path.dirname(destino), { recursive: true });
writeFileSync(
  destino,
  JSON.stringify(
    {
      status:
        "RASCUNHO — confirmar ganchos e corpo com a Paty antes de renderizar",
      slug,
      arquivo: `brutos/${slug}/gravacao.mp4`,
      legendas: `legendas/${slug}.json`,
      enquadramento: "50% 35%",
      palavrasChave: [],
      ganchos,
      corpo,
    },
    null,
    2,
  ),
);
console.log(
  `\nRascunho salvo em ${path.relative(process.cwd(), destino)} (${ganchos.length} ganchos, ${corpo.length} trechos de corpo).`,
);
console.log(
  "Revise: tentativas erradas e frases repetidas no corpo precisam ser removidas à mão.",
);
