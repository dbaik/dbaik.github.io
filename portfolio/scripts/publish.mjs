#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const portfolioRoot = path.resolve(__dirname, '..');
const siteRoot = path.resolve(portfolioRoot, '..');
const distDir = path.join(portfolioRoot, 'dist');

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

console.log('Building portfolio...');
run('npm', ['run', 'build'], portfolioRoot);

const distIndex = path.join(distDir, 'index.html');
const distAssets = path.join(distDir, 'assets');

if (!fs.existsSync(distIndex) || !fs.existsSync(distAssets)) {
  console.error('Build output missing dist/index.html or dist/assets/.');
  process.exit(1);
}

console.log('Publishing to site root (index.html + assets only)...');
run('rsync', ['-a', '--delete', `${distAssets}/`, path.join(siteRoot, 'assets/')], portfolioRoot);
copyFile(distIndex, path.join(siteRoot, 'index.html'));

for (const fileName of [
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'hero-portrait.webp',
]) {
  const from = path.join(distDir, fileName);
  if (fs.existsSync(from)) {
    copyFile(from, path.join(siteRoot, fileName));
  }
}

for (const staleName of ['hero-portrait.jpg', 'hero-portrait.png']) {
  const stale = path.join(siteRoot, staleName);
  if (fs.existsSync(stale)) {
    fs.unlinkSync(stale);
  }
}

console.log('Publish complete.');
console.log(`  ${path.join(siteRoot, 'index.html')}`);
console.log(`  ${path.join(siteRoot, 'assets/')}`);
