// scripts/optimize-images.cjs
// CommonJS version for projects with "type": "module" in package.json
// Usage: npm run images:optimize

const fs = require('fs');
const path = require('path');

(async function main() {
  const sharp = safeRequire('sharp');
  if (!sharp) {
    console.error('sharp is not installed. Please run `npm install --save-dev sharp` and try again.');
    process.exit(1);
  }

  const srcDir = path.join(__dirname, '..', 'src', 'assets');
  const srcFile = path.join(srcDir, 'hero-bg.webp');
  if (!fs.existsSync(srcFile)) {
    console.error('Source image not found:', srcFile);
    process.exit(1);
  }

  const sizes = [480, 768, 1200, 1920];
  console.log('Generating responsive images for:', srcFile);

  for (const w of sizes) {
    const outFile = path.join(srcDir, `hero-bg-${w}.webp`);
    try {
      await sharp(srcFile)
        .resize({ width: w })
        .webp({ quality: 80 })
        .toFile(outFile);
      console.log('Created', path.relative(process.cwd(), outFile));
    } catch (err) {
      console.error('Failed to resize to', w, err);
    }
  }

  console.log('Done. You can now reference the generated files in your Hero component via srcset.');
})();

function safeRequire(name) {
  try { return require(name); } catch (e) { return null; }
}
