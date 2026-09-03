import { useEffect, useRef, useState } from 'react';

function prefersCustomCursor(): boolean {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function setNativeCursor(hidden: boolean) {
  document.documentElement.classList.toggle('has-custom-cursor-native', hidden);
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: -100, y: -100 });
  const hoverRef = useRef({ hovered: false, label: null as string | null, hidden: false });

  const [mounted, setMounted] = useState(false);
  const [enabled] = useState(() => typeof window !== 'undefined' && prefersCustomCursor());

  const applyCursorStyles = () => {
    const cursorEl = cursorRef.current;
    const ringEl = ringRef.current;
    const labelEl = labelRef.current;
    const dotEl = dotRef.current;
    if (!cursorEl || !ringEl || !labelEl || !dotEl) return;

    const { x, y } = positionRef.current;
    const { hovered, label, hidden } = hoverRef.current;
    const scale = hovered ? 1.2 : 1;

    cursorEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    cursorEl.classList.toggle('opacity-0', hidden);

    if (label) {
      ringEl.className =
        'custom-cursor-ring flex items-center justify-center rounded-full border transition-all duration-300 h-16 w-16 bg-white text-black mix-blend-normal';
      labelEl.textContent = label;
      labelEl.classList.remove('hidden');
      dotEl.classList.add('hidden');
    } else if (hovered) {
      ringEl.className =
        'custom-cursor-ring flex items-center justify-center rounded-full border transition-all duration-300 h-10 w-10 bg-current/20';
      labelEl.classList.add('hidden');
      dotEl.className = 'custom-cursor-dot rounded-full bg-current transition-all duration-300 h-1.5 w-1.5 block';
    } else {
      ringEl.className =
        'custom-cursor-ring flex items-center justify-center rounded-full border transition-all duration-300 h-6 w-6';
      labelEl.classList.add('hidden');
      dotEl.className = 'custom-cursor-dot rounded-full bg-current transition-all duration-300 h-1 w-1 block';
    }
  };

  const setHoverState = (hovered: boolean, label: string | null, hidden = false) => {
    if (
      hoverRef.current.hovered === hovered &&
      hoverRef.current.label === label &&
      hoverRef.current.hidden === hidden
    ) {
      return;
    }
    hoverRef.current = { hovered, label, hidden };
    applyCursorStyles();
  };

  useEffect(() => {
    if (!enabled) return;

    setMounted(true);
    document.documentElement.classList.add('has-custom-cursor');
    setNativeCursor(false);

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const overHidden = Boolean(
        hit?.closest('[data-cursor="hide"], input, select, textarea, label, [contenteditable="true"]'),
      );
      if (overHidden !== hoverRef.current.hidden) {
        setNativeCursor(overHidden);
        setHoverState(hoverRef.current.hovered, hoverRef.current.label, overHidden);
      }
      applyCursorStyles();
      if (!hoverRef.current.hidden) {
        cursorRef.current?.classList.remove('opacity-0');
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverTarget = target.closest('[data-cursor]');

      if (hoverTarget) {
        const label = hoverTarget.getAttribute('data-cursor');
        if (label === 'hide') {
          setNativeCursor(true);
          setHoverState(false, null, true);
          return;
        }
        setNativeCursor(false);
        setHoverState(true, label && label !== 'true' ? label : null, false);
        return;
      }

      const overFormField = Boolean(target.closest('input, select, textarea, label, [contenteditable="true"]'));
      if (overFormField) {
        setNativeCursor(true);
        setHoverState(false, null, true);
        return;
      }

      const standardInteractive = target.closest('a, button');
      setNativeCursor(false);
      setHoverState(Boolean(standardInteractive), null, false);
    };

    const handleMouseLeave = () => {
      cursorRef.current?.classList.add('opacity-0');
    };

    const handleMouseEnter = () => {
      cursorRef.current?.classList.remove('opacity-0');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.classList.remove('has-custom-cursor', 'has-custom-cursor-native');
    };
  }, [enabled]);

  if (!enabled || !mounted) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-[99999] will-change-transform opacity-0"
      style={{
        transition: 'transform 0.08s cubic-bezier(0.2, 0, 0.2, 1)',
      }}
    >
      <div
        ref={ringRef}
        className="custom-cursor-ring flex items-center justify-center rounded-full border transition-all duration-300 h-6 w-6"
      >
        <span ref={labelRef} className="hidden font-mono text-[10px] font-bold tracking-widest text-black" />
        <div ref={dotRef} className="custom-cursor-dot rounded-full bg-current transition-all duration-300 h-1 w-1" />
      </div>
    </div>
  );
}
