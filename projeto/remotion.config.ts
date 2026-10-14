/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

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
