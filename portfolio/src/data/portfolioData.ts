import { Project, ExperienceItem, SkillGroup, ScrollStoryFrame, BenchmarkStat, ServiceItem, WhyMeItem } from '../types';

export const PERSONAL_INFO = {
  name: 'Dmitry Bashkatov',
  nickname: 'dbaik',
  title: 'Senior WordPress & Shopify Developer',
  subtitle: 'From Figma to a fast, editable production site.',
  experienceSummary:
    'I help agencies and product teams turn approved designs into reliable WordPress and Shopify builds.',
  availability: 'Available for B2B and contract engagements. I usually reply within 24 hours.',
  trustLine: '15+ years shipping production websites · Agency & direct-client experience · WordPress · Shopify',
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

export const SERVICES: ServiceItem[] = [
  {
    title: 'Custom WordPress Development',
    description:
      'Figma-to-production builds, custom themes, Gutenberg and ACF, integrations, multilingual sites, WooCommerce, and maintainable editorial systems.',
  },
  {
    title: 'Shopify Storefront Development',
    description:
      'Custom Liquid themes, reusable sections, product and collection templates, variants, and specialized quote, request, or upload workflows.',
  },
  {
    title: 'Frontend & Performance Work',
    description:
      'Responsive implementation, Core Web Vitals, frontend cleanup, animation, technical SEO, analytics integration, and production stabilization.',
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'wwf-canada',
    slug: 'wwf-ca',
    title: 'WWF Canada',
    domain: 'wwf.ca',
    url: 'https://wwf.ca/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Global Conservation NGO',
    role: 'Frontend Developer',
    technologies: ['WordPress CMS', 'PHP', 'SCSS', 'JavaScript', 'Gutenberg', 'Figma', 'Accessibility'],
    description: 'Canada\'s largest international conservation organization website, featuring high-engagement campaign hubs, species at risk indexes, and bilingual donation architectures.',
    caseHeadline: 'Accessible WordPress architecture for content-heavy conservation campaigns',
    challenge:
      'Campaign, species, and conservation content needed a responsive frontend and reusable editorial system that could support accessibility and media-heavy pages.',
    contribution:
      'Owned the frontend for campaign hubs, species-at-risk indexes, and bilingual donation architectures within the WWF Canada WordPress platform.',
    outcome: 'Editors can create campaign and conservation pages using reusable Gutenberg blocks.',
    responsibilities: [
      'Engineered high-performance custom WordPress theme structure meeting WCAG AA accessibility standards.',
      'Built modular Gutenberg blocks for interactive habitat case studies and species conservation tracking.',
      'Optimized image pipelines and responsive media layouts across high-traffic donor campaign launches.'
    ],
    highlights: [
      { label: 'Focus', value: 'National conservation platform' },
      { label: 'Architecture', value: 'Accessible custom Gutenberg' }
    ],
    coverKey: 'wwf',
    featured: true,
    accentColor: '#10b981',
    metrics: { speedScore: 99, loadTime: '0.44s', traffic: 'National NGO' }
  },
  {
    id: 'mvp-visuals',
    slug: 'mvpvisuals-com',
    title: 'MVP Visuals',
    domain: 'mvpvisuals.com',
    url: 'https://mvpvisuals.com/',
    category: 'shopify',
    categoryLabel: 'Shopify · Custom Storefront',
    role: 'Shopify Developer',
    technologies: ['Shopify', 'Liquid', 'HTML', 'SCSS', 'JavaScript', 'jQuery', 'Figma'],
    description: 'Custom Shopify theme from Figma using Liquid; reusable sections, artwork uploads, variants, and quote flows.',
    caseHeadline: 'Custom Shopify storefront for personalized orders and artwork uploads',
    challenge:
      'The storefront needed customizable products, customer artwork uploads, variants, and quote requests without making routine merchandising depend on a developer.',
    contribution:
      'Owned the custom Shopify theme and storefront workflows for custom products, artwork uploads, and request-a-quote.',
    outcome:
      'Merchants can manage everyday merchandising in Shopify while custom-order and artwork-upload flows stay in the storefront.',
    responsibilities: [
      'Built a custom Shopify theme from Figma with Liquid, SCSS/CSS, and JavaScript.',
      'Set up reusable sections so storefront content could be updated without touching theme code.',
      'Added customer artwork uploads for selected custom products.',
      'Worked with collections, products, and variants across the custom-product catalog.',
      'Built contact and request-a-quote forms for custom orders and sales inquiries.'
    ],
    highlights: [
      { label: 'Focus', value: 'Artwork upload workflow' },
      { label: 'System', value: 'Request-a-quote flow' }
    ],
    coverKey: 'mvp',
    featured: true,
    accentColor: '#3b82f6',
    metrics: { speedScore: 98, loadTime: '0.52s', traffic: 'B2B Enterprise' }
  },
  {
    id: 'precision-approach-sports',
    slug: 'precisionapproachsports-com',
    title: 'Precision Approach Sports',
    domain: 'precisionapproachsports.com',
    url: 'https://precisionapproachsports.com/',
    category: 'wordpress',
    categoryLabel: 'WordPress · LiDAR Tech',
    role: 'WordPress Developer',
    technologies: ['WordPress CMS', 'PHP', 'SCSS', 'JavaScript', 'jQuery', 'Git', 'Figma'],
    description: 'Custom WordPress theme from Figma with Gutenberg blocks, animation, and performance work.',
    responsibilities: [
      'Turned the Figma design into a custom WordPress theme for the app\'s marketing site.',
      'Built reusable Gutenberg blocks so marketing content could be updated without touching code.',
      'Handled the site\'s contact flow and frontend validation.',
      'Optimized media-heavy pages and frontend performance.',
      'Kept the layouts responsive across desktop, tablet, and mobile.'
    ],
    highlights: [
      { label: 'Focus', value: 'LiDAR-focused product presentation' },
      { label: 'Content UX', value: 'Custom Gutenberg blocks' }
    ],
    coverKey: 'precision',
    featured: true,
    accentColor: '#06b6d4',
    metrics: { speedScore: 99, loadTime: '0.49s', traffic: 'Alpine Tech' }
  },
  {
    id: 'learn-with-mochi',
    slug: 'learnwithmochi-com',
    title: 'Learn with Mochi',
    domain: 'learnwithmochi.com',
    url: 'https://learnwithmochi.com/',
    category: 'shopify',
    categoryLabel: 'Shopify · EdTech Store',
    role: 'Shopify Developer',
    technologies: ['Shopify', 'Liquid', 'HTML', 'SCSS', 'JavaScript', 'jQuery', 'Figma'],
    description: 'Shopify e-commerce store for an award-winning screenless coding robot and computational learning books for young children.',
    responsibilities: [
      'Customized Shopify theme layouts with Liquid and frontend code.',
      'Turned supplied design layouts into responsive storefront pages.',
      'Used reusable theme sections to keep common storefront content editable in Shopify.',
      'Worked across product and collection pages on the storefront frontend.'
    ],
    highlights: [
      { label: 'Focus', value: 'Interactive storefront' },
      { label: 'Content UX', value: 'Merchant-managed theme sections' }
    ],
    coverKey: 'mochi',
    featured: false,
    accentColor: '#ec4899',
    metrics: { speedScore: 99, loadTime: '0.48s', traffic: 'Global EdTech' }
  },
  {
    id: 'bopper-media',
    slug: 'boppermedia-com',
    title: 'Bopper Media',
    domain: 'boppermedia.com',
    url: 'https://boppermedia.com/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Web3 Agency',
    role: 'WordPress Developer',
    technologies: ['WordPress CMS', 'PHP', 'SCSS', 'JavaScript', 'jQuery', 'Git', 'Figma'],
    description: 'Custom WordPress theme with Gutenberg, dark/light mode, animations, and micro-interactions.',
    caseHeadline: 'Custom WordPress frontend combining editorial control with interaction and motion',
    challenge:
      'The site required a distinctive responsive frontend with interactive details while remaining manageable inside WordPress.',
    contribution:
      'Owned the custom WordPress theme, reusable Gutenberg content structures, dark/light theme behavior, and motion implementation.',
    outcome:
      'Editors can update pages through reusable Gutenberg blocks while the branded frontend, theme switching, and motion stay in place.',
    responsibilities: [
      'Built the site as a custom WordPress theme from Figma.',
      'Set up reusable Gutenberg blocks for day-to-day content updates.',
      'Handled the site\'s contact forms and frontend validation.',
      'Kept the frontend responsive across devices and browsers.',
      'Built the animations and micro-interactions used throughout the site.',
      'Added the dark/light theme behavior across the site.',
      'Used Git for version-controlled development and updates.'
    ],
    highlights: [
      { label: 'Focus', value: 'Dark / light theme experience' },
      { label: 'Motion', value: 'Micro-interactions' }
    ],
    coverKey: 'bopper',
    featured: true,
    accentColor: '#a855f7',
    metrics: { speedScore: 99, loadTime: '0.42s', traffic: 'Web3 Branding' }
  },
  {
    id: 'the-energy-coalition',
    slug: 'energycoalition-org',
    title: 'The Energy Coalition',
    domain: 'energycoalition.org',
    url: 'https://energycoalition.org/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Energy Nonprofit',
    role: 'WordPress Developer',
    technologies: ['WordPress CMS', 'ACF', 'Polylang', 'Mailchimp', 'PHP', 'SCSS', 'JavaScript'],
    description: 'WordPress redesign using ACF, Polylang, Mailchimp, and responsive custom frontend development.',
    responsibilities: [
      'Rebuilt the site as a WordPress redesign with a responsive custom frontend.',
      'Used ACF for structured, editor-managed content.',
      'Set up Polylang for multilingual publishing.',
      'Connected Mailchimp for email and signup flows.'
    ],
    highlights: [
      { label: 'CMS', value: 'ACF + Polylang' },
      { label: 'Integrations', value: 'Mailchimp' }
    ],
    coverKey: 'energy',
    featured: true,
    accentColor: '#22c55e'
  },
  {
    id: '11-nil',
    slug: '11-nil-com',
    title: '11-nil',
    domain: '11-nil.com',
    url: 'https://11-nil.com/',
    category: 'shopify',
    categoryLabel: 'Shopify · Retail E-Commerce',
    role: 'Shopify Developer',
    technologies: ['Shopify', 'Liquid', 'HTML', 'SCSS', 'JavaScript', 'jQuery', 'Git', 'Figma'],
    description: 'Liquid theme templates, reusable sections/blocks, responsive product and collection pages.',
    responsibilities: [
      'Customized Shopify theme templates with Liquid and frontend code.',
      'Built reusable sections and blocks for merchant-managed storefront content.',
      'Worked on product and collection templates.',
      'Handled product variants and their storefront presentation.',
      'Turned Figma layouts into responsive Shopify storefront pages.'
    ],
    highlights: [
      { label: 'Focus', value: 'Merchant-managed sections' },
      { label: 'Merchandising', value: 'Product variants UX' }
    ],
    coverKey: 'eleven',
    featured: true,
    accentColor: '#6366f1',
    metrics: { speedScore: 99, loadTime: '0.46s', traffic: 'Direct Retail' }
  },
  {
    id: 'schoolhouse-moolah',
    slug: 'schoolhousemoolah-org',
    title: 'Schoolhouse Moolah',
    domain: 'schoolhousemoolah.org',
    url: 'https://schoolhousemoolah.org/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Education Platform',
    role: 'WordPress Developer',
    technologies: ['WordPress CMS', 'PHP', 'SCSS', 'JavaScript', 'jQuery', 'Git', 'Figma', 'MailChimp'],
    description: 'Marketing website for an educational classroom economy platform for teachers and students.',
    responsibilities: [
      'Built the site as a custom WordPress theme from Figma.',
      'Created reusable Gutenberg blocks for product and marketing content.',
      'Connected the contact form to Mailchimp.',
      'Kept the layouts responsive across desktop, tablet, and mobile.',
      'Handled frontend interactions across the marketing pages.',
      'Used Git for version-controlled development and production updates.'
    ],
    highlights: [
      { label: 'Focus', value: 'Mailchimp integration' },
      { label: 'Blocks', value: 'Reusable Gutenberg' }
    ],
    coverKey: 'schoolhouse',
    featured: false,
    accentColor: '#8b5cf6',
    metrics: { speedScore: 98, loadTime: '0.55s', traffic: 'K-12 Classrooms' }
  },
  {
    id: 'gaido',
    slug: 'gaido-ai',
    title: 'Gaido',
    domain: 'gaido.ai',
    url: 'https://gaido.ai/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Curated Travel Platform',
    role: 'Frontend Developer',
    technologies: ['WordPress CMS', 'PHP', 'SCSS', 'JavaScript', 'REST API', 'Figma'],
    description: 'Personalized travel guides and private tour booking platform curated by verified local insiders across global destinations.',
    responsibilities: [
      'Translated Figma specifications into responsive custom theme layouts with interactive city filters.',
      'Developed verified insider profile cards, tour recommendation carousels, and search interfaces.',
      'Maintained fast load times and fluid responsive behavior on mobile and desktop viewports.'
    ],
    highlights: [
      { label: 'Focus', value: 'Curated travel experience' },
      { label: 'Implementation', value: 'Figma to custom WordPress theme' }
    ],
    coverKey: 'gaido',
    featured: false,
    accentColor: '#38bdf8',
    metrics: { speedScore: 99, loadTime: '0.45s', traffic: 'Travel Tech' }
  },
  {
    id: 'krazy-coupon-lady',
    slug: 'thekrazycouponlady-com',
    title: 'The Krazy Coupon Lady',
    domain: 'thekrazycouponlady.com',
    url: 'https://thekrazycouponlady.com/',
    category: 'wordpress',
    categoryLabel: 'WordPress · High-Volume Portal',
    role: 'Frontend Developer',
    technologies: ['WordPress', 'PHP', 'SCSS', 'JavaScript', 'AJAX'],
    description: 'Leading digital publication and deal community reaching shoppers searching for daily discounts and retail savings.',
    responsibilities: [
      'Optimized front-end rendering pipeline for high-frequency deal updates and store-specific filters.',
      'Maintained layout stability while ingesting dynamic programmatic deals and affiliate widgets.'
    ],
    highlights: [
      { label: 'Focus', value: 'High-volume deal portal' },
      { label: 'Frontend', value: 'Dynamic AJAX filters' }
    ],
    featured: false,
    accentColor: '#84cc16',
    metrics: { speedScore: 97, loadTime: '0.50s', traffic: 'High Volume' }
  },
  {
    id: 'hi-consumption',
    slug: 'hiconsumption-com',
    title: 'HiConsumption',
    domain: 'hiconsumption.com',
    url: 'https://hiconsumption.com/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Digital Magazine',
    role: 'Frontend Developer',
    technologies: ['WordPress', 'PHP', 'SCSS', 'JavaScript', 'Infinite Scroll'],
    description: 'Premier digital lifestyle and gear magazine delivering daily curated editorial coverage of automotive, tech, and gear.',
    responsibilities: [
      'Developed high-density editorial grid layouts with optimized lazy loading for high-res product photos.',
      'Implemented high-efficiency infinite scroll pagination without memory leaks or scroll stutter.'
    ],
    highlights: [
      { label: 'Focus', value: 'Editorial grid and infinite scroll' },
      { label: 'Performance', value: 'Optimized image pipeline' }
    ],
    featured: false,
    accentColor: '#f97316',
    metrics: { speedScore: 98, loadTime: '0.48s', traffic: 'Digital Publication' }
  },
  {
    id: 'integrate-health',
    slug: 'integratehealth-org',
    title: 'Integrate Health',
    domain: 'integratehealth.org',
    url: 'http://integratehealth.org/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Global NGO',
    role: 'WordPress Developer',
    technologies: ['WordPress', 'PHP', 'SCSS', 'JavaScript', 'Gutenberg', 'Git'],
    description: 'International healthcare NGO delivering primary healthcare to underserved communities in West Africa.',
    responsibilities: [
      'Developed clean, highly accessible WordPress theme showcasing impact metrics, annual reports, and field clinics.',
      'Created custom reusable blocks for data visualizations, donor spotlights, and field stories.'
    ],
    highlights: [
      { label: 'Focus', value: 'Accessible global NGO platform' },
      { label: 'Blocks', value: 'Custom data visualizations' }
    ],
    featured: false,
    accentColor: '#059669',
    metrics: { speedScore: 99, loadTime: '0.47s', traffic: 'Global NGO' }
  },
  {
    id: 'fed-and-fit',
    slug: 'fedandfit-com',
    title: 'Fed & Fit',
    domain: 'fedandfit.com',
    url: 'https://fedandfit.com/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Culinary Platform',
    role: 'Frontend Developer',
    technologies: ['WordPress', 'PHP', 'SCSS', 'JavaScript', 'Schema.org', 'Figma'],
    description: 'Premier culinary and wellness platform featuring thousands of tested recipes, meal planners, and nutrition guides.',
    responsibilities: [
      'Engineered interactive recipe cards with unit converters (Imperial/Metric), dynamic serving multipliers, and print layouts.',
      'Implemented full Schema.org recipe microdata for high-ranking Google rich recipe snippets.'
    ],
    highlights: [
      { label: 'Focus', value: 'Recipe platform and Schema.org microdata' },
      { label: 'Feature', value: 'Dynamic ingredient scaler' }
    ],
    featured: false,
    accentColor: '#f43f5e',
    metrics: { speedScore: 98, loadTime: '0.50s', traffic: 'Culinary Hub' }
  },
  {
    id: 'an-appetizing-life',
    slug: 'anappetizinglife-com',
    title: 'An Appetizing Life',
    domain: 'anappetizinglife.com',
    url: 'https://anappetizinglife.com/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Lifestyle Blog',
    role: 'WordPress Developer',
    technologies: ['WordPress', 'PHP', 'SCSS', 'JavaScript', 'Figma'],
    description: 'High-end food and lifestyle destination with bespoke editorial layout templates, custom typography, and recipe collections.',
    responsibilities: [
      'Built custom responsive theme matching editorial design requirements from Figma.',
      'Created modular Gutenberg blocks for rich culinary stories and lifestyle photography.'
    ],
    highlights: [
      { label: 'Focus', value: 'Editorial typography and custom layout' },
      { label: 'Theme', value: 'Bespoke custom theme' }
    ],
    featured: false,
    accentColor: '#fbbf24',
    metrics: { speedScore: 98, loadTime: '0.49s', traffic: 'Lifestyle & Food' }
  },
  {
    id: 'alpha-facilities',
    slug: 'alphafacilities-com',
    title: 'Alpha Facilities',
    domain: 'alphafacilities.com',
    url: 'https://www.alphafacilities.com/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Enterprise B2B',
    role: 'Frontend Developer',
    technologies: ['WordPress', 'PHP', 'SCSS', 'JavaScript', 'Git'],
    description: 'Corporate platform for facilities management and capital planning software solutions.',
    responsibilities: [
      'Engineered responsive enterprise website from design specifications.',
      'Implemented multi-step corporate inquiry forms and service matrix showcases.'
    ],
    highlights: [
      { label: 'Focus', value: 'Enterprise solution matrix' },
      { label: 'Lead Flow', value: 'Multi-step RFQ system' }
    ],
    featured: false,
    accentColor: '#38bdf8',
    metrics: { speedScore: 99, loadTime: '0.44s', traffic: 'B2B Enterprise' }
  },
  {
    id: 'cal-drywall',
    slug: 'caldrywall-com',
    title: 'Cal Drywall',
    domain: 'caldrywall.com',
    url: 'https://www.caldrywall.com/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Commercial Construction',
    role: 'WordPress Developer',
    technologies: ['WordPress', 'PHP', 'SCSS', 'JavaScript', 'Gutenberg'],
    description: 'Commercial drywall and construction leader showcasing flagship architectural portfolios and project bidding specs.',
    responsibilities: [
      'Developed custom project showcase gallery with dynamic filtering by commercial sector.',
      'Structured Gutenberg layout blocks for rapid ongoing case study publishing.'
    ],
    highlights: [
      { label: 'Focus', value: 'Filtered commercial portfolio' },
      { label: 'CMS', value: 'Bespoke Gutenberg case studies' }
    ],
    featured: false,
    accentColor: '#f97316',
    metrics: { speedScore: 98, loadTime: '0.48s', traffic: 'Commercial B2B' }
  },
  {
    id: 'lil-sucker',
    slug: 'lilsucker-com',
    title: 'Lil Sucker',
    domain: 'lilsucker.com',
    url: 'https://lilsucker.com/',
    category: 'shopify',
    categoryLabel: 'Shopify · D2C Brand',
    role: 'Shopify Developer',
    technologies: ['Shopify', 'Liquid', 'SCSS', 'JavaScript', 'Figma'],
    description: 'Innovative drinkware accessory and outdoor suction sleeve brand with direct-to-consumer storefront.',
    responsibilities: [
      'Customized Shopify Liquid sections for product displays and bundle configurations.',
      'Optimized mobile checkout funnel and integrated marketing automations.'
    ],
    highlights: [
      { label: 'Focus', value: 'D2C product bundles and checkout flow' },
      { label: 'E-Commerce', value: 'Shopify Liquid sections' }
    ],
    featured: false,
    accentColor: '#06b6d4',
    metrics: { speedScore: 99, loadTime: '0.43s', traffic: 'D2C Retail' }
  },
  {
    id: 'return-to-freedom',
    slug: 'returntofreedom-org',
    title: 'Return to Freedom',
    domain: 'returntofreedom.org',
    url: 'https://returntofreedom.org/',
    category: 'wordpress',
    categoryLabel: 'WordPress · Wild Horse Sanctuary',
    role: 'WordPress Developer',
    technologies: ['WordPress', 'PHP', 'SCSS', 'JavaScript', 'Donations'],
    description: 'National wild horse sanctuary non-profit advocating for wildlife preservation, sanctuary tours, and donor campaigns.',
    responsibilities: [
      'Built custom responsive theme showcasing horse sponsorship programs and sanctuary visit bookings.',
      'Integrated secure donation and sponsorship processing flows.'
    ],
    highlights: [
      { label: 'Focus', value: 'Sponsorship and donation platform' },
      { label: 'Donations', value: 'Integrated donor flows' }
    ],
    featured: false,
    accentColor: '#10b981',
    metrics: { speedScore: 98, loadTime: '0.49s', traffic: 'Non-Profit NGO' }
  }
];

export const FEATURED_PROJECT_IDS = [
  'mvp-visuals',
  'wwf-canada',
  'bopper-media',
] as const;

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

export const BENCHMARK_DATA: BenchmarkStat[] = [
  {
    metric: 'Core Web Vitals',
    standardTheme: 'Sluggish (40-60 score)',
    dmitryArchitecture: '98-100 / 100 Optimized',
    unit: 'Score',
    difference: 'Green Vitals',
    winner: 'dmitry'
  },
  {
    metric: 'Largest Contentful Paint (LCP)',
    standardTheme: '3.5s+ (Delayed)',
    dmitryArchitecture: 'Fast & Optimized',
    unit: 'Seconds',
    difference: 'Quick Render',
    winner: 'dmitry'
  },
  {
    metric: 'Cumulative Layout Shift (CLS)',
    standardTheme: '0.25+ (Jumpy Content)',
    dmitryArchitecture: '0.00 (Stable Layout)',
    unit: 'Score',
    difference: 'Layout Stability',
    winner: 'dmitry'
  },
  {
    metric: 'Content Editing Experience',
    standardTheme: 'Requires developer for text/images',
    dmitryArchitecture: 'Editor / Merchant Managed',
    unit: 'Control',
    difference: 'No Code Needed',
    winner: 'dmitry'
  }
];

export const SCROLL_STORY_FRAMES: ScrollStoryFrame[] = [
  {
    id: 1,
    stageNumber: '01 / BLUEPRINT',
    title: 'Figma → Responsive Frontend',
    subtitle: 'Responsive layout grid',
    tagline: 'Deconstructing design tokens into clean semantic architecture',
    description: 'Every interface begins by translating Figma designs into structured frontend systems: responsive layout grids, fluid typography variables, semantic layout hierarchies, and accessible spacing rules.',
    keyPoints: [
      'Responsive Grid & Flexbox layout systems',
      'Semantic HTML5 structure (<main>, <article>, <section>)',
      'Consistent typography scales & proportional spacing'
    ],
    technologies: ['Responsive layout grid', 'Design Tokens', 'Fluid Typography', 'Accessible structure'],
    qualitativeStatus: [
      { label: 'Layout Grid', badge: 'Responsive Grid' },
      { label: 'Typography', badge: 'Fluid Scale' },
      { label: 'Accessibility', badge: 'Accessible structure' }
    ]
  },
  {
    id: 2,
    stageNumber: '02 / ARCHITECTURE',
    title: 'Gutenberg & Shopify Blocks',
    subtitle: 'Reusable Gutenberg & Shopify sections',
    tagline: 'Custom blocks built once, reused everywhere, designed for routine updates',
    description: 'Transforming design regions into reusable Gutenberg blocks and Shopify Liquid sections with structured schema controls, preview states, and clean markup. Designed for routine content updates without developer support.',
    keyPoints: [
      'Reusable Gutenberg blocks with React edit & save components',
      'Shopify Liquid sections with modular schema controls',
      'Clean markup output without bloated page builder overhead'
    ],
    technologies: ['Reusable Gutenberg blocks', 'Shopify Liquid sections', 'React (Edit UI)', 'Clean Schema'],
    qualitativeStatus: [
      { label: 'Modularity', badge: 'Reusable Blocks' },
      { label: 'Content Editing', badge: 'Routine Updates' },
      { label: 'Dependencies', badge: 'Zero Page Builders' }
    ]
  },
  {
    id: 3,
    stageNumber: '03 / MOTION & PERFORMANCE',
    title: 'GSAP & ScrollTrigger',
    subtitle: 'Purposeful motion & fluid interaction',
    tagline: 'Controlled transitions and micro-interactions that enhance UX',
    description: 'Implementing purposeful motion pipelines using GSAP & ScrollTrigger: layout-safe transforms (transform, opacity), scroll progress triggers, and fluid micro-interactions.',
    keyPoints: [
      'Hardware-friendly transforms (translateY, opacity, scale)',
      'GSAP & ScrollTrigger synchronization with user scroll',
      'prefers-reduced-motion support'
    ],
    technologies: ['GSAP & ScrollTrigger', 'Purposeful motion', 'CSS Transitions', 'prefers-reduced-motion'],
    qualitativeStatus: [
      { label: 'Motion Engine', badge: 'GSAP & ScrollTrigger' },
      { label: 'Layout Safety', badge: 'Purposeful motion' },
      { label: 'Accessibility', badge: 'prefers-reduced-motion' }
    ]
  },
  {
    id: 4,
    stageNumber: '04 / PRODUCTION',
    title: 'Performance & Core Web Vitals',
    subtitle: 'Production workflow & delivery',
    tagline: 'High-performance websites built for reliability, speed, and real users',
    description: 'Final assembly into a cohesive, high-performing website: optimized responsive assets, deferred non-blocking resources, layout stability, and structured cross-browser QA.',
    keyPoints: [
      'Performance & Core Web Vitals with layout stability',
      'Git-based development and deployment workflows',
      'Cross-browser QA and responsive device verification'
    ],
    technologies: ['Performance & Core Web Vitals', 'Layout stability', 'Responsive assets', 'Production workflow'],
    qualitativeStatus: [
      { label: 'Stability', badge: 'Layout stability' },
      { label: 'Assets', badge: 'Responsive assets' },
      { label: 'Delivery', badge: 'Production workflow' }
    ]
  }
];
