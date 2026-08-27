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
  | 'gaido';

export type CoverImageRegistry = Record<CoverImageSlug, CoverImageSet>;

export const COVER_IMAGE_WIDTHS = [640, 960, 1376, 2752] as const;

export const COVER_IMAGE_SIZES =
  '(min-width: 1024px) min(560px, calc((100vw - 3rem) / 2)), (min-width: 768px) min(688px, calc(100vw - 3rem)), calc(100vw - 2rem)';

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
