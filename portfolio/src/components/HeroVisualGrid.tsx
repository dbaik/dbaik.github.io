import React, { useEffect, useRef } from 'react';

interface HeroVisualGridProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

function isLightScheme(): boolean {
  const html = document.documentElement;
  if (html.classList.contains('scheme-light')) return true;
  if (html.classList.contains('scheme-dark')) return false;
  return window.matchMedia('(prefers-color-scheme: light)').matches;
}

function gridInk(alpha: number): string {
  if (isLightScheme()) {
    return `rgba(15, 23, 42, ${Math.min(1, alpha * 2.2)})`;
  }
  return `rgba(255, 255, 255, ${alpha})`;
}

interface GridNode {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  colIndex: number;
  rowIndex: number;
  isKeyNode: boolean;
}

export default function HeroVisualGrid({ containerRef }: HeroVisualGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check device capability and user motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    let prefersReducedMotion = mediaQuery.matches;
    let hasFineHover = hoverMediaQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animFrameId: number | null = null;
    let isVisible = true;
    let isIdle = false;

    // Grid layout parameters
    let cols = 12;
    let rows = 8;
    const colStep = 72;
    const rowStep = 52;
    let nodes: GridNode[] = [];

    // Pointer state with smooth inertia
    const pointer = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isInside: false,
      radius: 160,
      maxDisplacement: 5.5,
    };

    // Initialize grid layout nodes
    const initGrid = (w: number, h: number) => {
      nodes = [];
      cols = Math.max(6, Math.floor(w / colStep));
      rows = Math.max(5, Math.floor(h / rowStep));

      const marginY = 16;
      const actualColStep = w / cols;
      const actualRowStep = (h - marginY * 2) / Math.max(1, rows - 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const baseX = c * actualColStep;
          const baseY = marginY + r * actualRowStep;
          const isKeyNode = (c % 2 === 0 && r % 2 === 0) || (c === 0 || c === cols);

          nodes.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            vx: 0,
            vy: 0,
            colIndex: c,
            rowIndex: r,
            isKeyNode,
          });
        }
      }
    };

    // Resize handler
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initGrid(width, height);

      if (prefersReducedMotion || !hasFineHover) {
        drawStaticGrid();
      } else {
        wakeUp();
      }
    };

    // Draw static engineering grid for reduced motion or touch devices
    const drawStaticGrid = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Horizontal grid lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        const y = 16 + r * ((height - 32) / Math.max(1, rows - 1));
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = gridInk(0.04);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2. Vertical grid lines (subtly clearer on the open right side)
      for (let c = 0; c <= cols; c++) {
        const x = (c * width) / cols;
        const colAlpha = 0.035 + (c / cols) * 0.045;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = gridInk(colAlpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Coordinate crosshairs
      const size = 2.5;
      nodes.forEach((n) => {
        if (n.isKeyNode) {
          const crossAlpha = 0.09 + (n.baseX / Math.max(1, width)) * 0.12;
          ctx.strokeStyle = `rgba(129, 140, 248, ${crossAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.baseX - size, n.baseY);
          ctx.lineTo(n.baseX + size, n.baseY);
          ctx.moveTo(n.baseX, n.baseY - size);
          ctx.lineTo(n.baseX, n.baseY + size);
          ctx.stroke();
        }
      });
    };

    // Continuous interactive render loop
    const render = () => {
      if (!isVisible || prefersReducedMotion || !hasFineHover) {
        return;
      }

      // Smooth pointer interpolation
      pointer.x += (pointer.targetX - pointer.x) * 0.14;
      pointer.y += (pointer.targetY - pointer.y) * 0.14;

      ctx.clearRect(0, 0, width, height);

      let maxNodeDelta = 0;

      // Update node physics with restrained spring response
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        let targetX = node.baseX;
        let targetY = node.baseY;

        if (pointer.isInside) {
          const dx = pointer.x - node.baseX;
          const dy = pointer.y - node.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pointer.radius && dist > 0) {
            // Controlled displacement pulling slightly toward pointer
            const factor = Math.cos((dist / pointer.radius) * (Math.PI / 2));
            const force = factor * pointer.maxDisplacement;
            const angle = Math.atan2(dy, dx);
            targetX = node.baseX + Math.cos(angle) * force * 0.65;
            targetY = node.baseY + Math.sin(angle) * force * 0.65;
          }
        }

        // Spring physics damping
        const ax = (targetX - node.x) * 0.12;
        const ay = (targetY - node.y) * 0.12;
        node.vx = (node.vx + ax) * 0.76;
        node.vy = (node.vy + ay) * 0.76;
        node.x += node.vx;
        node.y += node.vy;

        const delta = Math.abs(node.x - node.baseX) + Math.abs(node.y - node.baseY) + Math.abs(node.vx) + Math.abs(node.vy);
        if (delta > maxNodeDelta) {
          maxNodeDelta = delta;
        }
      }

      const nodesPerRow = cols + 1;

      // 1. Draw horizontal structural layout lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const idx = r * nodesPerRow + c;
          const node = nodes[idx];
          if (c === 0) {
            ctx.moveTo(node.x, node.y);
          } else {
            const prev = nodes[idx - 1];
            const cx = (prev.x + node.x) / 2;
            const cy = (prev.y + node.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
            if (c === cols) {
              ctx.lineTo(node.x, node.y);
            }
          }
        }
        ctx.strokeStyle = gridInk(0.04);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2. Draw vertical structural lines (gradient-enhanced to the right)
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const idx = r * nodesPerRow + c;
          const node = nodes[idx];
          if (r === 0) {
            ctx.moveTo(node.x, node.y);
          } else {
            const prev = nodes[(r - 1) * nodesPerRow + c];
            const cx = (prev.x + node.x) / 2;
            const cy = (prev.y + node.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
            if (r === rows - 1) {
              ctx.lineTo(node.x, node.y);
            }
          }
        }
        const colAlpha = 0.035 + (c / cols) * 0.045;
        ctx.strokeStyle = gridInk(colAlpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Draw intersection markers & interactive crosshairs
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNearPointer = pointer.isInside && dist < pointer.radius;

        if (isNearPointer) {
          // Dynamic crosshair responding to cursor proximity
          const proximity = 1 - dist / pointer.radius;
          const alpha = 0.14 + proximity * 0.35;
          const crossSize = 3 + proximity * 2.5;

          ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x - crossSize, node.y);
          ctx.lineTo(node.x + crossSize, node.y);
          ctx.moveTo(node.x, node.y - crossSize);
          ctx.lineTo(node.x, node.y + crossSize);
          ctx.stroke();
        } else if (node.isKeyNode) {
          // Resting technical crosshair
          const crossAlpha = 0.08 + (node.baseX / Math.max(1, width)) * 0.12;
          ctx.strokeStyle = `rgba(129, 140, 248, ${crossAlpha})`;
          ctx.lineWidth = 1;
          const s = 2;
          ctx.beginPath();
          ctx.moveTo(node.x - s, node.y);
          ctx.lineTo(node.x + s, node.y);
          ctx.moveTo(node.x, node.y - s);
          ctx.lineTo(node.x, node.y + s);
          ctx.stroke();
        }
      }

      // 4. Subtle coordinate guide line to cursor
      if (pointer.isInside) {
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.07)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        
        ctx.beginPath();
        ctx.moveTo(pointer.x, 0);
        ctx.lineTo(pointer.x, height);
        ctx.moveTo(0, pointer.y);
        ctx.lineTo(width, pointer.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Check if animation has settled to resting state
      if (!pointer.isInside && maxNodeDelta < 0.02) {
        isIdle = true;
        animFrameId = null;
        return;
      }

      animFrameId = requestAnimationFrame(render);
    };

    const wakeUp = () => {
      if (prefersReducedMotion || !hasFineHover || !isVisible) return;
      if (isIdle || !animFrameId) {
        isIdle = false;
        if (animFrameId) cancelAnimationFrame(animFrameId);
        animFrameId = requestAnimationFrame(render);
      }
    };

    // Pointer event listeners on container
    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion || !hasFineHover) return;
      const rect = container.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.isInside = true;
      wakeUp();
    };

    const handlePointerEnter = (e: PointerEvent) => {
      if (prefersReducedMotion || !hasFineHover) return;
      const rect = container.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
      pointer.isInside = true;
      wakeUp();
    };

    const handlePointerLeave = () => {
      pointer.isInside = false;
      pointer.targetX = -1000;
      pointer.targetY = -1000;
      wakeUp();
    };

    // Reduced motion listener
    const handleMediaChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        if (animFrameId) cancelAnimationFrame(animFrameId);
        drawStaticGrid();
      } else {
        wakeUp();
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleHoverMediaChange = (e: MediaQueryListEvent) => {
      hasFineHover = e.matches;
      if (!hasFineHover) {
        if (animFrameId) cancelAnimationFrame(animFrameId);
        drawStaticGrid();
      } else {
        wakeUp();
      }
    };
    hoverMediaQuery.addEventListener('change', handleHoverMediaChange);

    const redrawForScheme = () => {
      if (prefersReducedMotion || !hasFineHover) {
        drawStaticGrid();
      } else {
        wakeUp();
      }
    };
    const schemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    schemeMedia.addEventListener('change', redrawForScheme);
    const schemeObserver = new MutationObserver(redrawForScheme);
    schemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      } else {
        isVisible = true;
        wakeUp();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // IntersectionObserver to sleep when Hero is offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible) {
          wakeUp();
        } else if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Bind pointer listeners to container
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial setup
    handleResize();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
      hoverMediaQuery.removeEventListener('change', handleHoverMediaChange);
      schemeMedia.removeEventListener('change', redrawForScheme);
      schemeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 
        Soft typography and UI content mask:
        - Attenuates background grid lines under the content column (left 0-55% where name, headline, proof, and CTAs sit)
        - Eliminates visual competition between foreground text/buttons and background grid lines
        - Keeps the open right-hand area crisp, technical, and recognizable
      */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none" 
        style={{
          background: 'radial-gradient(ellipse 75% 70% at 22% 52%, color-mix(in srgb, var(--canvas) 82%, transparent) 0%, color-mix(in srgb, var(--canvas) 45%, transparent) 55%, transparent 100%)',
        }}
      />
      
      {/* Engineering Layout Canvas with smooth gradient mask into transparency */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 95% 80% at 50% 35%, black 25%, rgba(0, 0, 0, 0.65) 55%, rgba(0, 0, 0, 0.15) 78%, transparent 96%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 80% at 50% 35%, black 25%, rgba(0, 0, 0, 0.65) 55%, rgba(0, 0, 0, 0.15) 78%, transparent 96%)',
        }}
      />
    </div>
  );
}
