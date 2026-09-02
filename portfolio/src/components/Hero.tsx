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
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    let prefersReducedMotion = reducedMotionQuery.matches;
    let hasFineHover = hoverQuery.matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frameId = 0;

    const maxRotate = 10;

    const applyTilt = () => {
      portraitEl.style.transform = `rotateY(${current.x.toFixed(2)}deg) rotateX(${current.y.toFixed(2)}deg)`;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;

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
      if (prefersReducedMotion || !hasFineHover) return;

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

    if (hasFineHover && !prefersReducedMotion) {
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

    const handleHoverChange = (e: MediaQueryListEvent) => {
      hasFineHover = e.matches;
      if (!hasFineHover) {
        target.x = 0;
        target.y = 0;
        startTick();
      }
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    hoverQuery.addEventListener('change', handleHoverChange);

    return () => {
      heroEl.removeEventListener('pointermove', handlePointerMove);
      heroEl.removeEventListener('pointerleave', handlePointerLeave);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      hoverQuery.removeEventListener('change', handleHoverChange);
      if (frameId) window.cancelAnimationFrame(frameId);
      portraitEl.style.transform = '';
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-0 flex-col justify-center overflow-hidden bg-[#070b15] pt-24 pb-10 px-4 sm:min-h-[90vh] sm:pt-28 sm:pb-16 sm:px-6 lg:px-8 scroll-mt-20 md:scroll-mt-24 border-b border-white/5"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      <HeroVisualGrid containerRef={heroRef} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div
              id="hero-status"
              className="hero-reveal hero-reveal-delay-0 mb-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1"
            >
              <p className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">
                WordPress <span aria-hidden="true">·</span> Shopify <span aria-hidden="true">·</span> Figma to production
              </p>
              <p className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs text-slate-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {PERSONAL_INFO.availability}
              </p>
            </div>

            <div className="space-y-5">
              <h1
                id="hero-name"
                className="hero-reveal hero-reveal-delay-1 font-display text-3xl sm:text-5xl lg:text-[3.4rem] xl:text-6xl font-extrabold tracking-tight text-white leading-tight cursor-default select-text inline-block"
              >
                {PERSONAL_INFO.name}
              </h1>

              <div id="hero-tagline" className="hero-reveal hero-reveal-delay-2">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl font-bold text-slate-100 leading-snug max-w-2xl">
                  Pixel-perfect for users. <br className="hidden sm:inline" />
                  Editable for teams. <br className="hidden sm:inline" />
                  Maintainable for developers.
                </h2>
              </div>

              <p
                id="hero-desc"
                className="hero-reveal hero-reveal-delay-3 font-sans text-sm sm:text-base text-slate-400 max-w-[38rem] leading-relaxed"
              >
                {PERSONAL_INFO.experienceSummary}
              </p>
            </div>

            <div
              id="hero-cta"
              className="hero-reveal hero-reveal-delay-4 mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => scrollTo('featured-work')}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-sans text-sm font-bold text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors cursor-pointer"
              >
                <span>Explore Featured Work</span>
                <ArrowDown size={15} />
              </button>

              <button
                onClick={() => scrollTo('archive')}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-sans text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-all cursor-pointer"
              >
                <span>View All Projects</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5" style={{ perspective: '1100px' }}>
            <div
              ref={portraitRef}
              className="origin-center"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <AsciiArtCanvas
                src="/hero-portrait.webp"
                label="ASCII portrait of Dmitry Bashkatov"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
