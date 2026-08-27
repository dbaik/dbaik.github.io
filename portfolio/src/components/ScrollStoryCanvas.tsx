import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  ArrowRight,
  MousePointer
} from 'lucide-react';
import { SCROLL_STORY_FRAMES } from '../data/portfolioData';

export default function ScrollStoryCanvas() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inspectorPrimaryRef = useRef<HTMLSpanElement | null>(null);
  const inspectorSecondaryRef = useRef<HTMLSpanElement | null>(null);
  const inspectorPlaceholderRef = useRef<HTMLSpanElement | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number; isInside: boolean }>({ x: -100, y: -100, isInside: false });
  const animTimeRef = useRef<number>(0);
  const hoveredRegionRef = useRef<string | null>(null);
  const canvasSizeRef = useRef({ width: 400, height: 260 });
  const isCanvasActiveRef = useRef(true);

  const currentStage = SCROLL_STORY_FRAMES[activeStageIndex];

  // Detect touch device
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Automatic Pipeline Runner (Stages 01 -> 02 -> 03 -> 04)
  useEffect(() => {
    if (!isRunning) {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    const stageDuration = prefersReducedMotion ? 2000 : 1600;

    autoPlayTimerRef.current = window.setTimeout(() => {
      setActiveStageIndex((prev) => {
        if (prev < SCROLL_STORY_FRAMES.length - 1) {
          return prev + 1;
        } else {
          setIsRunning(false);
          setIsCompleted(true);
          return prev;
        }
      });
    }, stageDuration);

    return () => {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isRunning, activeStageIndex, prefersReducedMotion]);

  const handleStartPipeline = () => {
    if (isCompleted || activeStageIndex === SCROLL_STORY_FRAMES.length - 1) {
      setActiveStageIndex(0);
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const updateInspectorDisplay = useCallback((text: string | null) => {
    if (hoveredRegionRef.current === text) return;
    hoveredRegionRef.current = text;

    const primaryEl = inspectorPrimaryRef.current;
    const secondaryEl = inspectorSecondaryRef.current;
    const placeholderEl = inspectorPlaceholderRef.current;
    if (!primaryEl || !secondaryEl || !placeholderEl) return;

    if (!text) {
      primaryEl.textContent = '';
      secondaryEl.textContent = '';
      secondaryEl.classList.add('hidden');
      placeholderEl.classList.remove('hidden');
      return;
    }

    const parts = text.split(' · ');
    primaryEl.textContent = parts[0] ?? '';
    placeholderEl.classList.add('hidden');

    if (parts.length > 1) {
      secondaryEl.textContent = `· ${parts.slice(1).join(' · ')}`;
      secondaryEl.classList.remove('hidden');
    } else {
      secondaryEl.textContent = '';
      secondaryEl.classList.add('hidden');
    }
  }, []);

  const handleStageSelect = (index: number) => {
    setIsRunning(false);
    setActiveStageIndex(index);
    updateInspectorDisplay(null);
    if (index === SCROLL_STORY_FRAMES.length - 1) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  // Canvas Drawing Routine
  const drawCanvas = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.clearRect(0, 0, width, height);

    const pointer = pointerPosRef.current;
    const stage = activeStageIndex; // 0, 1, 2, 3

    // 1. Subtle Background Blueprint Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const cellSize = 20;
    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const paddingX = width < 420 ? 12 : 20;
    const paddingY = height < 340 ? 12 : 16;
    const contentWidth = width - paddingX * 2;
    const contentHeight = height - paddingY * 2;

    // Helper: Rounded Rectangle
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    // Helper: Check hover within bounds
    const isHovered = (x: number, y: number, w: number, h: number) => {
      return pointer.isInside && pointer.x >= x && pointer.x <= x + w && pointer.y >= y && pointer.y <= y + h;
    };

    // Responsive Breakpoint Flags for Canvas
    const isCompact = contentWidth < 460;
    const isSmall = contentWidth < 340;

    // =========================================================================
    // STAGE 01: BLUEPRINT (Figma -> Responsive Frontend)
    // =========================================================================
    if (stage === 0) {
      // 1. Breakpoint Caliper & Alignment Markers at the very top
      const topRulerH = isCompact ? 12 : 14;
      const bpMarkers = isSmall
        ? [{ label: 'Sm', pct: 0.28 }, { label: 'Md', pct: 0.60 }, { label: 'Lg', pct: 0.92 }]
        : isCompact 
          ? [{ label: 'Small', pct: 0.30 }, { label: 'Medium', pct: 0.64 }, { label: 'Large', pct: 0.94 }]
          : [{ label: 'Small', pct: 0.25 }, { label: 'Medium', pct: 0.50 }, { label: 'Large', pct: 0.75 }, { label: 'Wide', pct: 0.95 }];

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(paddingX, paddingY + topRulerH - 2);
      ctx.lineTo(paddingX + contentWidth, paddingY + topRulerH - 2);
      ctx.stroke();

      bpMarkers.forEach(bp => {
        const bpX = paddingX + contentWidth * bp.pct;
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
        ctx.beginPath();
        ctx.moveTo(bpX, paddingY);
        ctx.lineTo(bpX, paddingY + topRulerH - 2);
        ctx.stroke();

        ctx.fillStyle = '#818cf8';
        ctx.font = isSmall ? '7px ui-monospace, SFMono-Regular, monospace' : isCompact ? '7.5px ui-monospace, SFMono-Regular, monospace' : '8px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(bp.label, bpX - (isSmall ? 8 : isCompact ? 12 : 16), paddingY + topRulerH - 4);
      });

      // 12-Column Responsive Grid Guides
      const gridStartY = paddingY + topRulerH + 2;
      const gridHeight = contentHeight - topRulerH - 2;
      const cols = 12;
      const colGap = isCompact ? 3 : 7;
      const totalGaps = (cols - 1) * colGap;
      const colWidth = (contentWidth - totalGaps) / cols;

      ctx.lineWidth = 1;

      for (let i = 0; i < cols; i++) {
        const colX = paddingX + i * (colWidth + colGap);
        const colHover = isHovered(colX, gridStartY, colWidth, gridHeight);

        ctx.fillStyle = colHover ? 'rgba(99, 102, 241, 0.14)' : 'rgba(99, 102, 241, 0.03)';
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
        ctx.fillRect(colX, gridStartY, colWidth, gridHeight);
        ctx.strokeRect(colX, gridStartY, colWidth, gridHeight);
      }

      // Semantic Layout Regions Wireframe
      // 1. Header wireframe
      const headerY = gridStartY + 4;
      const headerH = isCompact ? 24 : 28;
      const headerHover = isHovered(paddingX, headerY, contentWidth, headerH);
      ctx.fillStyle = headerHover ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = headerHover ? '#818cf8' : 'rgba(255, 255, 255, 0.15)';
      roundRect(paddingX, headerY, contentWidth, headerH, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = isSmall ? '8px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8.5px ui-monospace, SFMono-Regular, monospace' : '9.5px ui-monospace, SFMono-Regular, monospace';
      const headerLabel = isSmall ? '<header> · Layout grid' : isCompact ? '<header> · Layout grid & nav' : '<header> · Responsive layout grid & navigation';
      ctx.fillText(headerLabel, paddingX + 8, headerY + (isCompact ? 15 : 18));

      // 2. Hero Region (2-Col layout)
      const heroY = headerY + headerH + (isCompact ? 6 : 8);
      const heroH = isCompact ? 72 : 82;
      const heroHover = isHovered(paddingX, heroY, contentWidth, heroH);
      ctx.fillStyle = heroHover ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = heroHover ? '#818cf8' : 'rgba(99, 102, 241, 0.3)';
      roundRect(paddingX, heroY, contentWidth, heroH, 6);
      ctx.fill();
      ctx.stroke();

      // Hero right: Spacing token box (calculated first to avoid collision)
      const caliperW = isSmall ? 68 : isCompact ? 78 : Math.min(135, Math.max(110, contentWidth * 0.26));
      const caliperX = paddingX + contentWidth - caliperW - 6;
      const caliperHover = isHovered(caliperX, heroY + 6, caliperW, heroH - 12);
      ctx.fillStyle = caliperHover ? 'rgba(99, 102, 241, 0.28)' : 'rgba(99, 102, 241, 0.12)';
      ctx.strokeStyle = caliperHover ? '#818cf8' : 'rgba(99, 102, 241, 0.4)';
      roundRect(caliperX, heroY + 6, caliperW, heroH - 12, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c7d2fe';
      ctx.font = isSmall ? '7px ui-monospace, SFMono-Regular, monospace' : isCompact ? '7.5px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText('SPACING SCALE', caliperX + (isSmall ? 4 : 6), heroY + (isCompact ? 20 : 24));
      ctx.fillStyle = '#818cf8';
      ctx.fillText('Baseline rhythm', caliperX + (isSmall ? 4 : 6), heroY + (isCompact ? 36 : 42));
      if (!isSmall && !isCompact) {
        ctx.fillStyle = '#64748b';
        ctx.fillText('Spacing scale tokens', caliperX + 6, heroY + 58);
      }

      // Hero left: Typography hierarchy
      ctx.fillStyle = '#ffffff';
      ctx.font = isSmall ? 'bold 9px ui-monospace, SFMono-Regular, monospace' : isCompact ? 'bold 9.5px ui-monospace, SFMono-Regular, monospace' : 'bold 11px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(isSmall ? '<h1> Typography' : '<h1> Typography hierarchy', paddingX + 8, heroY + (isCompact ? 20 : 24));

      ctx.fillStyle = '#64748b';
      ctx.font = isSmall ? '7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
      if (isSmall) {
        ctx.fillText('Fluid scale', paddingX + 8, heroY + 36);
        ctx.fillText('Baseline rhythm', paddingX + 8, heroY + 50);
      } else if (isCompact) {
        ctx.fillText('Fluid typography scale', paddingX + 8, heroY + 38);
        ctx.fillText('Baseline rhythm', paddingX + 8, heroY + 54);
      } else {
        ctx.fillText('Fluid typography scale · Responsive clamp', paddingX + 10, heroY + 42);
        ctx.fillText('Proportional line-height & baseline rhythm', paddingX + 10, heroY + 60);
      }

      // 3. Feature 3-Col Content Grid
      const cardsY = heroY + heroH + (isCompact ? 6 : 8);
      const cardGap = isCompact ? 4 : 7;
      const cardW = (contentWidth - cardGap * 2) / 3;
      const footerH = isCompact ? 22 : 26;
      const footerGap = isCompact ? 6 : 8;
      const cardH = Math.max(52, contentHeight - (cardsY - paddingY) - footerH - footerGap);

      for (let c = 0; c < 3; c++) {
        const cardX = paddingX + c * (cardW + cardGap);
        const cardHover = isHovered(cardX, cardsY, cardW, cardH);

        ctx.fillStyle = cardHover ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = cardHover ? '#818cf8' : 'rgba(255, 255, 255, 0.12)';
        roundRect(cardX, cardsY, cardW, cardH, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = isSmall ? 'bold 8px ui-monospace, SFMono-Regular, monospace' : isCompact ? 'bold 8.5px ui-monospace, SFMono-Regular, monospace' : '9px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(isCompact ? `col-${c + 1}` : `<article: column ${c + 1}>`, cardX + (isSmall ? 4 : isCompact ? 6 : 10), cardsY + (isCompact ? 16 : 20));

        ctx.fillStyle = '#64748b';
        ctx.font = isSmall ? '7px ui-monospace, SFMono-Regular, monospace' : isCompact ? '7.5px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
        const colDetail = cardW < 90 ? 'Responsive' : 'Responsive col';
        ctx.fillText(isCompact ? colDetail : 'Responsive column', cardX + (isSmall ? 4 : isCompact ? 6 : 10), cardsY + (isCompact ? 30 : 38));
        if (cardH >= 64) {
          const colSub = cardW < 90 ? 'Semantic' : 'Semantic markup';
          ctx.fillText(isCompact ? colSub : 'Semantic markup', cardX + (isSmall ? 4 : isCompact ? 6 : 10), cardsY + (isCompact ? 44 : 54));
        }
      }

      // 4. Supporting Element: Footer / Secondary Content Region
      const footerY = cardsY + cardH + footerGap;
      const footerHover = isHovered(paddingX, footerY, contentWidth, footerH);
      ctx.fillStyle = footerHover ? 'rgba(99, 102, 241, 0.18)' : 'rgba(15, 23, 42, 0.55)';
      ctx.strokeStyle = footerHover ? '#818cf8' : 'rgba(255, 255, 255, 0.08)';
      roundRect(paddingX, footerY, contentWidth, footerH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = footerHover ? '#c7d2fe' : '#64748b';
      ctx.font = isSmall ? '7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
      const footerLabel = isSmall ? '<footer> · Secondary region' : isCompact ? '<footer> · Secondary content region' : '<footer> · Secondary content region & structural bounds';
      ctx.fillText(footerLabel, paddingX + 8, footerY + (isCompact ? 14 : 17));

      // Scanning indicator line (unless reduced motion)
      if (!prefersReducedMotion) {
        const scanY = gridStartY + ((Math.sin(time * 2) + 1) / 2) * gridHeight;
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(paddingX, scanY);
        ctx.lineTo(paddingX + contentWidth, scanY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // =========================================================================
    // STAGE 02: ARCHITECTURE (Gutenberg & Shopify Blocks)
    // =========================================================================
    else if (stage === 1) {
      // Reusable modular CMS components with Tree Flow Connector
      const modules = [
        { name: 'Hero Block', type: 'Gutenberg block', schema: 'Modular section', shortSchema: 'Gutenberg' },
        { name: 'Content Block', type: 'Content block', schema: 'Editable content', shortSchema: 'Content' },
        { name: 'Media Gallery', type: 'Shopify Liquid section', schema: 'Liquid section', shortSchema: 'Liquid' },
        { name: 'Call to Action', type: 'Content block', schema: 'Modular section', shortSchema: 'Action' },
        { name: 'Product Grid', type: 'Product section', schema: 'Liquid section', shortSchema: 'Product' }
      ];

      // Vertical Schema Tree Bus on the left
      const busX = paddingX + (isCompact ? 6 : 10);
      const startModY = paddingY + 6;
      const bottomStripH = isCompact ? 22 : 24;
      const stripGap = isCompact ? 8 : 10;
      const bottomBreathing = isCompact ? 6 : 8;

      const availableMainH = contentHeight - (startModY - paddingY) - bottomStripH - stripGap - bottomBreathing;
      const modGap = isCompact ? 6 : Math.max(7, Math.min(10, Math.floor((availableMainH * 0.16) / 4)));
      const modH = Math.max(34, Math.min(46, Math.floor((availableMainH - 4 * modGap) / 5)));
      
      const modulesEndY = startModY + 5 * modH + 4 * modGap;
      const stripY = modulesEndY + stripGap;
      const endModY = stripY + bottomStripH / 2;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(busX, startModY);
      ctx.lineTo(busX, endModY);
      ctx.stroke();

      const blockStartX = busX + (isCompact ? 10 : 16);
      const blockWidth = contentWidth - (blockStartX - paddingX);

      modules.forEach((mod, idx) => {
        const modY = startModY + idx * (modH + modGap);
        const modHover = isHovered(blockStartX, modY, blockWidth, modH);

        // Branch line from tree bus into block
        ctx.strokeStyle = modHover ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = modHover ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(busX, modY + modH / 2);
        ctx.lineTo(blockStartX, modY + modH / 2);
        ctx.stroke();

        // Node dot on bus line
        ctx.fillStyle = modHover ? '#38bdf8' : '#0284c7';
        ctx.beginPath();
        ctx.arc(busX, modY + modH / 2, modHover ? 3 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Block Container
        ctx.fillStyle = modHover ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = modHover ? '#38bdf8' : 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = modHover ? 1.5 : 1;
        roundRect(blockStartX, modY, blockWidth, modH, 5);
        ctx.fill();
        ctx.stroke();

        // Drag handle dots
        ctx.fillStyle = modHover ? '#38bdf8' : '#475569';
        const dotsCenterY = modY + modH / 2 - 5;
        for (let r = 0; r < 2; r++) {
          for (let d = 0; d < 3; d++) {
            ctx.beginPath();
            ctx.arc(blockStartX + 6 + r * 3, dotsCenterY + d * 5, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = isSmall ? 'bold 8.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? 'bold 9px ui-monospace, SFMono-Regular, monospace' : 'bold 10px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(`${mod.name}`, blockStartX + (isSmall ? 16 : isCompact ? 20 : 28), modY + Math.floor(modH * 0.58));

        // Center Type indicator (rendered on wider screens)
        if (!isCompact && blockWidth >= 380) {
          ctx.fillStyle = '#64748b';
          ctx.font = '8.5px ui-monospace, SFMono-Regular, monospace';
          ctx.fillText(`[${mod.type}]`, blockStartX + 130, modY + Math.floor(modH * 0.58));
        }

        // Schema Badge on right
        const badgeW = isSmall ? 54 : isCompact ? 64 : 105;
        const badgeH = isCompact ? 16 : 20;
        const badgeX = blockStartX + blockWidth - badgeW - 5;
        const badgeY = modY + Math.floor((modH - badgeH) / 2);
        ctx.fillStyle = modHover ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)';
        roundRect(badgeX, badgeY, badgeW, badgeH, 4);
        ctx.fill();

        ctx.fillStyle = modHover ? '#38bdf8' : '#94a3b8';
        ctx.font = isSmall ? '7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(isCompact ? mod.shortSchema : mod.schema, badgeX + (isSmall ? 5 : isCompact ? 6 : 8), badgeY + (isCompact ? 11 : 14));
      });

      // Single Final Supporting Strip: Shared content & template composition
      const stripHover = isHovered(blockStartX, stripY, blockWidth, bottomStripH);
      
      // Connector branch to strip node
      ctx.strokeStyle = stripHover ? '#38bdf8' : 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(busX, stripY + bottomStripH / 2);
      ctx.lineTo(blockStartX, stripY + bottomStripH / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = stripHover ? '#38bdf8' : '#0369a1';
      ctx.beginPath();
      ctx.arc(busX, stripY + bottomStripH / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Secondary container style
      ctx.fillStyle = stripHover ? 'rgba(56, 189, 248, 0.14)' : 'rgba(15, 23, 42, 0.6)';
      ctx.strokeStyle = stripHover ? '#38bdf8' : 'rgba(56, 189, 248, 0.2)';
      roundRect(blockStartX, stripY, blockWidth, bottomStripH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = stripHover ? '#7dd3fc' : '#94a3b8';
      ctx.font = isSmall ? '7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(isSmall ? 'Shared content & templates' : 'Shared content & template composition', blockStartX + 8, stripY + (isCompact ? 14 : 16));
    }

    // =========================================================================
    // STAGE 03: MOTION & PERFORMANCE (GSAP & ScrollTrigger)
    // =========================================================================
    else if (stage === 2) {
      // ScrollTrigger Timeline Track
      const axisX = paddingX + (isSmall ? 8 : isCompact ? 12 : 32);
      const markerTopY = paddingY + (isCompact ? 12 : 14);

      // Top Trigger marker
      const topHover = isHovered(axisX - 8, markerTopY - 10, isCompact ? 60 : 90, 22);
      ctx.fillStyle = topHover ? '#e9d5ff' : '#c084fc';
      ctx.fillRect(axisX - 3, markerTopY - 2, 6, 4);
      ctx.font = isSmall ? '7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(isCompact ? 'Start' : 'Trigger start', axisX + 7, markerTopY + 3);

      // ScrollTrigger Threshold Reference Line (80% viewport guide)
      const triggerPlaneY = paddingY + contentHeight * 0.42;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(axisX, triggerPlaneY);
      ctx.lineTo(paddingX + contentWidth, triggerPlaneY);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!isCompact && contentWidth >= 420) {
        ctx.fillStyle = '#9333ea';
        ctx.font = '7.5px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText('Viewport trigger · ScrollTrigger region', paddingX + contentWidth - 195, triggerPlaneY - 4);
      }

      // Animated Motion Cards Stagger Preview
      const cardStartX = axisX + (isSmall ? 28 : isCompact ? 34 : 95);
      const cardW = contentWidth - (cardStartX - paddingX) - 2;
      const count = 3;
      const fallbackH = isCompact ? 22 : 24;
      const startMotionY = markerTopY + (isCompact ? 14 : 18);
      
      const itemGap = isCompact ? 8 : Math.max(9, Math.min(14, Math.floor((contentHeight * 0.12) / 2)));
      const fallbackGap = isCompact ? 8 : 10;
      const itemH = Math.max(44, Math.min(54, Math.floor((contentHeight - (startMotionY - paddingY) - fallbackH - 2 * itemGap - fallbackGap - (isCompact ? 24 : 32)) / 3)));
      const fallbackY = startMotionY + 3 * itemH + 2 * itemGap + fallbackGap;
      const markerBottomY = fallbackY + fallbackH + (isCompact ? 10 : 14);

      // Timeline axis bounded cleanly between Trigger start and Trigger end
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(axisX, markerTopY);
      ctx.lineTo(axisX, markerBottomY);
      ctx.stroke();

      // Bottom Trigger marker
      const bottomHover = isHovered(axisX - 8, markerBottomY - 10, isCompact ? 60 : 90, 22);
      ctx.fillStyle = bottomHover ? '#e9d5ff' : '#c084fc';
      ctx.fillRect(axisX - 3, markerBottomY - 2, 6, 4);
      ctx.fillText(isCompact ? 'End' : 'Trigger end', axisX + 7, markerBottomY + 3);

      for (let i = 0; i < count; i++) {
        const itemBaseY = startMotionY + i * (itemH + itemGap);
        
        // Controlled motion wave calculation (unless reduced motion)
        const staggerOffset = i * 0.4;
        const progress = prefersReducedMotion 
          ? 1 
          : (Math.sin(time * 3 - staggerOffset) + 1) / 2;
        
        const currentOffsetY = (1 - progress) * -8;
        const currentOpacity = 0.45 + progress * 0.55;
        const itemY = itemBaseY + currentOffsetY;

        const isCardHover = isHovered(cardStartX, itemY, cardW, itemH);

        // Motion Card Container
        ctx.fillStyle = isCardHover ? 'rgba(168, 85, 247, 0.22)' : `rgba(15, 23, 42, ${currentOpacity})`;
        ctx.strokeStyle = isCardHover ? '#c084fc' : `rgba(168, 85, 247, ${0.3 * currentOpacity})`;
        ctx.lineWidth = isCardHover ? 1.5 : 1;
        roundRect(cardStartX, itemY, cardW, itemH, 5);
        ctx.fill();
        ctx.stroke();

        // Velocity vector / easing curve visualization connector
        ctx.strokeStyle = isCardHover ? 'rgba(233, 213, 255, 0.8)' : 'rgba(192, 132, 252, 0.4)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(cardStartX - 8, itemBaseY + itemH / 2);
        ctx.lineTo(cardStartX, itemY + itemH / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffffff';
        ctx.font = isSmall ? 'bold 8.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? 'bold 9px ui-monospace, SFMono-Regular, monospace' : 'bold 10px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(isSmall ? `Unit 0${i + 1}` : isCompact ? `Motion unit 0${i + 1}` : `Purposeful motion unit 0${i + 1}`, cardStartX + (isCompact ? 8 : 12), itemY + (isCompact ? 16 : 20));

        ctx.fillStyle = '#a855f7';
        ctx.font = isSmall ? '7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(isCompact ? 'Controlled easing' : 'Purposeful transition · Controlled easing', cardStartX + (isCompact ? 8 : 12), itemY + (isCompact ? 30 : 38));

        // Badge
        const badgeW = isSmall ? 42 : isCompact ? 48 : 78;
        const badgeH = isCompact ? 16 : 20;
        const badgeY = itemY + Math.floor((itemH - badgeH) / 2);
        ctx.fillStyle = isCardHover ? 'rgba(168, 85, 247, 0.35)' : 'rgba(168, 85, 247, 0.2)';
        roundRect(cardStartX + cardW - badgeW - 5, badgeY, badgeW, badgeH, 4);
        ctx.fill();
        ctx.fillStyle = '#e9d5ff';
        ctx.font = isSmall ? '7px ui-monospace, SFMono-Regular, monospace' : isCompact ? '7.5px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(isCompact ? 'Fluid' : 'Fluid motion', cardStartX + cardW - badgeW + (isSmall ? 8 : isCompact ? 10 : 8), badgeY + (isCompact ? 11 : 14));
      }

      // Single Final Supporting Strip: Reduced-motion fallback branch
      const fallbackHover = isHovered(cardStartX, fallbackY, cardW, fallbackH);

      // Subtle connector branch from timeline axis to fallback node
      ctx.strokeStyle = fallbackHover ? '#c084fc' : 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(axisX, fallbackY + fallbackH / 2);
      ctx.lineTo(cardStartX, fallbackY + fallbackH / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = fallbackHover ? '#c084fc' : '#7e22ce';
      ctx.beginPath();
      ctx.arc(axisX, fallbackY + fallbackH / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Fallback secondary container
      ctx.fillStyle = fallbackHover ? 'rgba(168, 85, 247, 0.16)' : 'rgba(15, 23, 42, 0.6)';
      ctx.strokeStyle = fallbackHover ? '#c084fc' : 'rgba(168, 85, 247, 0.2)';
      roundRect(cardStartX, fallbackY, cardW, fallbackH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = fallbackHover ? '#e9d5ff' : '#94a3b8';
      ctx.font = isSmall ? '7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(isCompact ? 'Reduced-motion fallback' : 'Reduced-motion fallback · Static transform path', cardStartX + 8, fallbackY + (isCompact ? 14 : 16));
    }

    // =========================================================================
    // STAGE 04: PRODUCTION (Performance & Core Web Vitals)
    // =========================================================================
    else if (stage === 3) {
      // 1. Production Conceptual Header Banner
      const headerH = isCompact ? 20 : 22;
      const headerBannerHover = isHovered(paddingX, paddingY + 2, contentWidth, headerH);
      ctx.fillStyle = headerBannerHover ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)';
      ctx.strokeStyle = headerBannerHover ? '#34d399' : 'rgba(16, 185, 129, 0.4)';
      roundRect(paddingX, paddingY + 2, contentWidth, headerH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = isSmall ? 'bold 7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? 'bold 8px ui-monospace, SFMono-Regular, monospace' : 'bold 9px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(isSmall ? 'PRODUCTION & DELIVERY PIPELINE' : 'PRODUCTION WORKFLOW & DELIVERY PIPELINE', paddingX + 6, paddingY + (isCompact ? 14 : 16));

      // 2. Qualitative conceptual categories with Delivery Bus Line
      const checks = [
        { 
          num: '01',
          title: 'Layout stability', 
          compactTitle: 'Layout stability', 
          detail: 'Consistent rendering & responsive flow', 
          compactDetail: 'Consistent flow', 
          tag: 'STABLE',
          subNotation: 'Shift-free rendering · Aspect-ratio preservation'
        },
        { 
          num: '02',
          title: 'Responsive assets', 
          compactTitle: 'Responsive assets', 
          detail: 'Modern picture formats & lazy loading', 
          compactDetail: 'Modern lazy formats', 
          tag: 'ASSETS',
          subNotation: 'Responsive picture cascade & format fallback'
        },
        { 
          num: '03',
          title: 'Performance & Core Web Vitals', 
          compactTitle: 'Performance & Vitals', 
          detail: 'Critical path CSS & deferred JS', 
          compactDetail: 'Critical CSS & JS', 
          tag: 'VITALS',
          subNotation: 'Critical path CSS & deferred script execution'
        },
        { 
          num: '04',
          title: 'Cross-browser QA', 
          compactTitle: 'Cross-browser QA', 
          detail: 'Cross-device compatibility & testing', 
          compactDetail: 'Cross-device QA', 
          tag: 'QA',
          subNotation: 'Cross-device & multi-engine verification'
        }
      ];

      const startY = paddingY + headerH + (isCompact ? 8 : 10);
      const handoffH = isCompact ? 22 : 24;
      const bottomBreathing = isCompact ? 6 : 8;

      const totalAvailableH = contentHeight - (startY - paddingY) - handoffH - bottomBreathing;
      const checkGap = isCompact ? 6 : Math.max(7, Math.min(11, Math.floor((totalAvailableH * 0.18) / 3)));
      const handoffGap = isCompact ? 8 : 12;
      const checkH = Math.max(40, Math.min(50, Math.floor((totalAvailableH - 3 * checkGap - handoffGap) / 4)));
      const handoffY = startY + 4 * (checkH + checkGap) - checkGap + handoffGap;

      // Vertical delivery bus line on the left
      const busX = paddingX + (isSmall ? 6 : isCompact ? 8 : 16);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(busX, startY);
      ctx.lineTo(busX, handoffY + handoffH / 2);
      ctx.stroke();

      const cardStartX = busX + (isSmall ? 8 : isCompact ? 10 : 18);
      const cardWidth = contentWidth - (cardStartX - paddingX);

      checks.forEach((chk, idx) => {
        const cY = startY + idx * (checkH + checkGap);
        const chkHover = isHovered(cardStartX, cY, cardWidth, checkH);

        // Branch line from bus to row
        ctx.strokeStyle = chkHover ? '#34d399' : 'rgba(52, 211, 153, 0.4)';
        ctx.lineWidth = chkHover ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(busX, cY + checkH / 2);
        ctx.lineTo(cardStartX, cY + checkH / 2);
        ctx.stroke();

        // Node circle on bus line
        ctx.fillStyle = chkHover ? '#34d399' : '#059669';
        ctx.beginPath();
        ctx.arc(busX, cY + checkH / 2, chkHover ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Card container
        ctx.fillStyle = chkHover ? 'rgba(16, 185, 129, 0.22)' : 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = chkHover ? '#34d399' : 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = chkHover ? 1.5 : 1;
        roundRect(cardStartX, cY, cardWidth, checkH, 5);
        ctx.fill();
        ctx.stroke();

        // Step number indicator
        ctx.fillStyle = chkHover ? '#34d399' : '#10b981';
        ctx.font = isSmall ? 'bold 7.5px ui-monospace, SFMono-Regular, monospace' : 'bold 8px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(chk.num, cardStartX + 6, cY + (isCompact ? 14 : 17));

        // Title and description
        ctx.fillStyle = '#ffffff';
        ctx.font = isSmall ? 'bold 8.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? 'bold 9px ui-monospace, SFMono-Regular, monospace' : 'bold 9.5px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(isCompact ? chk.compactTitle : chk.title, cardStartX + (isSmall ? 18 : 22), cY + (isCompact ? 14 : 17));

        ctx.fillStyle = '#94a3b8';
        ctx.font = isSmall ? '7px ui-monospace, SFMono-Regular, monospace' : isCompact ? '7.5px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(isCompact ? chk.compactDetail : chk.detail, cardStartX + (isSmall ? 18 : 22), cY + (isCompact ? 25 : 30));

        // Supporting Schematic Notation (subtle secondary engineering notation)
        if (!isCompact && checkH >= 46) {
          ctx.fillStyle = chkHover ? '#6ee7b7' : '#047857';
          ctx.font = '7.5px ui-monospace, SFMono-Regular, monospace';
          ctx.fillText(chk.subNotation, cardStartX + 26, cY + checkH - 5);
        }

        // Category Tag Badge on right
        const sBadgeW = isSmall ? 44 : isCompact ? 50 : 76;
        const sBadgeH = isCompact ? 15 : 19;
        const sBadgeX = cardStartX + cardWidth - sBadgeW - 5;
        const sBadgeY = cY + Math.floor((checkH - sBadgeH) / 2);
        ctx.fillStyle = chkHover ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.12)';
        roundRect(sBadgeX, sBadgeY, sBadgeW, sBadgeH, 4);
        ctx.fill();

        ctx.fillStyle = '#34d399';
        ctx.font = isSmall ? '7px ui-monospace, SFMono-Regular, monospace' : isCompact ? '7.5px ui-monospace, SFMono-Regular, monospace' : '8px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(chk.tag, sBadgeX + (isSmall ? 6 : isCompact ? 8 : 10), sBadgeY + (isCompact ? 11 : 13));
      });

      // Supporting Element: Final Delivery / Production Handoff node
      const handoffHover = isHovered(cardStartX, handoffY, cardWidth, handoffH);

      // Bus connection to handoff node
      ctx.strokeStyle = handoffHover ? '#34d399' : 'rgba(52, 211, 153, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(busX, handoffY + handoffH / 2);
      ctx.lineTo(cardStartX, handoffY + handoffH / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = handoffHover ? '#34d399' : '#047857';
      ctx.beginPath();
      ctx.arc(busX, handoffY + handoffH / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Handoff secondary container
      ctx.fillStyle = handoffHover ? 'rgba(16, 185, 129, 0.16)' : 'rgba(15, 23, 42, 0.6)';
      ctx.strokeStyle = handoffHover ? '#34d399' : 'rgba(16, 185, 129, 0.22)';
      roundRect(cardStartX, handoffY, cardWidth, handoffH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = handoffHover ? '#6ee7b7' : '#94a3b8';
      ctx.font = isSmall ? '7.5px ui-monospace, SFMono-Regular, monospace' : isCompact ? '8px ui-monospace, SFMono-Regular, monospace' : '8.5px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(isCompact ? 'Production handoff · Pipeline' : 'Production handoff · Release workflow integration', cardStartX + 8, handoffY + (isCompact ? 14 : 16));
    }

    // Pointer hover location indicator
    if (pointer.isInside) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [activeStageIndex, prefersReducedMotion]);

  // Semantic Object Detector for Inspector
  const getSemanticObjectAt = useCallback((x: number, y: number, width: number, height: number): string | null => {
    const paddingX = width < 420 ? 12 : 20;
    const paddingY = height < 340 ? 12 : 16;
    const contentWidth = width - paddingX * 2;
    const contentHeight = height - paddingY * 2;
    const stage = activeStageIndex;
    const isCompact = contentWidth < 460;
    const isSmall = contentWidth < 340;

    const inBounds = (bx: number, by: number, bw: number, bh: number) => {
      return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
    };

    // Stage 01: Blueprint
    if (stage === 0) {
      const topRulerH = isCompact ? 12 : 14;
      if (inBounds(paddingX, paddingY, contentWidth, topRulerH + 2)) {
        return 'Responsive breakpoints · Small · Medium · Large · Wide';
      }

      const gridStartY = paddingY + topRulerH + 2;
      const headerY = gridStartY + 4;
      const headerH = isCompact ? 24 : 28;
      if (inBounds(paddingX, headerY, contentWidth, headerH)) {
        return 'Responsive layout grid · Semantic header';
      }

      const heroY = headerY + headerH + (isCompact ? 6 : 8);
      const heroH = isCompact ? 72 : 82;
      const caliperW = isSmall ? 68 : isCompact ? 78 : Math.min(135, Math.max(110, contentWidth * 0.26));
      const caliperX = paddingX + contentWidth - caliperW - 6;

      if (inBounds(caliperX, heroY + 6, caliperW, heroH - 12)) {
        return 'Spacing scale · Baseline rhythm';
      }

      if (inBounds(paddingX, heroY, contentWidth, heroH)) {
        return 'Typography hierarchy · Fluid scale';
      }

      const cardsY = heroY + heroH + (isCompact ? 6 : 8);
      const cardGap = isCompact ? 4 : 7;
      const cardW = (contentWidth - cardGap * 2) / 3;
      const footerH = isCompact ? 22 : 26;
      const footerGap = isCompact ? 6 : 8;
      const cardH = Math.max(52, contentHeight - (cardsY - paddingY) - footerH - footerGap);

      for (let c = 0; c < 3; c++) {
        const cardX = paddingX + c * (cardW + cardGap);
        if (inBounds(cardX, cardsY, cardW, cardH)) {
          return `Responsive column ${c + 1} · Grid unit`;
        }
      }

      const footerY = cardsY + cardH + footerGap;
      if (inBounds(paddingX, footerY, contentWidth, footerH)) {
        return 'Footer region · Secondary content region';
      }

      if (inBounds(paddingX, paddingY, contentWidth, contentHeight)) {
        return '12-column responsive grid';
      }
    }

    // Stage 02: Architecture
    else if (stage === 1) {
      const busX = paddingX + (isCompact ? 6 : 10);
      if (inBounds(busX - 4, paddingY, 14, contentHeight)) {
        return 'Component relationship bus · Modular architecture';
      }

      const modules = [
        { name: 'Hero Block', type: 'Gutenberg block · Hero Section' },
        { name: 'Content Block', type: 'Content block · Editable content' },
        { name: 'Media Gallery', type: 'Shopify Liquid section · Media' },
        { name: 'Call to Action', type: 'Content block · Action' },
        { name: 'Product Grid', type: 'Product section · Commerce Grid' }
      ];

      const startModY = paddingY + 6;
      const bottomStripH = isCompact ? 22 : 24;
      const stripGap = isCompact ? 8 : 10;
      const bottomBreathing = isCompact ? 6 : 8;

      const availableMainH = contentHeight - (startModY - paddingY) - bottomStripH - stripGap - bottomBreathing;
      const modGap = isCompact ? 6 : Math.max(7, Math.min(10, Math.floor((availableMainH * 0.16) / 4)));
      const modH = Math.max(34, Math.min(46, Math.floor((availableMainH - 4 * modGap) / 5)));
      const blockStartX = busX + (isCompact ? 10 : 16);
      const blockWidth = contentWidth - (blockStartX - paddingX);

      for (let idx = 0; idx < modules.length; idx++) {
        const modY = startModY + idx * (modH + modGap);
        if (inBounds(blockStartX, modY, blockWidth, modH)) {
          return modules[idx].type;
        }
      }

      const modulesEndY = startModY + 5 * modH + 4 * modGap;
      const stripY = modulesEndY + stripGap;
      if (inBounds(blockStartX, stripY, blockWidth, bottomStripH)) {
        return 'Shared content & template composition · Reusable assembly';
      }

      if (inBounds(paddingX, paddingY, contentWidth, contentHeight)) {
        return 'Modular CMS component architecture';
      }
    }

    // Stage 03: Motion & Performance
    else if (stage === 2) {
      const axisX = paddingX + (isSmall ? 8 : isCompact ? 12 : 32);
      const markerTopY = paddingY + (isCompact ? 12 : 14);

      if (inBounds(axisX - 8, markerTopY - 10, isCompact ? 60 : 90, 22)) {
        return 'ScrollTrigger start · Viewport trigger enter';
      }

      const cardStartX = axisX + (isSmall ? 28 : isCompact ? 34 : 95);
      const cardW = contentWidth - (cardStartX - paddingX) - 2;
      const count = 3;
      const fallbackH = isCompact ? 22 : 24;
      const startMotionY = markerTopY + (isCompact ? 14 : 18);

      const itemGap = isCompact ? 8 : Math.max(9, Math.min(14, Math.floor((contentHeight * 0.12) / 2)));
      const fallbackGap = isCompact ? 8 : 10;
      const itemH = Math.max(44, Math.min(54, Math.floor((contentHeight - (startMotionY - paddingY) - fallbackH - 2 * itemGap - fallbackGap - (isCompact ? 24 : 32)) / 3)));
      const fallbackY = startMotionY + 3 * itemH + 2 * itemGap + fallbackGap;
      const markerBottomY = fallbackY + fallbackH + (isCompact ? 10 : 14);

      if (inBounds(axisX - 8, markerBottomY - 10, isCompact ? 60 : 90, 22)) {
        return 'ScrollTrigger end · Viewport trigger leave';
      }

      const triggerPlaneY = paddingY + contentHeight * 0.42;
      if (inBounds(axisX, triggerPlaneY - 8, contentWidth, 16)) {
        return 'Viewport trigger plane · ScrollTrigger region';
      }

      if (inBounds(axisX - 10, paddingY, 20, contentHeight)) {
        return 'Scroll timeline tracking axis';
      }

      for (let i = 0; i < count; i++) {
        const itemBaseY = startMotionY + i * (itemH + itemGap);
        const staggerOffset = i * 0.4;
        const progress = prefersReducedMotion 
          ? 1 
          : (Math.sin(animTimeRef.current * 3 - staggerOffset) + 1) / 2;
        const currentOffsetY = (1 - progress) * -8;
        const itemY = itemBaseY + currentOffsetY;

        if (inBounds(cardStartX, itemY, cardW, itemH)) {
          return `Motion unit 0${i + 1} · Purposeful transition`;
        }
      }

      if (inBounds(cardStartX, fallbackY, cardW, fallbackH)) {
        return 'Reduced-motion fallback · Static transform path';
      }

      if (inBounds(paddingX, paddingY, contentWidth, contentHeight)) {
        return 'ScrollTrigger motion sequence';
      }
    }

    // Stage 04: Production
    else if (stage === 3) {
      const headerH = isCompact ? 20 : 22;
      if (inBounds(paddingX, paddingY + 2, contentWidth, headerH)) {
        return 'Production workflow · Delivery pipeline';
      }

      const busX = paddingX + (isSmall ? 6 : isCompact ? 8 : 16);
      if (inBounds(busX - 6, paddingY, 16, contentHeight)) {
        return 'Production delivery pipeline · Release stages';
      }

      const checks = [
        'Layout stability · Consistent rendering & flow',
        'Responsive assets · Modern picture format cascade',
        'Performance & Core Web Vitals · Critical path loading',
        'Cross-browser QA · Multi-engine verification'
      ];
      const startY = paddingY + headerH + (isCompact ? 8 : 10);
      const handoffH = isCompact ? 22 : 24;
      const bottomBreathing = isCompact ? 6 : 8;

      const totalAvailableH = contentHeight - (startY - paddingY) - handoffH - bottomBreathing;
      const checkGap = isCompact ? 6 : Math.max(7, Math.min(11, Math.floor((totalAvailableH * 0.18) / 3)));
      const handoffGap = isCompact ? 8 : 12;
      const checkH = Math.max(40, Math.min(50, Math.floor((totalAvailableH - 3 * checkGap - handoffGap) / 4)));
      const cardStartX = busX + (isSmall ? 8 : isCompact ? 10 : 18);
      const cardWidth = contentWidth - (cardStartX - paddingX);

      for (let idx = 0; idx < checks.length; idx++) {
        const cY = startY + idx * (checkH + checkGap);
        if (inBounds(cardStartX, cY, cardWidth, checkH)) {
          return checks[idx];
        }
      }

      const handoffY = startY + 4 * (checkH + checkGap) - checkGap + handoffGap;
      if (inBounds(cardStartX, handoffY, cardWidth, handoffH)) {
        return 'Production handoff · Release workflow integration';
      }

      if (inBounds(paddingX, paddingY, contentWidth, contentHeight)) {
        return 'Production release & QA verification';
      }
    }

    return null;
  }, [activeStageIndex, prefersReducedMotion]);

  // Main Render Loop for Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const sectionEl = sectionRef.current;
    if (!canvas || !sectionEl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;

    const updateSize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      canvasSizeRef.current = { width: rect.width, height: rect.height };
    };

    const renderLoop = (timestamp: number) => {
      if (!isCanvasActiveRef.current) {
        animId = null;
        return;
      }

      animTimeRef.current = timestamp * 0.001;
      const { width, height } = canvasSizeRef.current;
      drawCanvas(ctx, width, height, animTimeRef.current);
      animId = requestAnimationFrame(renderLoop);
    };

    const startLoop = () => {
      if (animId !== null || !isCanvasActiveRef.current) return;
      animId = requestAnimationFrame(renderLoop);
    };

    const stopLoop = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isCanvasActiveRef.current = entry?.isIntersecting ?? false;
        if (isCanvasActiveRef.current && !document.hidden) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(sectionEl);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
        return;
      }
      if (isCanvasActiveRef.current) {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (isCanvasActiveRef.current && !document.hidden) {
      startLoop();
    }

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', updateSize);
    };
  }, [drawCanvas]);

  // Pointer Interaction Handlers for Inspection
  const updatePointer = (clientX: number, clientY: number, isTouchEvent = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    pointerPosRef.current = { x, y, isInside: true };

    const semanticObj = getSemanticObjectAt(x, y, rect.width, rect.height);
    if (semanticObj) {
      if (isTouch || isTouchEvent) {
        updateInspectorDisplay(semanticObj);
      } else {
        updateInspectorDisplay(`${semanticObj} · ${Math.round(x)}, ${Math.round(y)}`);
      }
    } else if (isTouch || isTouchEvent) {
      updateInspectorDisplay(null);
    } else {
      updateInspectorDisplay(`${Math.round(x)}, ${Math.round(y)}`);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    updatePointer(e.clientX, e.clientY, false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    updatePointer(e.clientX, e.clientY, true);
  };

  const handlePointerLeave = () => {
    pointerPosRef.current = { x: -100, y: -100, isInside: false };
    updateInspectorDisplay(null);
  };

  return (
    <section 
      ref={sectionRef}
      id="scroll-story" 
      className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-2 font-bold">
              <span>04 / ENGINEERING PIPELINE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              From Figma to Production-Ready Frontend
            </h2>
          </div>
          <p className="max-w-md font-sans text-sm sm:text-base text-slate-400 leading-relaxed">
            A practical look at how I move from supplied designs to responsive frontend systems, editable CMS components, purposeful motion, and production-ready performance.
          </p>
        </div>

        {/* 4 Stage Control Cards Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {SCROLL_STORY_FRAMES.map((frame, idx) => {
            const isActive = activeStageIndex === idx;
            return (
              <button
                key={frame.id}
                onClick={() => handleStageSelect(idx)}
                className={`flex flex-col items-start p-4 rounded-xl text-left border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none relative overflow-hidden group ${
                  isActive
                    ? 'bg-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/40 border-white/5 hover:border-white/20 text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active Stage Progress Indicator */}
                {isActive && isRunning && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: prefersReducedMotion ? 2 : 1.6, ease: 'linear' }}
                    className="absolute top-0 left-0 h-0.5 bg-indigo-500"
                  />
                )}

                <span className={`font-mono text-xs font-bold tracking-wider mb-1 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {frame.stageNumber}
                </span>
                <span className="font-display text-sm font-bold text-white mb-0.5">
                  {frame.title}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {frame.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace Panel: 2-Column Balanced Architecture (Top-aligned, independent column heights) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start rounded-2xl border border-white/10 bg-slate-950/80 p-5 sm:p-7 backdrop-blur-xl">
          
          {/* Left Column: STAGE BODY (Stable max-height grid stack) + CONTROLS (6 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-4 h-full">
            
            {/* STAGE BODY - Unified CSS Grid cell holding all 4 stages simultaneously so height = max(all stages) */}
            <div className="grid grid-cols-1 grid-rows-1">
              {SCROLL_STORY_FRAMES.map((stage, idx) => {
                const isActive = idx === activeStageIndex;
                return (
                  <div
                    key={stage.id}
                    aria-hidden={!isActive}
                    inert={!isActive ? true : undefined}
                    className={`col-start-1 row-start-1 space-y-4 transition-opacity duration-200 ${
                      isActive 
                        ? 'opacity-100 pointer-events-auto visible z-10' 
                        : 'opacity-0 pointer-events-none select-none invisible -z-10'
                    }`}
                  >
                    {/* Stage Eyebrow */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        {stage.stageNumber}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-snug">
                        {stage.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
                      {stage.description}
                    </p>

                    {/* Key Implementation Highlights */}
                    <div className="pt-2">
                      <ul className="space-y-2">
                        {stage.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                            <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pipeline Controls & Navigation (Physically locked at stable Y coordinate directly below stage body) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3.5 border-t border-white/10 text-xs font-mono mt-auto">
              
              {/* Primary Pipeline Action Button */}
              <button
                onClick={handleStartPipeline}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none shrink-0 text-xs"
              >
                {isCompleted ? (
                  <>
                    <RotateCcw size={13} />
                    <span>Replay Pipeline</span>
                  </>
                ) : isRunning ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-200 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span>Running Step {activeStageIndex + 1}...</span>
                  </>
                ) : (
                  <>
                    <Play size={13} className="fill-current" />
                    <span>Run Pipeline</span>
                  </>
                )}
              </button>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-2 text-slate-400">
                <span className="text-xs mr-1">Stage {activeStageIndex + 1} of {SCROLL_STORY_FRAMES.length}</span>
                <button
                  disabled={activeStageIndex === 0}
                  onClick={() => handleStageSelect(activeStageIndex - 1)}
                  className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none text-xs"
                >
                  Previous
                </button>
                <button
                  disabled={activeStageIndex === SCROLL_STORY_FRAMES.length - 1}
                  onClick={() => handleStageSelect(activeStageIndex + 1)}
                  className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none flex items-center gap-1 text-xs"
                >
                  <span>Next</span>
                  <ArrowRight size={11} />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Stage Canvas ONLY (6 cols, naturally compact, top-aligned) */}
          <div className="lg:col-span-6 flex flex-col">
            
            {/* Interactive Canvas Viewport Frame */}
            <div className="flex flex-col rounded-xl border border-white/10 bg-[#040711] shadow-inner overflow-hidden">
              
              {/* Integrated Header Bar - Stage Identity Only */}
              <div className="flex items-center justify-between px-3 sm:px-3.5 bg-slate-900/90 border-b border-white/10 font-mono text-xs shrink-0 h-9 min-h-[36px] overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="font-bold text-indigo-300 whitespace-nowrap shrink-0">
                    <span className="sm:hidden">{currentStage.stageNumber.split(' & ')[0]}</span>
                    <span className="hidden sm:inline">{currentStage.stageNumber}</span>
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono tracking-wider uppercase hidden sm:block">
                  STAGE CANVAS
                </div>
              </div>

              {/* Dedicated HTML5 Canvas Drawing Stage */}
              <div className="relative min-h-[290px] xs:min-h-[310px] sm:min-h-[340px] md:min-h-[360px] lg:min-h-[370px] w-full">
                <canvas 
                  ref={canvasRef} 
                  onPointerMove={handlePointerMove}
                  onPointerDown={handlePointerDown}
                  onPointerLeave={handlePointerLeave}
                  className="h-full w-full block cursor-crosshair touch-pan-y"
                />
              </div>

              {/* Integrated Bottom Status Bar - Sole Inspection State */}
              <div className="flex items-center justify-between px-3 sm:px-3.5 bg-slate-950/80 border-t border-white/5 font-mono text-xs text-slate-400 shrink-0 h-8 min-h-[32px] overflow-hidden">
                <span className="whitespace-nowrap shrink-0 text-slate-400">STAGE INSPECTOR · {currentStage.stageNumber.split(' / ')[0]}</span>
                <div className="text-slate-400 truncate ml-2 min-w-0 flex items-center justify-end gap-1.5">
                  <MousePointer size={12} className="text-indigo-400 shrink-0" />
                  <span className="truncate whitespace-nowrap">
                    <span ref={inspectorPrimaryRef} className="text-indigo-200 font-semibold" />
                    <span ref={inspectorSecondaryRef} className="text-slate-400 ml-1.5 hidden md:inline" />
                    <span ref={inspectorPlaceholderRef} className="text-slate-400 whitespace-nowrap">
                      {isTouch ? 'Tap elements to inspect' : 'Hover elements to inspect'}
                    </span>
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
