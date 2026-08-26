import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src/assets/images');
const ORIGINALS_DIR = path.join(SRC_DIR, 'originals');
const COVERS_DIR = path.join(SRC_DIR, 'covers');
const PUBLIC_IMAGES_DIR = path.join(ROOT, 'public/images');
const CASES_JSON = path.join(ROOT, 'public/cases.json');

const DISPLAY_WIDTH = 1376;
const RETINA_WIDTH = 2752;
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 62;

const PROJECT_COVERS = [
  { source: 'image (3).png', slug: 'wwf' },
  { source: 'image (5).png', slug: 'mvp' },
  { source: 'image (2).png', slug: 'precision' },
  { source: 'image (6).png', slug: 'mochi' },
  { source: 'image (7).png', slug: 'bopper' },
  { source: 'image (4).png', slug: 'eleven' },
  { source: 'image.png', slug: 'schoolhouse' },
  { source: 'gaido-source.png', slug: 'gaido', legacySource: 'gaido.jpg' },
];

const PUBLIC_COVER_MAP = {
  'wwf-cover.jpg': 'wwf',
  'mvp-cover.jpg': 'mvp',
  'precision-cover.jpg': 'precision',
  'mochi-cover.jpg': 'mochi',
  'bopper-cover.jpg': 'bopper',
  'eleven-cover.jpg': 'eleven',
  'schoolhouse-cover.jpg': 'schoolhouse',
  'gaido-cover.jpg': 'gaido',
};

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

async function optimizeCoverSet(inputPath, slug, stats) {
  const metadata = await createImagePipeline(inputPath).metadata();
  const outputs = [];

  for (const width of [DISPLAY_WIDTH, RETINA_WIDTH]) {
    const suffix = width === DISPLAY_WIDTH ? '' : '@2x';

    for (const format of ['webp', 'avif']) {
      const fileName = `${slug}${suffix}.${format}`;
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

async function optimizeStandalonePublicImage(inputPath, stats) {
  const baseName = path.basename(inputPath, path.extname(inputPath));

  for (const width of [DISPLAY_WIDTH, RETINA_WIDTH]) {
    const suffix = width === DISPLAY_WIDTH ? '' : '@2x';

    for (const format of ['webp', 'avif']) {
      const outputPath = path.join(PUBLIC_IMAGES_DIR, `${baseName}${suffix}.${format}`);
      const bytes = await encodeVariant(inputPath, outputPath, width, format);
      stats.outputBytes += bytes;
      console.log(`  ${path.basename(outputPath)} (${formatBytes(bytes)})`);
    }
  }
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

function cleanupLegacyPublicImages() {
  for (const fileName of fs.readdirSync(PUBLIC_IMAGES_DIR)) {
    if (!/\.(jpe?g|png)$/i.test(fileName)) continue;

    const baseName = fileName.replace(/\.(jpe?g|png)$/i, '');
    const webpPath = path.join(PUBLIC_IMAGES_DIR, `${baseName}.webp`);
    if (!fs.existsSync(webpPath)) continue;

    fs.unlinkSync(path.join(PUBLIC_IMAGES_DIR, fileName));
    console.log(`  removed legacy ${fileName}`);
  }
}

function updateCasesJson() {
  if (!fs.existsSync(CASES_JSON)) return;

  const cases = JSON.parse(fs.readFileSync(CASES_JSON, 'utf8'));
  let updated = 0;

  for (const item of cases) {
    if (!item.cover_image || typeof item.cover_image !== 'string') continue;

    const fileName = path.basename(item.cover_image);
    if (PUBLIC_COVER_MAP[fileName] || item.cover_image.endsWith('.jpg') || item.cover_image.endsWith('.jpeg') || item.cover_image.endsWith('.png')) {
      item.cover_image = item.cover_image.replace(/\.(jpe?g|png)$/i, '.webp');
      updated += 1;
      continue;
    }
  }

  fs.writeFileSync(CASES_JSON, `${JSON.stringify(cases, null, 2)}\n`);
  console.log(`Updated ${updated} cover_image entries in cases.json`);
}

async function main() {
  ensureDir(COVERS_DIR);
  moveOriginals();

  const stats = { inputBytes: 0, outputBytes: 0 };

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

  console.log('\nOptimizing standalone public images...');

  const publicImages = fs
    .readdirSync(PUBLIC_IMAGES_DIR)
    .filter((file) => /\.(jpe?g|png)$/i.test(file))
    .sort();

  for (const fileName of publicImages) {
    if (PUBLIC_COVER_MAP[fileName]) {
      console.log(`  skip ${fileName} (generated from project source)`);
      continue;
    }

    const baseName = path.basename(fileName, path.extname(fileName));
    if (fs.existsSync(path.join(PUBLIC_IMAGES_DIR, `${baseName}.webp`))) {
      console.log(`  skip ${fileName} (already optimized)`);
      continue;
    }

    const inputPath = path.join(PUBLIC_IMAGES_DIR, fileName);
    stats.inputBytes += fs.statSync(inputPath).size;
    await optimizeStandalonePublicImage(inputPath, stats);
  }

  for (const [publicName, slug] of Object.entries(PUBLIC_COVER_MAP)) {
    const originalPath = path.join(
      ORIGINALS_DIR,
      PROJECT_COVERS.find((item) => item.slug === slug)?.source ?? '',
    );
    if (!fs.existsSync(originalPath)) continue;

    for (const width of [DISPLAY_WIDTH, RETINA_WIDTH]) {
      const suffix = width === DISPLAY_WIDTH ? '' : '@2x';
      for (const format of ['webp', 'avif']) {
        const outputPath = path.join(PUBLIC_IMAGES_DIR, `${publicName.replace(/\.jpe?g$/i, '')}${suffix}.${format}`);
        const bytes = await encodeVariant(originalPath, outputPath, width, format);
        stats.outputBytes += bytes;
      }
    }

    console.log(`  synced public variants for ${publicName}`);
  }

  console.log('\nRemoving legacy public image formats...');
  cleanupLegacyPublicImages();

  updateCasesJson();

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
