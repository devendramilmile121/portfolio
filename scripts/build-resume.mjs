// Prints the /resume page to a PDF with headless Chrome: `npm run resume`.
//
// The page is built from public/config/portfolio.json, so re-run this whenever the experience,
// skills or contact details change, and commit the PDF. It is written to public/ (so every
// later build ships it) and to dist/ (so the current build has it too).
//
// Needs Google Chrome; set CHROME_PATH if it isn't in the default macOS location.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PORT = 4791;
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/config/portfolio.json'), 'utf8'));
const pdfPath = config.resume?.pdf;
if (!pdfPath) throw new Error('build-resume: set resume.pdf in public/config/portfolio.json');

const chromePath =
  process.env.CHROME_PATH ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) =>
    fs.existsSync(p)
  );
if (!chromePath) throw new Error('build-resume: Chrome not found; set CHROME_PATH');
if (!fs.existsSync(path.join(ROOT, 'dist/resume.html'))) throw new Error('build-resume: run `npm run build` first');

const run = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`))));
  });

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
try {
  let ready = false;
  for (let i = 0; i < 50 && !ready; i++) {
    await new Promise((r) => setTimeout(r, 200));
    ready = await fetch(`http://localhost:${PORT}/resume`).then((r) => r.ok, () => false);
  }
  if (!ready) throw new Error('build-resume: preview server did not start');

  const target = path.join(ROOT, 'public', pdfPath);
  await run(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=5000',
    `--user-data-dir=${path.join(ROOT, 'node_modules/.cache/resume-chrome')}`,
    `--print-to-pdf=${target}`,
    `http://localhost:${PORT}/resume`,
  ]);
  fs.copyFileSync(target, path.join(ROOT, 'dist', pdfPath));
  console.log(`build-resume: wrote public${pdfPath} (${Math.round(fs.statSync(target).size / 1024)} KB)`);
} finally {
  preview.kill();
}
