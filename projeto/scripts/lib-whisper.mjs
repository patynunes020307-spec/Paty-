// Transcrição 100% local com whisper.cpp (regra 2 do CLAUDE.md: nunca API externa).
// Na primeira vez instala o whisper.cpp e baixa o modelo em projeto/whisper.cpp/ (fora do git).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from "@remotion/install-whisper-cpp";

const RAIZ = path.resolve(import.meta.dirname, "..");
export const WHISPER_DIR = path.join(RAIZ, "whisper.cpp");
const WHISPER_VERSAO = "1.5.5";

// Extrai o áudio (16 kHz mono) para .tmp/ — o arquivo de entrada nunca é alterado.
export const extrairAudio = (entrada, nome) => {
  const tmp = path.join(RAIZ, ".tmp");
  mkdirSync(tmp, { recursive: true });
  const wav = path.join(tmp, `${nome}.wav`);
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-i",
      entrada,
      "-ar",
      "16000",
      "-ac",
      "1",
      wav,
    ],
    { stdio: "inherit" },
  );
  return wav;
};

// Devolve legendas no formato Caption de @remotion/captions (tempos em ms).
// Modelo padrão: medium; WHISPER_MODELO=large-v3-turbo se a máquina aguentar.
export const transcrever = async (
  entrada,
  nome,
  modelo = process.env.WHISPER_MODELO ?? "medium",
) => {
  await installWhisperCpp({ to: WHISPER_DIR, version: WHISPER_VERSAO });
  // download interrompido deixa arquivo vazio que trava as próximas tentativas
  const bin = path.join(WHISPER_DIR, `ggml-${modelo}.bin`);
  if (existsSync(bin) && statSync(bin).size === 0) rmSync(bin);
  await downloadWhisperModel({ model: modelo, folder: WHISPER_DIR });
  const wav = extrairAudio(entrada, nome);
  const saida = await transcribe({
    inputPath: wav,
    whisperPath: WHISPER_DIR,
    whisperCppVersion: WHISPER_VERSAO,
    model: modelo,
    tokenLevelTimestamps: true,
    language: "pt",
  });
  return toCaptions({ whisperCppOutput: saida }).captions;
};
