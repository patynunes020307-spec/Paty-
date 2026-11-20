// Gera as duas versões a partir do mesmo template (mesma lógica de cálculo).
// Uso: node precificacao/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const tpl = readFileSync(dir + "template.html", "utf8");
const seed = JSON.parse(readFileSync(dir + "seed-impactar.json", "utf8"));

const tokens = (light, dark) => {
  const block = o => Object.entries(o).map(([k, v]) => `--${k}:${v}`).join(";");
  const base = "--f-ui:'Manrope',system-ui,-apple-system,'Segoe UI',sans-serif;--f-num:'JetBrains Mono',ui-monospace,Menlo,monospace";
  return `:root{${base};${block(light)}}\n@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${block(dark)};color-scheme:dark}}\n:root[data-theme="dark"]{${block(dark)};color-scheme:dark}`;
};
const semLight = { good: "#1E6B4A", "good-bg": "#E2F1E8", bad: "#A3322B", "bad-bg": "#F8E3E0", warn: "#8A5A00", "warn-bg": "#FBF0D9" };
const semDark = { good: "#7FD3A6", "good-bg": "#173327", bad: "#F2958C", "bad-bg": "#3A1D1B", warn: "#F0C46A", "warn-bg": "#33270F" };

// Interna: cores oficiais da Impactar (projeto/src/marca.ts).
const interno = tokens(
  { bg: "#F7F2EF", surface: "#FFFFFF", surface2: "#FBF8F6", field: "#FFFFFF", fg: "#072126", muted: "#4F6670", line: "#E6DED4", accent: "#203F51", "on-accent": "#FFFFFF", ring: "rgba(132,169,172,.45)", chip: "#EAF1F1", ...semLight },
  { bg: "#072126", surface: "#0E2C33", surface2: "#12343C", field: "#0B262C", fg: "#EEF3F2", muted: "#9DB6B8", line: "#23474F", accent: "#84A9AC", "on-accent": "#072126", ring: "rgba(132,169,172,.4)", chip: "#163C44", ...semDark });
// Comercial: identidade neutra, sem marca.
const comercial = tokens(
  { bg: "#F4F5F7", surface: "#FFFFFF", surface2: "#F8F9FB", field: "#FFFFFF", fg: "#14171F", muted: "#5B6272", line: "#E1E4EA", accent: "#3B4BA8", "on-accent": "#FFFFFF", ring: "rgba(59,75,168,.25)", chip: "#ECEEF8", ...semLight },
  { bg: "#111318", surface: "#191C23", surface2: "#1E222B", field: "#15181E", fg: "#ECEEF2", muted: "#9AA1B0", line: "#2A2F3A", accent: "#9AA6F0", "on-accent": "#111318", ring: "rgba(154,166,240,.3)", chip: "#23283A", ...semDark });

const build = (mode, title, brand, tok, seedObj) => tpl
  .replace("__TITLE__", title)
  .replace("__TOKENS__", tok)
  .replace('"__MODE__"', JSON.stringify(mode))
  .replace("/*__SEED__*/null", seedObj ? JSON.stringify(seedObj) : "null")
  .replace("__BRAND__", JSON.stringify(brand));

mkdirSync(dir + "dist", { recursive: true });
writeFileSync(dir + "dist/interno.html", build("interno", "Precificação Impactar", { nome: "Impactar Cerimonial", sub: "Precificação interna" }, interno, seed));
const com = build("comercial", "Margem do Evento", { nome: "Margem do Evento", sub: "Precificação para cerimonialistas" }, comercial, null);
// Trava: nada da Impactar pode aparecer na versão comercial.
const proibidos = ["Impactar", "Viviane", "Paty", "6956", "6.956", "3338", "Essencial", "Plus", "Premium", "10435", "6900", "4200"];
const achados = proibidos.filter(p => com.includes(p));
if (achados.length) { console.error("ERRO: versão comercial contém:", achados); process.exit(1); }
writeFileSync(dir + "dist/comercial.html", com);
console.log("ok: dist/interno.html e dist/comercial.html");
