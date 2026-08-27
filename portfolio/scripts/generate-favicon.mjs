import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import toIco from 'to-ico';

const publicDir = path.join(process.cwd(), 'public');
const svgPath = path.join(publicDir, 'favicon.svg');
const svg = fs.readFileSync(svgPath);

const pngSizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  pngSizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), await toIco(pngBuffers));
await sharp(svg).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

console.log('Generated public/favicon.ico and public/apple-touch-icon.png');
