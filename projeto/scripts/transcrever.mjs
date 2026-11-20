// Uso (dentro de projeto/):
//   node scripts/transcrever.mjs <video> <slug> [modelo]
// Gera public/legendas/<slug>.json (Caption[] com tempo de cada palavra).
// Modelo padrão: medium. Use large-v3-turbo se a máquina aguentar.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { transcrever } from "./lib-whisper.mjs";

const [entrada, slug, modelo] = process.argv.slice(2);
if (!entrada || !slug) {
  console.error("Uso: node scripts/transcrever.mjs <video> <slug> [modelo]");
  process.exit(1);
}

const legendas = await transcrever(entrada, slug, modelo);
const destino = path.resolve(import.meta.dirname, "..", "public", "legendas");
mkdirSync(destino, { recursive: true });
const arquivo = path.join(destino, `${slug}.json`);
writeFileSync(arquivo, JSON.stringify(legendas, null, 2));
console.log(
  `${legendas.length} palavras → ${path.relative(process.cwd(), arquivo)}`,
);
