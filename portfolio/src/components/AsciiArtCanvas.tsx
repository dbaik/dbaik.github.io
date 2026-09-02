import { useEffect, useRef, useState } from 'react';
import {
  readPinnedColorScheme,
  resolvedColorScheme,
  type PinnedColorScheme,
} from '../utils/colorScheme';

interface AsciiArtCanvasProps {
  src: string;
  className?: string;
  label?: string;
}

interface Glyph {
  x: number;
  y: number;
  ink: number;
  row: number;
}

const CHARS = ' .:-=+*#%@'.split('');
const SOURCE_ASPECT = 1;
const PAPER_LUMA = 0.93;
const MIN_INK = 0.07;
const CELL_WIDTH_RATIO = 0.72;
const CELL_HEIGHT_RATIO = 1.12;

function glyphFontSize(width: number): number {
  return width <= 270 ? 6 : 7;
}

function canvasBox(viewportWidth: number): { w: number; h: number } {
  const size =
    viewportWidth <= 480 ? 340 : viewportWidth <= 900 ? 380 : viewportWidth <= 1280 ? 400 : 420;
  return { w: size, h: Math.round(size / SOURCE_ASPECT) };
}

function sampleLuma(data: Uint8ClampedArray, width: number, height: number, x: number, y: number): number {
  const cx = Math.max(0, Math.min(width - 1, Math.floor(x)));
  const cy = Math.max(0, Math.min(height - 1, Math.floor(y)));
  const i = (cy * width + cx) * 4;
  const alpha = data[i + 3] / 255;
  if (alpha < 0.06) return 1;
  const luma = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
  return luma * alpha + (1 - alpha);
}

function cellAvg(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  originX: number,
  originY: number,
  cellW: number,
  cellH: number,
): number {
  let sum = 0;
  let count = 0;
  const stepX = Math.max(1, cellW / 4);
  const stepY = Math.max(1, cellH / 4);

  for (let y = originY; y < originY + cellH; y += stepY) {
    for (let x = originX; x < originX + cellW; x += stepX) {
      sum += sampleLuma(data, width, height, x, y);
      count += 1;
    }
  }

  return count > 0 ? sum / count : 1;
}

function processImage(img: HTMLImageElement, width: number, height: number): Glyph[] {
  const offscreen = document.createElement('canvas');
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  const scale = 2;
  const sampleW = width * scale;
  const sampleH = height * scale;
  offscreen.width = sampleW;
  offscreen.height = sampleH;

  const imgAspect = img.width / Math.max(1, img.height);
  const boxAspect = width / height;
  let drawWidth = sampleW;
  let drawHeight = sampleH;
  if (imgAspect > boxAspect) {
    drawHeight = sampleH;
    drawWidth = sampleH * imgAspect;
  } else {
    drawWidth = sampleW;
    drawHeight = sampleW / imgAspect;
  }
  const focusY = 0.19;
  const dx = (sampleW - drawWidth) / 2;
  const dy = (sampleH - drawHeight) * focusY;
  ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

  const { data } = ctx.getImageData(0, 0, sampleW, sampleH);
  const fontSize = glyphFontSize(width);
  const cellW = fontSize * CELL_WIDTH_RATIO;
  const cellH = fontSize * CELL_HEIGHT_RATIO;
  const glyphs: Glyph[] = [];

  for (let y = 0, row = 0; y < height; y += cellH, row += 1) {
    for (let x = 0; x < width; x += cellW) {
      const avg = cellAvg(data, sampleW, sampleH, x * scale, y * scale, cellW * scale, cellH * scale);
      if (avg > PAPER_LUMA) continue;

      const ink = Math.min(1, Math.max(0, (PAPER_LUMA - avg) / 0.72));
      if (ink < MIN_INK) continue;

      glyphs.push({
        x: Number((x + cellW / 2).toFixed(1)),
        y: Number((y + cellH / 2).toFixed(1)),
        ink: Number(ink.toFixed(3)),
        row,
      });
    }
  }

  return glyphs;
}

function glyphLook(
  scheme: PinnedColorScheme,
  ink: number,
): { char: string; r: number; g: number; b: number; alpha: number } {
  switch (scheme) {
    case 'dark': {
      const charIndex = Math.min(CHARS.length - 1, Math.floor(ink * (CHARS.length - 1)));
      return { char: CHARS[charIndex], r: 226, g: 232, b: 240, alpha: 0.55 + ink * 0.45 };
    }
    case 'light': {
      const charIndex = Math.min(CHARS.length - 1, Math.floor(ink * (CHARS.length - 1)));
      return { char: CHARS[charIndex], r: 15, g: 23, b: 42, alpha: 0.55 + ink * 0.45 };
    }
    default: {
      const _exhaustive: never = scheme;
      return _exhaustive;
    }
  }
}

export default function AsciiArtCanvas({ src, className = '', label }: AsciiArtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glyphsRef = useRef<Glyph[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const startTimeRef = useRef(0);
  const [box, setBox] = useState(() =>
    typeof window === 'undefined' ? { w: 400, h: 400 } : canvasBox(window.innerWidth),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onResize = () => setBox(canvasBox(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      glyphsRef.current = processImage(img, box.w, box.h);
      startTimeRef.current = performance.now();
      setReady(true);
    };

    return () => {
      cancelled = true;
    };
  }, [src, box.w, box.h]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = box.w * dpr;
    canvas.height = box.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontSize = glyphFontSize(box.w);
    const maxRow = glyphsRef.current.reduce((max, glyph) => Math.max(max, glyph.row), 0);
    let frameId = 0;
    let visible = true;

    const currentScheme = (): PinnedColorScheme => resolvedColorScheme(readPinnedColorScheme());

    const drawFrame = (instant = false) => {
      ctx.clearRect(0, 0, box.w, box.h);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const revealRow = instant || reducedMotion ? Number.POSITIVE_INFINITY : elapsed * 88;
      const pointer = pointerRef.current;
      const scheme = currentScheme();

      for (const glyph of glyphsRef.current) {
        if (glyph.row > revealRow) continue;

        const appear = instant || reducedMotion ? 1 : Math.min(1, revealRow - glyph.row);
        let ink = glyph.ink;
        let drawX = glyph.x;
        let drawY = glyph.y;

        if (!reducedMotion && pointer.active) {
          const dx = pointer.x - glyph.x;
          const dy = pointer.y - glyph.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = box.w * 0.32;
          if (dist < radius) {
            const t = 1 - dist / radius;
            const falloff = t * t;
            const pull = falloff * 11;
            if (dist > 0.6) {
              drawX += (dx / dist) * pull;
              drawY += (dy / dist) * pull;
            }
            ink = Math.min(1, ink + falloff * 0.5);
          }
        }

        const look = glyphLook(scheme, ink);
        const alpha = look.alpha * (0.6 + appear * 0.4);
        ctx.fillStyle = `rgba(${look.r}, ${look.g}, ${look.b}, ${alpha})`;
        ctx.fillText(look.char, drawX, drawY);
      }
    };

    const stillRevealing = () => {
      if (reducedMotion) return false;
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      return elapsed * 88 < maxRow + 2;
    };

    const loop = () => {
      if (!visible) {
        frameId = 0;
        return;
      }
      drawFrame(false);
      if (stillRevealing() || pointerRef.current.active) {
        frameId = requestAnimationFrame(loop);
      } else {
        frameId = 0;
        drawFrame(true);
      }
    };

    const startLoop = () => {
      if (frameId || !visible) return;
      frameId = requestAnimationFrame(loop);
    };

    if (reducedMotion) {
      drawFrame(true);
    } else {
      startLoop();
    }

    const onMove = (e: PointerEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
      startLoop();
    };
    const onLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = -1000;
      pointerRef.current.y = -1000;
      drawFrame(!stillRevealing());
    };

    if (!reducedMotion) {
      canvas.addEventListener('pointermove', onMove, { passive: true });
      canvas.addEventListener('pointerleave', onLeave, { passive: true });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) startLoop();
        else if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(canvas);

    const redrawForScheme = () => {
      drawFrame(!stillRevealing());
    };
    const schemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    schemeMedia.addEventListener('change', redrawForScheme);
    const schemeObserver = new MutationObserver(redrawForScheme);
    schemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      schemeObserver.disconnect();
      schemeMedia.removeEventListener('change', redrawForScheme);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [ready, box.w, box.h]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={box.w}
        height={box.h}
        role="img"
        aria-label={label ?? 'ASCII art'}
        data-cursor="hide"
        className="block h-auto max-w-full cursor-none touch-none bg-transparent"
        style={{ width: box.w, aspectRatio: `${SOURCE_ASPECT}`, backgroundColor: 'transparent' }}
      />
    </div>
  );
}
