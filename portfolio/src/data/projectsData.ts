import { Project } from '../types';

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
    description: 'Canada\'s largest international conservation organization website, featuring campaign and conservation content, species at risk indexes, and bilingual donation architectures.',
    caseHeadline: 'Accessible WordPress architecture for content-heavy conservation campaigns',
    challenge:
      'Campaign, species, and conservation content needed a responsive frontend and reusable editorial system that could support accessibility and media-heavy pages.',
    contribution:
      'Owned the frontend for campaign hubs, species-at-risk indexes, and bilingual donation architectures within the WWF Canada WordPress platform.',
    outcome: 'Editors can create campaign and conservation pages using reusable Gutenberg blocks.',
    responsibilities: [
      'Engineered a custom WordPress theme structure with accessibility-focused implementation.',
      'Built modular Gutenberg blocks for interactive habitat case studies and species conservation tracking.',
      'Optimized image pipelines and responsive media layouts across donor campaign launches.'
    ],
    caseBadges: ['WordPress', 'Gutenberg', 'Accessibility'],
    highlights: [
      { label: 'Focus', value: 'National conservation platform' },
      { label: 'Architecture', value: 'Accessible custom Gutenberg' }
    ],
    coverKey: 'wwf',
    featured: true,
    accentColor: '#10b981',
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
    caseBadges: ['Shopify', 'Liquid', 'Custom Order Workflow'],
    accentColor: '#3b82f6',
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
    caseBadges: ['WordPress', 'Gutenberg', 'Motion'],
    accentColor: '#a855f7',
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
  }
];

export const FEATURED_PROJECT_IDS = [
  'mvp-visuals',
  'wwf-canada',
  'bopper-media',
] as const;
