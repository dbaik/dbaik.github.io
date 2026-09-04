import { ServiceItem } from '../types';

export const SERVICES: ServiceItem[] = [
  {
    title: 'Custom WordPress Development',
    description:
      'Figma-to-production builds, custom themes, Gutenberg and ACF, integrations, multilingual sites, WooCommerce, and maintainable editorial systems.',
    deliverables: [
      'Figma → production',
      'Custom Gutenberg / ACF blocks',
      'Multilingual',
      'WooCommerce / integrations',
    ],
    ctaLabel: 'Discuss a WordPress project',
    projectType: 'WordPress development',
  },
  {
    title: 'Shopify Storefront Development',
    description:
      'Custom Liquid themes, reusable sections, product and collection templates, variants, and specialized quote, request, or upload workflows.',
    deliverables: [
      'Custom Liquid themes',
      'Reusable sections and schema',
      'Product / collection templates',
      'Custom quote / upload / product workflows',
    ],
    ctaLabel: 'Discuss a Shopify project',
    projectType: 'Shopify development',
  },
  {
    title: 'Frontend & Performance Work',
    description:
      'Responsive implementation, Core Web Vitals, frontend cleanup, animation, technical SEO, analytics integration, and production stabilization.',
    deliverables: [
      'Responsive frontend',
      'Core Web Vitals optimization',
      'Accessibility-focused frontend',
      'Technical SEO / analytics',
    ],
    ctaLabel: 'Discuss a frontend project',
    projectType: 'Frontend / performance',
  },
];
