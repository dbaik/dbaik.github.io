import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { SCROLL_INTENT_EVENT } from '../utils/scroll';

type LazyWhenVisibleProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** Expand the intersection root so chunks start loading slightly before scroll. */
  rootMargin?: string;
  /** Placeholder targets for in-page nav before the lazy section mounts. */
  anchors?: string;
};

function isScrollIntentEvent(event: Event): boolean {
  if (event.type !== 'keydown') return true;
  if (!(event instanceof KeyboardEvent)) return false;

  switch (event.key) {
    case ' ':
    case 'PageDown':
    case 'PageUp':
    case 'ArrowDown':
    case 'ArrowUp':
    case 'Home':
    case 'End':
      return true;
    default:
      return false;
  }
}

function onFirstScrollIntent(callback: () => void): () => void {
  const listener = (event: Event) => {
    if (!isScrollIntentEvent(event)) return;
    detach();
    callback();
  };

  const detach = () => {
    window.removeEventListener('scroll', listener);
    window.removeEventListener('wheel', listener);
    window.removeEventListener('touchstart', listener);
    window.removeEventListener('keydown', listener);
    window.removeEventListener(SCROLL_INTENT_EVENT, listener);
  };

  window.addEventListener('scroll', listener, { passive: true });
  window.addEventListener('wheel', listener, { passive: true });
  window.addEventListener('touchstart', listener, { passive: true });
  window.addEventListener('keydown', listener);
  window.addEventListener(SCROLL_INTENT_EVENT, listener);
  return detach;
}

/**
 * Mounts Suspense children only when near the viewport after the first scroll
 * (or immediately on hash deep-links). React.lazy alone still fetches as soon
 * as the parent renders the lazy element.
 */
export default function LazyWhenVisible({
  children,
  fallback = <div className="min-h-[16rem]" aria-hidden="true" />,
  rootMargin = '320px 0px',
  anchors,
}: LazyWhenVisibleProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    // Deep links need the target section in the DOM for scroll/anchors.
    if (window.location.hash.length > 1) {
      setShouldRender(true);
      return;
    }

    let observer: IntersectionObserver | null = null;

    const armObserver = () => {
      const node = sentinelRef.current;
      if (!node || observer) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShouldRender(true);
            observer?.disconnect();
          }
        },
        { root: null, rootMargin, threshold: 0 },
      );

      observer.observe(node);
    };

    if (window.scrollY > 0) {
      armObserver();
      return () => observer?.disconnect();
    }

    const detachScrollIntent = onFirstScrollIntent(armObserver);
    return () => {
      detachScrollIntent();
      observer?.disconnect();
    };
  }, [rootMargin, shouldRender]);

  return (
    <div ref={sentinelRef} data-lazy-section={anchors}>
      {shouldRender ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}
