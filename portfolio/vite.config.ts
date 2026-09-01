import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

/** Inject <link rel="preload"> for hashed woff2 fonts so they start with CSS, not after it. */
function preloadFontsPlugin(): Plugin {
  return {
    name: 'preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;

        const fontHrefs = Object.values(bundle)
          .filter((item) => item.type === 'asset' && item.fileName.endsWith('.woff2'))
          .map((item) => (item.type === 'asset' ? item.fileName : ''))
          .filter((fileName) => fileName.includes('syne-latin-800'))
          .sort();

        if (fontHrefs.length === 0) return html;

        const links = fontHrefs
          .map(
            (fileName) =>
              `    <link rel="preload" href="./${fileName}" as="font" type="font/woff2" crossorigin />`,
          )
          .join('\n');

        return html.replace(/\s*<\/head>/, `\n${links}\n  </head>`);
      },
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), preloadFontsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      cssCodeSplit: false,
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
