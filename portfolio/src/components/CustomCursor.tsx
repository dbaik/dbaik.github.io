import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if touch device
    const touchCheck = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      );
    };
    touchCheck();

    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverTarget = target.closest('[data-cursor]');
      
      if (hoverTarget) {
        setHovered(true);
        const label = hoverTarget.getAttribute('data-cursor');
        setCursorLabel(label && label !== 'true' ? label : null);
      } else {
        // Also check if hovering standard links/buttons for default hover style
        const standardInteractive = target.closest('a, button, select, input, textarea');
        if (standardInteractive) {
          setHovered(true);
          setCursorLabel(null);
        } else {
          setHovered(false);
          setCursorLabel(null);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
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
    };
  }, [isVisible, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] mix-blend-difference will-change-transform"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${hovered ? 1.2 : 1})`,
        transition: 'transform 0.08s cubic-bezier(0.2, 0, 0.2, 1)',
      }}
    >
      {/* Outer ring */}
      <div className={`flex items-center justify-center rounded-full border border-white transition-all duration-300 ${
        cursorLabel 
          ? 'h-16 w-16 bg-white text-black mix-blend-normal' 
          : hovered 
            ? 'h-10 w-10 bg-white/20' 
            : 'h-6 w-6'
      }`}>
        {cursorLabel ? (
          <span className="font-mono text-[10px] font-bold tracking-widest text-black">
            {cursorLabel}
          </span>
        ) : (
          /* Inner Dot */
          <div className={`rounded-full bg-white transition-all duration-300 ${
            hovered ? 'h-1.5 w-1.5 bg-black' : 'h-1 w-1'
          }`} />
        )}
      </div>
    </div>
  );
}
