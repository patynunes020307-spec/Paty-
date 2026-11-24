/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import fs from "node:fs";
import path from "node:path";
import { Config } from "@remotion/cli/config";

// Temporários do render ficam dentro do projeto (projeto/.tmp)
const tmpDir = path.join(process.cwd(), ".tmp");
process.env.TEMP = tmpDir;
process.env.TMP = tmpDir;
process.env.TMPDIR = tmpDir;

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Na nuvem (Claude Code web) o download do Chrome do Remotion é bloqueado pela rede:
// usa o Chromium headless já instalado no container. No computador da Paty este caminho não existe e nada muda.
const chromiumNuvem =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(chromiumNuvem)) {
  Config.setBrowserExecutable(chromiumNuvem);
}
