import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  readPinnedColorScheme,
  resolvedColorScheme,
  type PinnedColorScheme,
} from '../utils/colorScheme';

interface AsciiArtCanvasProps {
  src: string;
  className?: string;
  label?: string;
  followRootRef?: RefObject<HTMLElement | null>;
}

interface Glyph {
  x: number;
  y: number;
  liveX: number;
  liveY: number;
  vx: number;
  vy: number;
  ink: number;
  row: number;
  size: number;
  feature?: 'tone' | 'pupil' | 'catch';
}

interface Pupil {
  x: number;
  y: number;
}

const CHARS = ' .:-=+*#%@'.split('');
const SOURCE_ASPECT = 1;
const PAPER_LUMA = 0.93;
const MIN_INK = 0.07;
const CELL_WIDTH_RATIO = 0.68;
const CELL_HEIGHT_RATIO = 1.02;

function glyphFontSize(width: number): number {
  if (width <= 270) return 4;
  if (width <= 460) return 4.5;
  return 5;
}

function canvasBox(viewportWidth: number): { w: number; h: number } {
  const size =
    viewportWidth < 768
      ? 260
      : viewportWidth <= 900
        ? 380
        : viewportWidth < 1024
          ? 400
          : viewportWidth < 1280
            ? 400
            : 516;
  const tall = viewportWidth >= 1024 ? 1.06 : 1;
  return { w: size, h: Math.round((size * tall) / SOURCE_ASPECT) };
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

function cellStats(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  originX: number,
  originY: number,
  cellW: number,
  cellH: number,
): { avg: number; min: number } {
  let sum = 0;
  let min = 1;
  let count = 0;
  const stepX = Math.max(1, cellW / 5);
  const stepY = Math.max(1, cellH / 5);

  for (let y = originY; y < originY + cellH; y += stepY) {
    for (let x = originX; x < originX + cellW; x += stepX) {
      const luma = sampleLuma(data, width, height, x, y);
      sum += luma;
      if (luma < min) min = luma;
      count += 1;
    }
  }

  return { avg: count > 0 ? sum / count : 1, min };
}

function processImage(
  img: HTMLImageElement,
  width: number,
  height: number,
): { glyphs: Glyph[]; pupils: Pupil[] } {
  const offscreen = document.createElement('canvas');
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { glyphs: [], pupils: [] };

  const scale = 4;
  const sampleW = width * scale;
  const sampleH = height * scale;
  offscreen.width = sampleW;
  offscreen.height = sampleH;

  const imgAspect = img.naturalWidth / Math.max(1, img.naturalHeight);
  const boxAspect = width / height;
  let drawWidth = sampleW;
  let drawHeight = sampleH;
  if (imgAspect > boxAspect) {
    drawWidth = sampleW;
    drawHeight = sampleW / imgAspect;
  } else {
    drawHeight = sampleH;
    drawWidth = sampleH * imgAspect;
  }
  const dx = (sampleW - drawWidth) / 2;
  const dy = (sampleH - drawHeight) / 2;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

  const { data } = ctx.getImageData(0, 0, sampleW, sampleH);
  const fontSize = glyphFontSize(width);
  const cellW = fontSize * CELL_WIDTH_RATIO;
  const cellH = fontSize * CELL_HEIGHT_RATIO;
  const glyphs: Glyph[] = [];
  let row = 0;

  for (let y = 0; y < height; y += cellH, row += 1) {
    for (let x = 0; x < width; x += cellW) {
      const { avg, min } = cellStats(
        data,
        sampleW,
        sampleH,
        x * scale,
        y * scale,
        cellW * scale,
        cellH * scale,
      );
      const sample = avg * 0.4 + min * 0.6;
      if (sample > PAPER_LUMA && min > 0.7) continue;
      const ink = Math.min(1, Math.max(0, (PAPER_LUMA - sample) / 0.62));
      if (ink < MIN_INK) continue;
      const homeX = Number((x + cellW / 2).toFixed(1));
      const homeY = Number((y + cellH / 2).toFixed(1));
      glyphs.push({
        x: homeX,
        y: homeY,
        liveX: homeX,
        liveY: homeY,
        vx: 0,
        vy: 0,
        ink: Number(ink.toFixed(3)),
        row,
        size: fontSize,
        feature: 'tone',
      });
    }
  }

  return { glyphs, pupils: [] };
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
      const thinnedInk = Math.min(1, Math.max(0, (ink - 0.08) / 0.92));
      const charIndex = Math.min(CHARS.length - 1, Math.floor(thinnedInk * (CHARS.length - 1) * 0.88));
      return { char: CHARS[charIndex], r: 51, g: 65, b: 85, alpha: 0.28 + thinnedInk * 0.48 };
    }
    default: {
      const _exhaustive: never = scheme;
      return _exhaustive;
    }
  }
}

export default function AsciiArtCanvas({ src, className = '', label, followRootRef }: AsciiArtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glyphsRef = useRef<Glyph[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });
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
      glyphsRef.current = processImage(img, box.w, box.h).glyphs;
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

    const baseFontSize = glyphFontSize(box.w);
    const maxRow = glyphsRef.current.reduce((max, glyph) => Math.max(max, glyph.row), 0);
    let frameId = 0;
    let visible = true;

    const currentScheme = (): PinnedColorScheme => resolvedColorScheme(readPinnedColorScheme());

    const span = Math.min(box.w, box.h);
    const radius = span * 0.22;
    const holeRadius = span * 0.031;
    let motionEnergy = 0;

    const drawFrame = (instant = false) => {
      ctx.clearRect(0, 0, box.w, box.h);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let lastSize = 0;
      motionEnergy = 0;

      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const revealRow = instant || reducedMotion ? Number.POSITIVE_INFINITY : elapsed * 88;
      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.16;
      pointer.y += (pointer.targetY - pointer.y) * 0.16;
      const scheme = currentScheme();

      for (const glyph of glyphsRef.current) {
        if (glyph.row > revealRow) continue;

        const appear = instant || reducedMotion ? 1 : Math.min(1, revealRow - glyph.row);

        if (!reducedMotion && !instant) {
          const homeX = glyph.x - pointer.x;
          const homeY = glyph.y - pointer.y;
          const homeDist = Math.sqrt(homeX * homeX + homeY * homeY);
          const displaced = Math.abs(glyph.liveX - glyph.x) + Math.abs(glyph.liveY - glyph.y);
          const moving = Math.abs(glyph.vx) + Math.abs(glyph.vy);

          let targetX = glyph.x;
          let targetY = glyph.y;
          if (pointer.active && homeDist < radius && homeDist > 0.5) {
            const t = 1 - homeDist / radius;
            const travel = t * t * holeRadius;
            targetX = glyph.x + (homeX / homeDist) * travel;
            targetY = glyph.y + (homeY / homeDist) * travel;
          }

          if (pointer.active || displaced > 0.15 || moving > 0.02) {
            glyph.vx += (targetX - glyph.liveX) * 0.12;
            glyph.vy += (targetY - glyph.liveY) * 0.12;
            glyph.vx *= 0.86;
            glyph.vy *= 0.86;
            glyph.liveX += glyph.vx;
            glyph.liveY += glyph.vy;
            motionEnergy = Math.max(motionEnergy, displaced + moving);
          } else {
            glyph.liveX = glyph.x;
            glyph.liveY = glyph.y;
            glyph.vx = 0;
            glyph.vy = 0;
          }
        } else if (instant) {
          glyph.liveX = glyph.x;
          glyph.liveY = glyph.y;
          glyph.vx = 0;
          glyph.vy = 0;
        }

        const painted = glyphLook(scheme, glyph.ink);
        const alpha = painted.alpha * (0.65 + appear * 0.35);
        const size = glyph.size || baseFontSize;
        if (size !== lastSize) {
          ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
          lastSize = size;
        }
        ctx.fillStyle = `rgba(${painted.r}, ${painted.g}, ${painted.b}, ${alpha})`;
        ctx.fillText(painted.char, glyph.liveX, glyph.liveY);
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
      if (
        stillRevealing() ||
        pointerRef.current.active ||
        motionEnergy > 0.08
      ) {
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
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerRef.current.targetX = px;
      pointerRef.current.targetY = py;
      pointerRef.current.active = true;
      startLoop();
    };
    const onLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.targetX = -1000;
      pointerRef.current.targetY = -1000;
      startLoop();
    };

    const followRoot = followRootRef?.current ?? canvas;

    if (!reducedMotion) {
      followRoot.addEventListener('pointermove', onMove, { passive: true });
      followRoot.addEventListener('pointerleave', onLeave, { passive: true });
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
      // Theme/class mutations must not snap live glyphs home. CustomCursor toggles
      // documentElement class (has-custom-cursor-native) on every hide-target enter.
      drawFrame(reducedMotion);
      if (!reducedMotion) startLoop();
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
      followRoot.removeEventListener('pointermove', onMove);
      followRoot.removeEventListener('pointerleave', onLeave);
    };
  }, [ready, box.w, box.h, followRootRef]);

  return (
    <div className={`ascii-portrait-frame relative flex items-center justify-center overflow-visible ${className}`}>
      <canvas
        ref={canvasRef}
        width={box.w}
        height={box.h}
        role="img"
        aria-label={label ?? 'ASCII art'}
        data-cursor="hide"
        className="block h-auto max-w-full cursor-none touch-none bg-transparent"
        style={{ width: box.w, height: box.h, backgroundColor: 'transparent' }}
      />
    </div>
  );
}
