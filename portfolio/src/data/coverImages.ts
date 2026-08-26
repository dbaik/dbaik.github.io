import { coverImage } from '../types/coverImage';

import wwfAvif from '../assets/images/covers/wwf.avif';
import wwfAvif2x from '../assets/images/covers/wwf@2x.avif';
import wwfWebp from '../assets/images/covers/wwf.webp';
import wwfWebp2x from '../assets/images/covers/wwf@2x.webp';

import mvpAvif from '../assets/images/covers/mvp.avif';
import mvpAvif2x from '../assets/images/covers/mvp@2x.avif';
import mvpWebp from '../assets/images/covers/mvp.webp';
import mvpWebp2x from '../assets/images/covers/mvp@2x.webp';

import precisionAvif from '../assets/images/covers/precision.avif';
import precisionAvif2x from '../assets/images/covers/precision@2x.avif';
import precisionWebp from '../assets/images/covers/precision.webp';
import precisionWebp2x from '../assets/images/covers/precision@2x.webp';

import mochiAvif from '../assets/images/covers/mochi.avif';
import mochiAvif2x from '../assets/images/covers/mochi@2x.avif';
import mochiWebp from '../assets/images/covers/mochi.webp';
import mochiWebp2x from '../assets/images/covers/mochi@2x.webp';

import bopperAvif from '../assets/images/covers/bopper.avif';
import bopperAvif2x from '../assets/images/covers/bopper@2x.avif';
import bopperWebp from '../assets/images/covers/bopper.webp';
import bopperWebp2x from '../assets/images/covers/bopper@2x.webp';

import elevenAvif from '../assets/images/covers/eleven.avif';
import elevenAvif2x from '../assets/images/covers/eleven@2x.avif';
import elevenWebp from '../assets/images/covers/eleven.webp';
import elevenWebp2x from '../assets/images/covers/eleven@2x.webp';

import schoolhouseAvif from '../assets/images/covers/schoolhouse.avif';
import schoolhouseAvif2x from '../assets/images/covers/schoolhouse@2x.avif';
import schoolhouseWebp from '../assets/images/covers/schoolhouse.webp';
import schoolhouseWebp2x from '../assets/images/covers/schoolhouse@2x.webp';

import gaidoAvif from '../assets/images/covers/gaido.avif';
import gaidoAvif2x from '../assets/images/covers/gaido@2x.avif';
import gaidoWebp from '../assets/images/covers/gaido.webp';
import gaidoWebp2x from '../assets/images/covers/gaido@2x.webp';

export const COVER_IMAGES = {
  wwf: coverImage(wwfAvif, wwfAvif2x, wwfWebp, wwfWebp2x),
  mvp: coverImage(mvpAvif, mvpAvif2x, mvpWebp, mvpWebp2x),
  precision: coverImage(precisionAvif, precisionAvif2x, precisionWebp, precisionWebp2x),
  mochi: coverImage(mochiAvif, mochiAvif2x, mochiWebp, mochiWebp2x),
  bopper: coverImage(bopperAvif, bopperAvif2x, bopperWebp, bopperWebp2x),
  eleven: coverImage(elevenAvif, elevenAvif2x, elevenWebp, elevenWebp2x),
  schoolhouse: coverImage(schoolhouseAvif, schoolhouseAvif2x, schoolhouseWebp, schoolhouseWebp2x),
  gaido: coverImage(gaidoAvif, gaidoAvif2x, gaidoWebp, gaidoWebp2x, 1376, 880),
};
