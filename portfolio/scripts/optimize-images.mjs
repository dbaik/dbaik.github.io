import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src/assets/images');
const ORIGINALS_DIR = path.join(SRC_DIR, 'originals');
const COVERS_DIR = path.join(SRC_DIR, 'covers');
const PUBLIC_DIR = path.join(ROOT, 'public');
const COVER_IMAGES_MODULE = path.join(ROOT, 'src/data/coverImages.ts');
const HERO_PORTRAIT_SOURCE = path.join(SRC_DIR, 'hero-portrait-source.jpg');
const HERO_PORTRAIT_OUTPUT = path.join(PUBLIC_DIR, 'hero-portrait.webp');
const HERO_PORTRAIT_WIDTH = 560;
const HERO_BG = [176, 173, 168];
const HERO_BG_DISTANCE = 22;

const OUTPUT_WIDTHS = [640, 688, 960, 1376, 2752];
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 62;

const PROJECT_COVERS = [
  { source: 'image (3).png', slug: 'wwf', width: 1376, height: 768 },
  { source: 'image (5).png', slug: 'mvp', width: 1376, height: 768 },
  { source: 'image (2).png', slug: 'precision', width: 1376, height: 768 },
  { source: 'image (6).png', slug: 'mochi', width: 1376, height: 768 },
  { source: 'image (7).png', slug: 'bopper', width: 1376, height: 768 },
  { source: 'image (4).png', slug: 'eleven', width: 1376, height: 768 },
  { source: 'image.png', slug: 'schoolhouse', width: 1376, height: 768 },
  { source: 'gaido-source.png', slug: 'gaido', width: 1376, height: 880, legacySource: 'gaido.jpg' },
  { source: 'energy-coalition.jpg', slug: 'energy', width: 1376, height: 768 },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function repairJpegBuffer(buffer) {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return buffer;
  }

  const jfifIndex = buffer.indexOf(Buffer.from('JFIF'));
  if (jfifIndex >= 2) {
    return Buffer.concat([
      Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
      buffer.subarray(jfifIndex - 2),
    ]);
  }

  return buffer;
}

function createImagePipeline(inputPath) {
  const buffer = fs.readFileSync(inputPath);
  const ext = path.extname(inputPath).toLowerCase();

  if (ext === '.jpg' || ext === '.jpeg') {
    return sharp(repairJpegBuffer(buffer), { failOn: 'none' });
  }

  return sharp(buffer, { failOn: 'none' });
}

async function encodeVariant(inputPath, outputPath, width, format) {
  let pipeline = createImagePipeline(inputPath).rotate().resize({
    width,
    withoutEnlargement: true,
    fit: 'inside',
  });

  if (format === 'webp') {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY, effort: 6 });
  } else {
    pipeline = pipeline.avif({ quality: AVIF_QUALITY, effort: 6 });
  }

  await pipeline.toFile(outputPath);
  return fs.statSync(outputPath).size;
}

function removeLegacyCoverOutputs() {
  if (!fs.existsSync(COVERS_DIR)) {
    return;
  }

  for (const fileName of fs.readdirSync(COVERS_DIR)) {
    if (/^[^.]+\.(avif|webp)$/.test(fileName) || /^[^.]+\@2x\.(avif|webp)$/.test(fileName)) {
      fs.unlinkSync(path.join(COVERS_DIR, fileName));
    }
  }
}

async function optimizeCoverSet(inputPath, slug, stats) {
  const metadata = await createImagePipeline(inputPath).metadata();
  const outputs = [];

  for (const width of OUTPUT_WIDTHS) {
    for (const format of ['webp', 'avif']) {
      const fileName = `${slug}-w${width}.${format}`;
      const outputPath = path.join(COVERS_DIR, fileName);
      const bytes = await encodeVariant(inputPath, outputPath, width, format);
      outputs.push({ fileName, bytes });
      stats.outputBytes += bytes;
    }
  }

  console.log(
    `  ${slug}: ${metadata.width}x${metadata.height} -> ${outputs.map((item) => `${item.fileName} (${formatBytes(item.bytes)})`).join(', ')}`,
  );
}

function moveOriginals() {
  ensureDir(ORIGINALS_DIR);

  for (const { source } of PROJECT_COVERS) {
    const currentPath = path.join(SRC_DIR, source);
    const originalPath = path.join(ORIGINALS_DIR, source);

    if (fs.existsSync(currentPath) && !fs.existsSync(originalPath)) {
      fs.renameSync(currentPath, originalPath);
    }
  }
}

function toImportName(slug, width, format) {
  return `${slug}_w${width}_${format}`;
}

async function cutoutHeroPortrait(inputPath) {
  const { data, info } = await createImagePipeline(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;
  const alpha = new Uint8Array(width * height);
  alpha.fill(255);

  const colorDist = (i) => {
    const dr = data[i] - HERO_BG[0];
    const dg = data[i + 1] - HERO_BG[1];
    const db = data[i + 2] - HERO_BG[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  const seen = new Uint8Array(width * height);
  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (seen[idx]) return;
    seen[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  let cursor = 0;
  while (cursor < queue.length) {
    const idx = queue[cursor];
    cursor += 1;
    const distance = colorDist(idx * channels);
    if (distance > HERO_BG_DISTANCE) continue;

    const t = Math.min(1, distance / HERO_BG_DISTANCE);
    alpha[idx] = Math.round(t * t * 255);

    const x = idx % width;
    const y = (idx - x) / width;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  const pixels = Buffer.from(data);
  for (let p = 0; p < width * height; p += 1) {
    pixels[p * 4 + 3] = alpha[p];
    if (alpha[p] === 0) {
      pixels[p * 4] = 0;
      pixels[p * 4 + 1] = 0;
      pixels[p * 4 + 2] = 0;
    }
  }

  return sharp(pixels, { raw: { width, height, channels: 4 } });
}

async function optimizeHeroPortrait() {
  if (!fs.existsSync(HERO_PORTRAIT_SOURCE)) {
    throw new Error(`Missing hero portrait source: ${HERO_PORTRAIT_SOURCE}`);
  }

  ensureDir(PUBLIC_DIR);
  await (await cutoutHeroPortrait(HERO_PORTRAIT_SOURCE))
    .resize(HERO_PORTRAIT_WIDTH, HERO_PORTRAIT_WIDTH, {
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(HERO_PORTRAIT_OUTPUT);

  const legacyJpg = path.join(PUBLIC_DIR, 'hero-portrait.jpg');
  const legacyPng = path.join(PUBLIC_DIR, 'hero-portrait.png');
  if (fs.existsSync(legacyJpg)) fs.unlinkSync(legacyJpg);
  if (fs.existsSync(legacyPng)) fs.unlinkSync(legacyPng);

  const sourceBytes = fs.statSync(HERO_PORTRAIT_SOURCE).size;
  const outputBytes = fs.statSync(HERO_PORTRAIT_OUTPUT).size;
  console.log(
    `  hero-portrait: ${formatBytes(sourceBytes)} -> ${path.relative(ROOT, HERO_PORTRAIT_OUTPUT)} (${formatBytes(outputBytes)})`,
  );
}

function generateCoverImagesModule() {
  const importLines = [];
  const registryEntries = [];

  for (const { slug, width, height } of PROJECT_COVERS) {
    const variantLines = [];

    for (const outputWidth of OUTPUT_WIDTHS) {
      for (const format of ['avif', 'webp']) {
        const importName = toImportName(slug, outputWidth, format);
        const fileName = `${slug}-w${outputWidth}.${format}`;
        importLines.push(`import ${importName} from '../assets/images/covers/${fileName}';`);
      }
    }

    for (const outputWidth of OUTPUT_WIDTHS) {
      variantLines.push(
        `      { width: ${outputWidth}, avif: ${toImportName(slug, outputWidth, 'avif')}, webp: ${toImportName(slug, outputWidth, 'webp')} },`,
      );
    }

    registryEntries.push(
      `  ${slug}: coverImageSet([\n${variantLines.join('\n')}\n    ], ${width}, ${height}),`,
    );
  }

  const contents = `// AUTO-GENERATED by scripts/optimize-images.mjs — do not edit manually.

import { coverImageSet, type CoverImageRegistry } from '../types/coverImage';

${importLines.join('\n')}

export const COVER_IMAGES = {
${registryEntries.join('\n')}
} satisfies CoverImageRegistry;
`;

  fs.writeFileSync(COVER_IMAGES_MODULE, contents);
  console.log(`\nGenerated ${path.relative(ROOT, COVER_IMAGES_MODULE)}`);
}

async function main() {
  ensureDir(COVERS_DIR);
  moveOriginals();
  removeLegacyCoverOutputs();

  const stats = { inputBytes: 0, outputBytes: 0 };

  console.log('Optimizing hero portrait...');
  await optimizeHeroPortrait();

  console.log('Optimizing project covers...');

  for (const { source, slug, legacySource } of PROJECT_COVERS) {
    const inputPath = path.join(ORIGINALS_DIR, source);
    const legacyPath = legacySource ? path.join(ORIGINALS_DIR, legacySource) : null;

    if (!fs.existsSync(inputPath)) {
      if (legacyPath && fs.existsSync(legacyPath)) {
        throw new Error(`Missing repaired source for ${slug}. Add ${source} or fix ${legacySource}.`);
      }
      throw new Error(`Missing source image: ${inputPath}`);
    }

    stats.inputBytes += fs.statSync(inputPath).size;
    await optimizeCoverSet(inputPath, slug, stats);
  }

  generateCoverImagesModule();

  const saved = stats.inputBytes - stats.outputBytes;
  const ratio = stats.inputBytes > 0 ? ((saved / stats.inputBytes) * 100).toFixed(1) : '0.0';

  console.log('\nDone.');
  console.log(`Input:  ${formatBytes(stats.inputBytes)}`);
  console.log(`Output: ${formatBytes(stats.outputBytes)}`);
  console.log(`Saved:  ${formatBytes(Math.max(saved, 0))} (${ratio}%)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
