import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

function rewriteCssUrlsForHtml(css: string, fileName: string): string {
  const cssDir = path.posix.dirname(fileName);
  if (cssDir === '.' || cssDir === '') return css;

  return css.replace(/url\((['"]?)(\.\/[^'")]+)\1\)/g, (_match, quote: string, url: string) => {
    const rewritten = `./${cssDir}/${url.slice(2)}`;
    return `url(${quote}${rewritten}${quote})`;
  });
}

/** Inline the main stylesheet and preload only the hero display font. */
function inlineCssAndPreloadFontsPlugin(): Plugin {
  const inlinedCss = new Set<string>();

  return {
    name: 'inline-css-and-preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;

        let next = html;

        for (const item of Object.values(bundle)) {
          if (item.type !== 'asset' || !item.fileName.endsWith('.css')) continue;

          const href = `./${item.fileName}`;
          const raw = typeof item.source === 'string' ? item.source : item.source.toString();
          const css = rewriteCssUrlsForHtml(raw, item.fileName).replace(/<\/style>/gi, '<\\/style>');
          const linkPattern = new RegExp(
            `\\s*<link[^>]*rel=["']stylesheet["'][^>]*href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`,
            'i',
          );
          if (linkPattern.test(next)) {
            inlinedCss.add(item.fileName);
            next = next.replace(linkPattern, `\n    <style>${css}</style>`);
          }
        }

        const fontHrefs = Object.values(bundle)
          .filter((item) => item.type === 'asset' && item.fileName.endsWith('.woff2'))
          .map((item) => (item.type === 'asset' ? item.fileName : ''))
          .filter((fileName) => fileName.includes('syne-latin-800'))
          .sort();

        if (fontHrefs.length === 0) return next;

        const links = fontHrefs
          .map(
            (fileName) =>
              `    <link rel="preload" href="./${fileName}" as="font" type="font/woff2" crossorigin />`,
          )
          .join('\n');

        return next.replace(/\s*<\/head>/, `\n${links}\n  </head>`);
      },
    },
    writeBundle(options) {
      const outDir = options.dir;
      if (!outDir) return;

      for (const fileName of inlinedCss) {
        const filePath = path.join(outDir, fileName);
        try {
          fs.unlinkSync(filePath);
        } catch {
          // File may already be gone on incremental rebuilds.
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), inlineCssAndPreloadFontsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      cssCodeSplit: true,
      modulePreload: {
        resolveDependencies(filename, deps) {
          // Keep motion/gsap/lenis off the initial modulepreload list; they load on demand.
          return deps.filter(
            (dep) =>
              !dep.includes('motion') &&
              !dep.includes('gsap') &&
              !dep.includes('lenis'),
          );
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('gsap')) {
              return 'gsap';
            }

            if (id.includes('lenis')) {
              return 'lenis';
            }

            if (id.includes('motion')) {
              return 'motion';
            }

            if (id.includes('lucide-react')) {
              return 'icons';
            }

            if (id.includes('@formspree')) {
              return 'formspree';
            }

            return undefined;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
