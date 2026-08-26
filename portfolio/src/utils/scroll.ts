/**
 * Smooth scrolling utility that coordinates with Lenis smooth scroll
 * and provides robust cross-browser and mobile fallbacks.
 */

export function scrollToSection(
  target: string | HTMLElement,
  customOffset?: number
) {
  if (typeof window === 'undefined') return;

  const targetEl = typeof target === 'string'
    ? (document.querySelector(target.startsWith('#') ? target : `#${target}`) as HTMLElement | null)
    : target;

  if (!targetEl) return;

  // Sections contain internal top padding (py-14 / py-20 / py-24), so aligning target's top border
  // to viewport top (offset: 0) ensures the preceding section is completely scrolled out of view.
  const targetOffset = customOffset ?? 0;

  const globalLenis = (window as unknown as { __lenis?: { scrollTo: (target: unknown, opts: unknown) => void } }).__lenis;

  if (globalLenis && typeof globalLenis.scrollTo === 'function') {
    globalLenis.scrollTo(targetEl, {
      offset: targetOffset,
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      immediate: false,
    });
  } else {
    const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const rect = targetEl.getBoundingClientRect();
    const targetY = Math.max(0, rect.top + currentScroll + targetOffset);

    try {
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    } catch {
      window.scrollTo(0, targetY);
    }
  }

  const hash = typeof target === 'string' 
    ? (target.startsWith('#') ? target : `#${target}`) 
    : (targetEl.id ? `#${targetEl.id}` : '');

  if (hash && window.history.pushState) {
    window.history.pushState(null, '', hash);
  }
}
