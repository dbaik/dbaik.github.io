import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

type LazyWhenVisibleProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** Expand the intersection root so chunks start loading slightly before scroll. */
  rootMargin?: string;
};

/**
 * Mounts Suspense children only when near the viewport (or on hash deep-links).
 * React.lazy alone still fetches as soon as the parent renders the lazy element.
 */
export default function LazyWhenVisible({
  children,
  fallback = <div className="min-h-[16rem]" aria-hidden="true" />,
  rootMargin = '320px 0px',
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

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={sentinelRef}>
      {shouldRender ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}
