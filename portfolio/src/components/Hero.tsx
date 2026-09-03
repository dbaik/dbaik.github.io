import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import AsciiArtCanvas from './AsciiArtCanvas';
import HeroVisualGrid from './HeroVisualGrid';
import { scrollToSection } from '../utils/scroll';

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (id: string) => {
    scrollToSection(id);
  };

  useEffect(() => {
    const heroEl = heroRef.current;
    const portraitEl = portraitRef.current;
    if (!heroEl || !portraitEl) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let prefersReducedMotion = reducedMotionQuery.matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frameId = 0;

    const maxRotate = 10;

    const applyTilt = () => {
      portraitEl.style.transform = `rotateY(${current.x.toFixed(2)}deg) rotateX(${current.y.toFixed(2)}deg)`;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.09;
      current.y += (target.y - current.y) * 0.09;

      if (Math.abs(target.x - current.x) < 0.02 && Math.abs(target.y - current.y) < 0.02) {
        current.x = target.x;
        current.y = target.y;
        applyTilt();
        frameId = 0;
        return;
      }

      applyTilt();
      frameId = window.requestAnimationFrame(tick);
    };

    const startTick = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;

      const rect = heroEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target.x = Math.max(-1, Math.min(1, normX)) * maxRotate;
      target.y = Math.max(-1, Math.min(1, -normY)) * maxRotate;
      startTick();
    };

    const handlePointerLeave = () => {
      target.x = 0;
      target.y = 0;
      startTick();
    };

    if (!prefersReducedMotion) {
      heroEl.addEventListener('pointermove', handlePointerMove, { passive: true });
      heroEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        target.x = 0;
        target.y = 0;
        startTick();
      }
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      heroEl.removeEventListener('pointermove', handlePointerMove);
      heroEl.removeEventListener('pointerleave', handlePointerLeave);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      if (frameId) window.cancelAnimationFrame(frameId);
      portraitEl.style.transform = '';
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-0 flex-col justify-start overflow-visible bg-[#070b15] pt-24 pb-6 px-4 sm:px-6 md:min-h-[90vh] md:justify-center md:pt-28 md:pb-16 lg:px-8 scroll-mt-20 md:scroll-mt-24 border-b border-white/5"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      <HeroVisualGrid containerRef={heroRef} />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 min-w-0">
            <p
              id="hero-status"
              className="hero-reveal hero-reveal-delay-0 mb-5 font-mono text-[11px] sm:text-xs uppercase tracking-wider text-slate-400"
            >
              {PERSONAL_INFO.name} <span aria-hidden="true">·</span> {PERSONAL_INFO.title}
            </p>

            <div className="space-y-5">
              <h1
                id="hero-offer"
                className="hero-reveal hero-reveal-delay-1 font-display text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.08] cursor-default select-text"
              >
                {PERSONAL_INFO.subtitle}
              </h1>

              <p
                id="hero-desc"
                className="hero-reveal hero-reveal-delay-2 font-sans text-base sm:text-lg lg:text-[1.5rem] text-slate-400 max-w-[36rem] leading-relaxed"
              >
                {PERSONAL_INFO.experienceSummary}
              </p>

              <ul
                id="hero-trust"
                className="hero-reveal hero-reveal-delay-3 space-y-1 font-mono text-xs sm:text-[13px] tracking-wide leading-6"
              >
                {PERSONAL_INFO.trustLine.split(' · ').map((part) => (
                  <li key={part} className="flex gap-2">
                    <span aria-hidden="true">›</span>
                    <span>{part}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              id="hero-cta"
              className="hero-reveal hero-reveal-delay-4 mt-5 flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={() => scrollTo('contact')}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-sans text-sm font-bold text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors cursor-pointer"
              >
                <span>Discuss a Project</span>
              </button>

              <button
                type="button"
                onClick={() => scrollTo('featured-work')}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-sans text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-all cursor-pointer"
              >
                <span>View Case Studies</span>
                <ArrowDown size={15} />
              </button>
            </div>
          </div>

          <div className="hidden w-full min-w-0 justify-center overflow-visible px-2 py-10 max-lg:h-0 max-lg:min-h-0 max-lg:p-0 max-lg:overflow-hidden lg:col-span-6 lg:flex" style={{ perspective: '1100px' }}>
            <div
              ref={portraitRef}
              className="origin-center w-full max-w-[33rem] overflow-visible"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <AsciiArtCanvas
                src="/hero-portrait.svg"
                label="ASCII portrait of Dmitry Bashkatov"
                followRootRef={heroRef}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
