import { SkillGroup, WhyMeItem } from '../types';
export { SERVICES } from './servicesData';
export { PROJECTS_DATA, FEATURED_PROJECT_IDS } from './projectsData';
export { EXPERIENCE_DATA } from './experienceData';

export const PERSONAL_INFO = {
  name: 'Dmitry Bashkatov',
  nickname: 'dbaik',
  title: 'Senior WordPress & Shopify Developer',
  subtitle: 'From Figma to a fast, editable production site.',
  experienceSummary:
    'I help agencies and product teams turn approved designs into reliable WordPress and Shopify builds.',
  availability: 'Available for B2B and contract engagements. I usually reply within 24 hours.',
  trustLine: '15+ years shipping production websites · Agency & direct-client delivery · Custom WordPress & Shopify development',
  replyNote: 'I usually reply within 24 hours.',
  whyMeIntro: 'Built for everyone who has to use the site after launch.',
  whyMe: [
    {
      audience: 'For designers',
      statement: 'The production frontend stays faithful to the intended layouts and interaction system.',
    },
    {
      audience: 'For content teams',
      statement: 'Routine updates can happen through reusable CMS or storefront components instead of developer tickets.',
    },
    {
      audience: 'For developers',
      statement: 'The project is handed over as maintainable production code rather than a fragile collection of one-off fixes.',
    },
    {
      audience: 'For the business',
      statement: 'The result is a site that can keep evolving after launch.',
    },
  ] satisfies WhyMeItem[],
  email: 'dbashkatoff@gmail.com',
  github: 'https://github.com/dbaik',
  linkedin: 'https://www.linkedin.com/in/dbashkatoff/',
  telegram: 'https://t.me/dbaik',
  telegramHandle: '@dbaik',
  experienceYears: 15,
  howIWork: [
    {
      number: '01',
      title: 'High-fidelity frontend',
      subtitle: 'The implementation should stay true to the design',
      description: 'I translate supplied designs into responsive frontend layouts with close attention to spacing, typography, component structure, and breakpoint behavior.'
    },
    {
      number: '02',
      title: 'Editable by teams',
      subtitle: "Editors and merchants shouldn't need a developer for routine content changes",
      description: 'I build modular Gutenberg blocks and Shopify Liquid sections so content teams can handle routine updates without developer support.'
    },
    {
      number: '03',
      title: 'Fast & maintainable',
      subtitle: "Custom functionality and motion shouldn't come at the expense of performance or maintainability",
      description: 'I build motion and custom functionality with performance, layout stability, Core Web Vitals, and maintainability in mind.'
    }
  ],
  coreCompetencies: [
    'Figma → production: custom WordPress themes and Shopify storefronts.',
    'WordPress: custom themes, Gutenberg, ACF, Elementor, Polylang, WPML, WooCommerce.',
    'Shopify: Liquid, custom themes, reusable sections and blocks, products, collections, and variants.',
    'Frontend: HTML/CSS, JavaScript, jQuery, AJAX, SCSS/Sass, Tailwind CSS, PHP.',
    'Performance & SEO: Core Web Vitals, semantic HTML, technical/on-page SEO, AI-search visibility.',
    'Analytics & AI: GA4, GTM, Meta Pixel; ChatGPT, OpenAI Codex, AI-assisted development, research, documentation, image/video production.'
  ],
  languages: [
    { name: 'Russian', level: '' },
    { name: 'Ukrainian', level: '' },
    { name: 'English', level: 'Working proficiency; strong reading/writing, basic spoken communication' }
  ],
  education: [
    {
      institution: 'Regional Center of New Information Technologies',
      degree: 'Web Design Certificate',
      period: '2009'
    },
    {
      institution: 'State Technology University',
      degree: 'Mechanical Engineer',
      period: '2002–2007'
    }
  ]
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'WordPress',
    iconName: 'Layout',
    skills: [
      { name: 'Custom themes', level: 99, highlight: true },
      { name: 'Gutenberg', level: 99, highlight: true },
      { name: 'ACF', level: 98, highlight: true },
      { name: 'Elementor', level: 94, highlight: false },
      { name: 'Polylang', level: 95, highlight: true },
      { name: 'WPML', level: 94, highlight: true },
      { name: 'WooCommerce', level: 93, highlight: false }
    ]
  },
  {
    category: 'Shopify',
    iconName: 'Layout',
    skills: [
      { name: 'Liquid', level: 98, highlight: true },
      { name: 'Custom themes', level: 98, highlight: true },
      { name: 'Sections / blocks', level: 98, highlight: true },
      { name: 'Products, collections, variants', level: 97, highlight: true }
    ]
  },
  {
    category: 'Other platforms',
    iconName: 'Layout',
    skills: [
      { name: 'Webflow', level: 90, highlight: false },
      { name: 'Magento', level: 86, highlight: false },
      { name: 'Drupal', level: 86, highlight: false }
    ]
  },
  {
    category: 'Frontend',
    iconName: 'Code2',
    skills: [
      { name: 'HTML/CSS', level: 100, highlight: true },
      { name: 'JavaScript', level: 98, highlight: true },
      { name: 'TypeScript', level: 90, highlight: true },
      { name: 'React & Next.js', level: 92, highlight: true },
      { name: 'jQuery', level: 95, highlight: false },
      { name: 'AJAX', level: 95, highlight: false },
      { name: 'SCSS/Sass', level: 99, highlight: true },
      { name: 'Tailwind CSS', level: 96, highlight: true },
      { name: 'PHP', level: 95, highlight: true }
    ]
  },
  {
    category: 'Performance & SEO',
    iconName: 'Zap',
    skills: [
      { name: 'Core Web Vitals', level: 98, highlight: true },
      { name: 'Semantic HTML', level: 99, highlight: true },
      { name: 'Technical / on-page SEO', level: 94, highlight: true },
      { name: 'AI-search visibility', level: 90, highlight: false }
    ]
  },
  {
    category: 'Analytics & AI',
    iconName: 'Server',
    skills: [
      { name: 'GA4', level: 92, highlight: true },
      { name: 'GTM', level: 92, highlight: true },
      { name: 'Meta Pixel', level: 90, highlight: false },
      { name: 'ChatGPT / OpenAI Codex', level: 94, highlight: true },
      { name: 'AI-assisted development', level: 94, highlight: true }
    ]
  },
  {
    category: 'Tools',
    iconName: 'Figma',
    skills: [
      { name: 'Git / GitHub / Bitbucket', level: 98, highlight: true },
      { name: 'Figma', level: 99, highlight: true },
      { name: 'GSAP / ScrollTrigger', level: 96, highlight: true },
      { name: 'Anime.js / AOS', level: 90, highlight: false },
      { name: 'Webpack / Vite / Gulp', level: 96, highlight: true }
    ]
  }
];
