export interface CoverImageVariant {
  width: number;
  avif: string;
  webp: string;
}

export interface CoverImageSet {
  variants: CoverImageVariant[];
  width: number;
  height: number;
}

export type CoverImageSlug =
  | 'wwf'
  | 'mvp'
  | 'precision'
  | 'mochi'
  | 'bopper'
  | 'eleven'
  | 'schoolhouse'
  | 'gaido'
  | 'energy';

export type CoverImageRegistry = Record<CoverImageSlug, CoverImageSet>;

// Mirrors the case-card layout: one column up to lg, three columns after it,
// inside a 72rem grid. The subtracted values are the page gutters, the 1.75rem
// grid gaps and the card padding, so the browser is told the real render width.
export const COVER_IMAGE_SIZES =
  '(min-width: 1024px) calc((min(100vw - 4rem, 72rem) - 3.5rem) / 3 - 2.75rem), (min-width: 640px) calc(100vw - 5.75rem), calc(100vw - 4.25rem)';

export function coverImageSet(
  variants: CoverImageVariant[],
  width: number,
  height: number,
): CoverImageSet {
  return {
    variants: [...variants].sort((a, b) => a.width - b.width),
    width,
    height,
  };
}

export function isCoverImageSet(value: string | CoverImageSet): value is CoverImageSet {
  return typeof value === 'object' && value !== null && Array.isArray((value as CoverImageSet).variants);
}

export function buildFormatSrcSet(variants: CoverImageVariant[], format: 'avif' | 'webp'): string {
  return variants.map((variant) => `${variant[format]} ${variant.width}w`).join(', ');
}

export function defaultCoverSrc(set: CoverImageSet): string {
  const fallback =
    set.variants.find((variant) => variant.width === 640) ??
    set.variants.find((variant) => variant.width === 960) ??
    set.variants[0];

  return fallback?.webp ?? '';
}
