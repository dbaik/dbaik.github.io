import { chromium, devices } from 'playwright';

const BASE_URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:4174/';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ...devices['Pixel 5'],
});
const page = await context.newPage();

const requests = [];
page.on('request', (request) => {
  requests.push(request.url());
});

const consoleErrors = [];
page.on('console', (message) => {
  if (message.type() === 'error') {
    consoleErrors.push(message.text());
  }
});

page.on('pageerror', (error) => {
  consoleErrors.push(error.message);
});

await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForSelector('h1', { timeout: 15_000 });

await page.evaluate(async () => {
  const step = Math.max(window.innerHeight * 0.8, 400);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  window.scrollTo(0, document.body.scrollHeight);
});

await page.waitForTimeout(1500);

const domChecks = await page.evaluate(() => {
  const resources = performance.getEntriesByType('resource').map((entry) => entry.name);
  const googleFontRequests = resources.filter(
    (url) => url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com'),
  );

  const radios = [...document.querySelectorAll('input[type="radio"][name="project_type"]')];
  const fieldset = document.querySelector('#contact fieldset');
  const legend = fieldset?.querySelector('legend');
  const avifSources = [...document.querySelectorAll('picture source[type="image/avif"]')];
  const srcsets = avifSources.map((source) => source.getAttribute('srcset') ?? '');
  const sizes = avifSources.map((source) => source.getAttribute('sizes') ?? '');

  return {
    title: document.title,
    heroVisible: !!document.querySelector('#hero h1')?.textContent?.includes('Figma'),
    googleFontRequests,
    selfHostedFonts: resources.filter((url) => url.includes('plus-jakarta-sans') || url.includes('syne-latin')),
    radioCount: radios.length,
    radioValues: radios.map((radio) => radio.value),
    fieldsetExists: Boolean(fieldset),
    legendText: legend?.textContent?.trim() ?? null,
    pictureCount: avifSources.length,
    sampleSrcset: srcsets[0] ?? null,
    hasWidthDescriptors: srcsets.length > 0 && srcsets.every((srcset) => /\d+w/.test(srcset)),
    hasDensityDescriptors: srcsets.some((srcset) => /\b1x\b|\b2x\b/.test(srcset)),
    sampleSizes: sizes[0] ?? null,
    slate500Count: document.querySelectorAll('.text-slate-500').length,
    textSecondary: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
    contactSectionVisible: Boolean(document.getElementById('contact')),
  };
});

const imageRequests = requests.filter((url) => /\/assets\/.*\.(avif|webp)(\?|$)/.test(url));
const loadedWidths = imageRequests
  .map((url) => {
    const match = url.match(/-w(\d+)-/);
    return match ? Number(match[1]) : null;
  })
  .filter(Boolean);

const maxLoadedWidth = loadedWidths.length > 0 ? Math.max(...loadedWidths) : null;
const usesOversizedImagesOnMobile = maxLoadedWidth !== null && maxLoadedWidth >= 2752;

const checks = [
  { name: 'Page title loads', pass: domChecks.title.length > 0 },
  { name: 'Hero renders', pass: domChecks.heroVisible },
  { name: 'No Google Fonts requests', pass: domChecks.googleFontRequests.length === 0 },
  { name: 'Self-hosted fonts requested', pass: domChecks.selfHostedFonts.length >= 2 },
  {
    name: 'Contact radios exist',
    pass:
      domChecks.radioCount === 4 &&
      JSON.stringify(domChecks.radioValues) ===
        JSON.stringify(['WordPress development', 'Shopify development', 'Frontend / performance', 'Other']),
  },
  { name: 'Contact project type uses fieldset', pass: domChecks.fieldsetExists && domChecks.legendText === 'PROJECT TYPE' },
  { name: 'Semantic contrast vars present', pass: Boolean(domChecks.textSecondary) },
  { name: 'Responsive srcset uses w descriptors', pass: domChecks.hasWidthDescriptors && !domChecks.hasDensityDescriptors },
  { name: 'Picture sizes attribute present', pass: Boolean(domChecks.sampleSizes?.includes('100vw')) },
  { name: 'Mobile avoids 2752w cover images', pass: !usesOversizedImagesOnMobile },
  { name: 'No text-slate-500 in DOM', pass: domChecks.slate500Count === 0 },
  { name: 'No console/page errors', pass: consoleErrors.length === 0 },
];

const screenshotPath = '/Users/db/AI/dbaik.github.io/portfolio/.playwright-cli/verify-mobile.png';
await page.screenshot({ path: screenshotPath, fullPage: false });

await browser.close();

const summary = {
  url: BASE_URL,
  checks,
  passed: checks.filter((check) => check.pass).length,
  total: checks.length,
  domChecks,
  imageRequests: imageRequests.slice(0, 12),
  loadedWidths: [...new Set(loadedWidths)].sort((a, b) => a - b),
  maxLoadedWidth,
  consoleErrors,
  screenshotPath,
};

console.log(JSON.stringify(summary, null, 2));

if (summary.passed !== summary.total) {
  process.exit(1);
}
