// FridayFinds hand-in program for black-friday-deal-finder-01.
//
// What it does, in plain terms: the deal finder lives in app/ next to this file — static HTML, CSS
// and JavaScript with no build step and no network loads. This program gathers that site plus the
// screenshots/ renders into the output directory and writes dossier.json there, using the vendored
// make.fun library (vendor/makefun-frontend.ts, untouched) to build the dossier the scorer compares
// byte for byte. It runs on Node 22 with the standard library only.
//
// Run it outside the grader like this:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used instead.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const shotsDir = join(outputDir, 'screenshots');

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

mkdirSync(shotsDir, { recursive: true });
const localShots = join(repoRoot, 'screenshots');
if (existsSync(localShots)) cpSync(localShots, shotsDir, { recursive: true });

// Caps from the scorer: the dossier text is capped at 160 KiB; an entry is refused above
// 4 screenshots, 256 KiB per screenshot, 993 files / 16 MiB in app/.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
