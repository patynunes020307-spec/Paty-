// Uso (dentro de projeto/):
//   node scripts/versoes-gancho.mjs <slug> --teste          trecho de validação (versão 1, 8 s)
//   node scripts/versoes-gancho.mjs <slug>                  todas as versões
//   node scripts/versoes-gancho.mjs <slug> --rodada v2      nova rodada sem sobrescrever a anterior
//   node scripts/versoes-gancho.mjs <slug> --so 3           só a versão 3
//
// Lê ganchos/<slug>.json (confirmado pela Paty), renderiza cada versão
// (gancho N + o mesmo corpo), iguala o volume da voz e confere cada arquivo:
// formato, quadro preto, pausa longa e texto (nova transcrição comparada ao esperado).
// Saída: exports/<slug>[-rodada]-versao-N.mp4 + exports/<slug>[-rodada]-relatorio.md
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { transcrever } from "./lib-whisper.mjs";

const RAIZ = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const slug = args[0];
const opcao = (nome) => {
  const i = args.indexOf(`--${nome}`);
  return i === -1 ? undefined : args[i + 1];
};
const TESTE = args.includes("--teste");
const RODADA = opcao("rodada");
const SO = opcao("so") ? Number(opcao("so")) : undefined;
const SEM_TRANSCRICAO = args.includes("--sem-transcricao");

if (!slug) {
  console.error(
    "Uso: node scripts/versoes-gancho.mjs <slug> [--teste] [--rodada v2] [--so N]",
  );
  process.exit(1);
}

const config = JSON.parse(
  readFileSync(path.join(RAIZ, "ganchos", `${slug}.json`), "utf8"),
);
if (String(config.status ?? "").startsWith("RASCUNHO")) {
  console.error(
    "ganchos/" +
      slug +
      '.json ainda é RASCUNHO. Confirme ganchos e corpo com a Paty e troque o status para "confirmado".',
  );
  process.exit(1);
}
const legendas = JSON.parse(
  readFileSync(path.join(RAIZ, "public", config.legendas), "utf8"),
);

const base = RODADA ? `${slug}-${RODADA}` : slug;
const exports = path.join(RAIZ, "exports");
const tmp = path.join(RAIZ, ".tmp");
mkdirSync(exports, { recursive: true });
mkdirSync(tmp, { recursive: true });

const versoes = TESTE ? [1] : SO ? [SO] : config.ganchos.map((_, i) => i + 1);

const destinoDe = (n) =>
  path.join(exports, TESTE ? `${base}-teste.mp4` : `${base}-versao-${n}.mp4`);

// Nunca sobrescreve versão entregue (regra do /iniciar)
if (!TESTE) {
  const existentes = versoes.map(destinoDe).filter(existsSync);
  if (existentes.length) {
    console.error(
      `Já existe: ${existentes.map((e) => path.basename(e)).join(", ")}. Use --rodada v2 (ou seguinte).`,
    );
    process.exit(1);
  }
}

const sh = (cmd, a, opts = {}) =>
  execFileSync(cmd, a, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...opts,
  });

// Texto esperado de uma versão = palavras da transcrição original dentro dos trechos usados
const palavrasDe = (texto) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const esperadoDe = (trechos, limiteS) => {
  let decorrido = 0;
  const saida = [];
  for (const t of trechos) {
    for (const c of legendas) {
      if (c.startMs >= t.inicio * 1000 - 50 && c.endMs <= t.fim * 1000 + 50) {
        const naSaida = decorrido + (c.startMs / 1000 - t.inicio);
        if (limiteS === undefined || naSaida < limiteS) saida.push(c.text);
      }
    }
    decorrido += t.fim - t.inicio;
  }
  return palavrasDe(saida.join(" "));
};

// Diferença palavra a palavra (LCS): o que sumiu e o que sobrou
const diferenca = (esperado, obtido) => {
  const m = esperado.length;
  const n = obtido.length;
  const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      d[i][j] =
        esperado[i] === obtido[j]
          ? d[i + 1][j + 1] + 1
          : Math.max(d[i + 1][j], d[i][j + 1]);
  const faltando = [];
  const sobrando = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (esperado[i] === obtido[j]) {
      i++;
      j++;
    } else if (d[i + 1][j] >= d[i][j + 1]) faltando.push(esperado[i++]);
    else sobrando.push(obtido[j++]);
  }
  faltando.push(...esperado.slice(i));
  sobrando.push(...obtido.slice(j));
  return { faltando, sobrando, acerto: m ? d[0][0] / m : 1 };
};

const conferir = async (arquivo, trechos, duracaoEsperada) => {
  const problemas = [];
  const info = JSON.parse(
    sh("ffprobe", [
      "-v",
      "error",
      "-show_streams",
      "-show_format",
      "-of",
      "json",
      arquivo,
    ]),
  );
  const v = info.streams.find((s) => s.codec_type === "video");
  const a = info.streams.find((s) => s.codec_type === "audio");
  const dur = Number(info.format.duration);
  if (v.width !== 1080 || v.height !== 1920)
    problemas.push(`resolução ${v.width}×${v.height}`);
  if (v.r_frame_rate !== "30/1") problemas.push(`fps ${v.r_frame_rate}`);
  if (!a) problemas.push("sem áudio");
  if (Math.abs(dur - duracaoEsperada) > 0.25)
    problemas.push(
      `duração ${dur.toFixed(2)}s (esperado ${duracaoEsperada.toFixed(2)}s)`,
    );

  // filtros de análise do ffmpeg escrevem no stderr
  const analise = (filtro) =>
    spawnSync(
      "ffmpeg",
      ["-hide_banner", "-nostats", "-i", arquivo, ...filtro, "-f", "null", "-"],
      {
        encoding: "utf8",
      },
    ).stderr;
  const pretos = [
    ...analise(["-vf", "blackdetect=d=0.05:pix_th=0.08", "-an"]).matchAll(
      /black_start:([\d.]+)/g,
    ),
  ].map((m) => Number(m[1]));
  if (pretos.length)
    problemas.push(
      `quadro preto em ${pretos.map((p) => p.toFixed(2) + "s").join(", ")}`,
    );

  const silencio = analise(["-af", "silencedetect=n=-35dB:d=1.2", "-vn"]);
  const pausas = [...silencio.matchAll(/silence_start: ([\d.]+)/g)].map((m) =>
    Number(m[1]),
  );
  if (pausas.length)
    problemas.push(
      `pausa > 1,2 s em ${pausas.map((p) => p.toFixed(2) + "s").join(", ")}`,
    );

  let texto = "não conferido";
  if (!SEM_TRANSCRICAO) {
    const obtido = palavrasDe(
      (await transcrever(arquivo, `qa-${path.basename(arquivo, ".mp4")}`))
        .map((c) => c.text)
        .join(" "),
    );
    const esperado = esperadoDe(trechos, TESTE ? duracaoEsperada : undefined);
    const { faltando, sobrando, acerto } = diferenca(esperado, obtido);
    texto = `${Math.round(acerto * 100)}% das palavras`;
    // Whisper erra 1–2 palavras por natureza; acima disso, investigar o corte
    if (faltando.length > 2)
      problemas.push(`palavras faltando: ${faltando.join(" ")}`);
    if (sobrando.length > 2)
      problemas.push(`palavras a mais: ${sobrando.join(" ")}`);
  }
  return { dur, texto, problemas };
};

// Na nuvem (sessões do Claude Code) usa o Chromium já instalado; no computador, o do Remotion
const CHROMIUM = process.env.REMOTION_CHROMIUM ?? "/opt/pw-browsers/chromium";
const NAVEGADOR = existsSync(CHROMIUM)
  ? [`--browser-executable=${CHROMIUM}`]
  : [];

const linhas = [];
for (const n of versoes) {
  const gancho = config.ganchos[n - 1];
  if (!gancho) {
    console.error(
      `Versão ${n} não existe (há ${config.ganchos.length} ganchos).`,
    );
    process.exit(1);
  }
  const trechos = [gancho, ...config.corpo];
  const total =
    trechos.reduce((t, c) => t + Math.round((c.fim - c.inicio) * 30), 0) / 30;
  const durEsperada = TESTE ? Math.min(8, total) : total;

  const props = path.join(tmp, `${base}-props-${n}.json`);
  writeFileSync(
    props,
    JSON.stringify({
      arquivo: config.arquivo,
      legendas: config.legendas,
      enquadramento: config.enquadramento,
      palavrasChave: config.palavrasChave ?? [],
      ganchos: config.ganchos,
      corpo: config.corpo,
      versao: n,
    }),
  );

  const bruto = path.join(tmp, `${base}-versao-${n}-render.mp4`);
  const destino = destinoDe(n);
  console.log(`\n▶ Versão ${n}: "${gancho.texto ?? ""}"`);
  execFileSync(
    "npx",
    [
      "remotion",
      "render",
      "VersaoGancho",
      bruto,
      `--props=${props}`,
      ...NAVEGADOR,
      ...(TESTE ? [`--frames=0-${Math.round(durEsperada * 30) - 1}`] : []),
    ],
    { cwd: RAIZ, stdio: "inherit" },
  );
  // Volume da voz igual do começo ao fim (padrão de redes: -14 LUFS, pico -1 dB)
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-i",
      bruto,
      "-c:v",
      "copy",
      "-af",
      "loudnorm=I=-14:TP=-1:LRA=11",
      "-ar",
      "48000",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      destino,
    ],
    { stdio: "inherit" },
  );
  rmSync(bruto);

  const qa = await conferir(destino, trechos, durEsperada);
  linhas.push({
    n,
    gancho: gancho.texto ?? "",
    arquivo: path.basename(destino),
    ...qa,
  });
}

const tabela = [
  "| Arquivo | Gancho | Duração | Texto conferido | Problemas |",
  "|---|---|---|---|---|",
  ...linhas.map(
    (l) =>
      `| ${l.arquivo} | ${l.gancho} | ${l.dur.toFixed(1)} s | ${l.texto} | ${l.problemas.length ? l.problemas.join("; ") : "nenhum"} |`,
  ),
].join("\n");

const relatorio = path.join(
  exports,
  TESTE ? `${base}-teste-relatorio.md` : `${base}-relatorio.md`,
);
writeFileSync(
  relatorio,
  `# ${base} — versões de gancho\n\n${tabela}\n\nEstalo no som e legenda cobrindo o rosto não são detectados automaticamente: conferir assistindo.\n`,
);
console.log(
  `\n${tabela}\n\nRelatório: ${path.relative(process.cwd(), relatorio)}`,
);
