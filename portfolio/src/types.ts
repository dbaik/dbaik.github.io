import { CoverImageSlug } from './types/coverImage';

export type { CoverImageSet, CoverImageSlug } from './types/coverImage';

export interface Project {
  id: string;
  slug: string;
  title: string;
  domain: string;
  url: string;
  category: 'wordpress' | 'shopify' | 'react-next' | 'saas' | 'all';
  categoryLabel: string;
  role: string;
  period?: string;
  technologies: string[];
  description: string;
  caseHeadline?: string;
  challenge?: string;
  contribution?: string;
  outcome?: string;
  responsibilities: string[];
  highlights: {
    label: string;
    value: string;
  }[];
  coverKey?: CoverImageSlug;
  featured: boolean;
  metrics?: {
    speedScore?: number;
    loadTime?: string;
    traffic?: string;
  };
  accentColor?: string;
  codeSnippet?: {
    title: string;
    language: string;
    code: string;
  };
}

export interface ExperienceItem {
  id: string;
  company: string;
  url?: string;
  role: string;
  period: string;
  durationYears?: string;
  description: string;
  highlights: string[];
  technologies: string[];
  location?: string;
  current?: boolean;
}

export interface SkillGroup {
  category: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 1-100
    highlight?: boolean;
    tag?: string;
  }[];
}

export interface ScrollStoryFrame {
  id: number;
  stageNumber: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  keyPoints: string[];
  technologies: string[];
  qualitativeStatus: {
    label: string;
    badge: string;
  }[];
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface WhyMeItem {
  audience: string;
  statement: string;
}

export interface BenchmarkStat {
  metric: string;
  standardTheme: string;
  dmitryArchitecture: string;
  unit: string;
  difference: string;
  winner: 'dmitry' | 'neutral';
}
