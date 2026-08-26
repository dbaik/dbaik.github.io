export interface CoverImageSet {
  avif1x: string;
  avif2x: string;
  webp1x: string;
  webp2x: string;
  width: number;
  height: number;
}

export function coverImage(
  avif1x: string,
  avif2x: string,
  webp1x: string,
  webp2x: string,
  width = 1376,
  height = 768,
): CoverImageSet {
  return { avif1x, avif2x, webp1x, webp2x, width, height };
}

export function isCoverImageSet(value: string | CoverImageSet): value is CoverImageSet {
  return typeof value === 'object' && value !== null && 'webp1x' in value;
}
