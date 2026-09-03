/**
 * Smooth scrolling utility that coordinates with Lenis smooth scroll
 * and provides robust cross-browser and mobile fallbacks.
 */

export const SCROLL_INTENT_EVENT = 'portfolio:scroll-intent';
export const CONTACT_TYPE_EVENT = 'portfolio:contact-type';

let pendingContactType: string | null = null;

export function setPendingContactType(type: string) {
  pendingContactType = type;
}

export function consumePendingContactType(): string | null {
  const type = pendingContactType;
  pendingContactType = null;
  return type;
}

export function scrollToContactWithType(type: string) {
  setPendingContactType(type);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONTACT_TYPE_EVENT, { detail: type }));
  }
  scrollToSection('#contact');
}

function sectionId(target: string): string {
  return target.startsWith('#') ? target.slice(1) : target;
}

function resolveSection(target: string): HTMLElement | null {
  const id = sectionId(target);
  return (
    document.getElementById(id) ??
    document.querySelector(`[data-lazy-section~="${CSS.escape(id)}"]`)
  );
}

function scrollToElement(targetEl: HTMLElement, targetOffset: number, immediate = false) {
  const globalLenis = (window as unknown as { __lenis?: { scrollTo: (target: unknown, opts: unknown) => void } }).__lenis;

  if (globalLenis && typeof globalLenis.scrollTo === 'function') {
    globalLenis.scrollTo(targetEl, {
      offset: targetOffset,
      duration: immediate ? 0 : 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      immediate,
    });
    return;
  }

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

export function scrollToSection(
  target: string | HTMLElement,
  customOffset?: number
) {
  if (typeof window === 'undefined') return;

  // Below-fold sections stay unmounted until the first scroll intent.
  window.dispatchEvent(new Event(SCROLL_INTENT_EVENT));

  // Sections contain internal top padding (py-14 / py-20 / py-24).
  // A 20px offset leaves a small gap below the sticky header.
  const targetOffset = customOffset ?? 20;

  if (typeof target !== 'string') {
    scrollToElement(target, targetOffset);
    return;
  }

  const id = sectionId(target);
  const hash = `#${id}`;
  if (window.history.pushState) {
    window.history.pushState(null, '', hash);
  }

  const tryScroll = (immediate = false) => {
    const targetEl = resolveSection(target);
    if (!targetEl) return false;
    scrollToElement(targetEl, targetOffset, immediate);
    return targetEl.id === id;
  };

  tryScroll(false);

  const started = performance.now();
  const poll = () => {
    const elapsed = performance.now() - started;
    tryScroll(elapsed > 200);
    if (elapsed > 1800) return;
    window.requestAnimationFrame(poll);
  };
  window.requestAnimationFrame(poll);
}
