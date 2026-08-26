import React from 'react';
import { CoverImageSet, isCoverImageSet } from '../types/coverImage';

interface BrowserFrameProps {
  src: string | CoverImageSet;
  alt: string;
  domain?: string;
  url?: string;
  className?: string;
  aspectRatio?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

function renderImage(src: string | CoverImageSet, alt: string, className: string) {
  if (!isCoverImageSet(src)) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${src.avif1x} 1x, ${src.avif2x} 2x`}
        sizes="(min-width: 768px) 688px, 100vw"
      />
      <source
        type="image/webp"
        srcSet={`${src.webp1x} 1x, ${src.webp2x} 2x`}
        sizes="(min-width: 768px) 688px, 100vw"
      />
      <img
        src={src.webp1x}
        alt={alt}
        width={src.width}
        height={src.height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  src,
  alt,
  domain,
  url,
  className = '',
  aspectRatio = 'aspect-[1376/768]',
  children,
  onClick
}) => {
  const imageClassName =
    'h-full w-full object-cover object-top block transition-transform duration-500 ease-out group-hover/browser:scale-[1.02] rounded-b-[11px] will-change-transform';

  const frameContent = (
    <div
      onClick={onClick}
      className={`group/browser block overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 shadow-md transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5 relative isolate transform-gpu ${className}`}
    >
      <div className="flex h-8 sm:h-9 items-center justify-between px-3 sm:px-3.5 bg-slate-950 border-b border-white/10 select-none rounded-t-[11px]">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/90 block" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/90 block" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/90 block" />
        </div>

        {domain && (
          <div className="font-mono text-xs text-slate-400 font-medium truncate px-2 text-center max-w-[200px] sm:max-w-[320px]">
            {domain}
          </div>
        )}

        <div className="w-[42px] shrink-0" aria-hidden="true" />
      </div>

      <div className={`relative ${aspectRatio} w-full overflow-hidden bg-slate-900 rounded-b-[11px] isolate`}>
        {renderImage(src, alt, imageClassName)}
        {children}
      </div>
    </div>
  );

  if (url && !children) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b15] rounded-xl"
        title={domain ? `Visit ${domain}` : alt}
        aria-label={domain ? `Open ${domain} in a new tab` : alt}
      >
        {frameContent}
      </a>
    );
  }

  return frameContent;
};
