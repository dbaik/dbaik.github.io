import { ExperienceItem } from '../types';

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'valant-current',
    company: 'Valant',
    url: 'https://valant.com',
    role: 'Web / Frontend Developer',
    period: 'May 2017 – Present',
    durationYears: '',
    location: 'Contract',
    current: true,
    description: 'Independent contractor across long-term client engagements, including an embedded assignment with Goji Labs.',
    highlights: [
      'Custom WordPress themes and Shopify storefronts from Figma to production',
      'Gutenberg/ACF, Liquid, responsive frontend, performance, and technical SEO',
      'Analytics and AI-assisted workflows across client work'
    ],
    technologies: ['WordPress', 'Gutenberg', 'ACF', 'Shopify Liquid', 'PHP', 'SCSS', 'JavaScript', 'Git']
  },
  {
    id: 'goji-labs',
    company: 'Goji Labs',
    url: 'https://gojilabs.com',
    role: 'WordPress Developer (via Valant)',
    period: 'August 2019 – Present',
    durationYears: '',
    location: 'Client Assignment',
    current: true,
    description: 'Embedded WordPress developer within the client team, delivering custom themes, Gutenberg/ACF, frontend development, integrations, performance, and SEO.',
    highlights: [
      'Custom WordPress themes and Gutenberg/ACF builds inside the client team',
      'Frontend development, integrations, performance, and SEO'
    ],
    technologies: ['WordPress', 'Gutenberg', 'ACF', 'PHP', 'SCSS', 'JavaScript', 'Git']
  },
  {
    id: 'webdevs',
    company: 'WebDevs',
    role: 'Frontend Developer',
    period: 'January 2014 – May 2017',
    durationYears: '',
    location: 'Agency',
    current: false,
    description: 'Frontend development across WordPress, HTML5/CSS3, JavaScript, jQuery, and AJAX. Converting complex mockups into responsive, cross-browser web interfaces.',
    highlights: [
      'Turned Figma and PSD layouts into responsive, semantic HTML5/CSS3 and WordPress templates',
      'Built interactive frontend components and AJAX-driven data filtering mechanisms',
      'Ensured cross-browser consistency across mobile, tablet, and desktop devices'
    ],
    technologies: ['WordPress CMS', 'HTML5/CSS3', 'SCSS/Sass', 'JavaScript', 'jQuery', 'AJAX', 'Git']
  },
  {
    id: 'w3-edge',
    company: 'W3 EDGE',
    role: 'UI/UX Engineer',
    period: 'October 2011 – January 2014',
    durationYears: '',
    location: 'Agency',
    current: false,
    description: 'UI/UX engineering and performance frontend development. Delivering lightweight, accessible markup and modular CSS.',
    highlights: [
      'Web performance optimization, asset minification, and clean frontend architecture',
      'Built modular CSS architectures adhering to BEM and SMACSS standards'
    ],
    technologies: ['Performance Optimization', 'HTML5/CSS3', 'JavaScript', 'PHP', 'SMACSS', 'BEM']
  },
  {
    id: 'valant-early',
    company: 'Valant',
    role: 'HTML/WP-coder',
    period: 'October 2011 – January 2014',
    durationYears: '',
    location: 'Agency',
    current: false,
    description: 'HTML/CSS slicing, responsive layout development, and custom WordPress theme integration.',
    highlights: [
      'Constructed responsive HTML/CSS templates from supplied design mockups',
      'Integrated templates into custom WordPress themes and content structures'
    ],
    technologies: ['WordPress', 'HTML5/CSS3', 'PHP', 'JavaScript', 'Cross-browser Testing']
  },
  {
    id: 'freelance-coder',
    company: 'Freelance',
    role: 'HTML/WP-coder',
    period: 'July 2011 – October 2011',
    durationYears: '',
    location: 'Freelance',
    current: false,
    description: 'Contract frontend coding and WordPress integration for international clients.',
    highlights: [
      'Delivered responsive web pages and custom WordPress blog/business themes on tight deadlines'
    ],
    technologies: ['HTML5', 'CSS3', 'PHP', 'WordPress', 'JavaScript']
  },
  {
    id: 'ronis-bt',
    company: 'Ronis BT',
    role: 'HTML/WP-coder',
    period: 'October 2009 – July 2011',
    durationYears: '',
    location: 'In-House',
    current: false,
    description: 'Frontend markup coding, CSS styling, and WordPress theme development.',
    highlights: [
      'Semantic markup and cross-browser CSS solutions for commercial sites'
    ],
    technologies: ['HTML', 'CSS', 'PHP', 'WordPress', 'MySQL', 'Photoshop']
  }
];
