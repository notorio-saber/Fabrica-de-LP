export interface LandingPagePermissions {
  allowAffiliateNameEdit: boolean;
  allowProfileImageEdit: boolean;
  allowWhatsAppUrlEdit: boolean;
  allowPixelEdit: boolean;
  allowThemeEdit: boolean;
  allowHeadlineEdit: boolean;
  allowSubheadlineEdit: boolean;
  allowButtonTextEdit: boolean;
}

export interface LandingPageRecord {
  slug: string;
  ownerUid: string;
  status: 'active' | 'inactive';
  affiliateName: string;
  profileImageUrl: string | null;
  whatsappUrl: string;
  pixelId: string | null;
  themeId: string;
  headline: string | null;
  subheadline: string | null;
  buttonText: string | null;
  permissions: LandingPagePermissions;
  sections?: SectionsConfig;
}

export const defaultLandingPagePermissions: LandingPagePermissions = {
  allowAffiliateNameEdit: true,
  allowProfileImageEdit: true,
  allowWhatsAppUrlEdit: true,
  allowPixelEdit: true,
  allowThemeEdit: true,
  allowHeadlineEdit: false,
  allowSubheadlineEdit: false,
  allowButtonTextEdit: false,
};

export type SectionType =
  | 'hero'
  | 'profile'
  | 'handles'
  | 'offer'
  | 'whatsappButton'
  | 'marketplaceLogos'
  | 'benefits'
  | 'brandsCarousel'
  | 'footer'
  | 'joinPopupToast'
  | 'imageCarousel'
  | 'ctaButton'
  | 'promoModal';

/** Section types that render as fixed/overlay elements — their position in `order` has no visual effect, only `enabled` matters. */
export const OVERLAY_SECTION_TYPES: SectionType[] = ['joinPopupToast', 'promoModal'];

export interface ImageCarouselConfig {
  images: { url: string; alt?: string }[];
}

export interface CtaButtonConfig {
  label: string;
  url: string;
  pixelEventName?: string;
}

export interface PromoModalConfig {
  title: string;
  body: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  delaySeconds: number;
}

export interface SectionsConfig {
  order: SectionType[];
  enabled: Partial<Record<SectionType, boolean>>;
  imageCarousel?: ImageCarouselConfig;
  ctaButton?: CtaButtonConfig;
  promoModal?: PromoModalConfig;
}

export const defaultSectionsConfig: SectionsConfig = {
  order: [
    'hero',
    'profile',
    'handles',
    'offer',
    'whatsappButton',
    'marketplaceLogos',
    'benefits',
    'brandsCarousel',
    'footer',
    'joinPopupToast',
    'imageCarousel',
    'ctaButton',
    'promoModal',
  ],
  enabled: {
    hero: true,
    profile: true,
    handles: true,
    offer: true,
    whatsappButton: true,
    marketplaceLogos: true,
    benefits: true,
    brandsCarousel: true,
    footer: true,
    joinPopupToast: true,
    imageCarousel: false,
    ctaButton: false,
    promoModal: false,
  },
  imageCarousel: { images: [] },
  ctaButton: { label: '', url: '' },
  promoModal: { title: '', body: '', delaySeconds: 5 },
};

/**
 * Fills in gaps for docs written before `sections` existed (or before a given
 * section type was added), the same fallback pattern as
 * `defaultLandingPagePermissions` — no backend migration needed.
 */
export function resolveSectionsConfig(sections: SectionsConfig | undefined): SectionsConfig {
  const base = sections ?? defaultSectionsConfig;
  const missingTypes = defaultSectionsConfig.order.filter((type) => !base.order.includes(type));
  return {
    order: [...base.order, ...missingTypes],
    enabled: { ...defaultSectionsConfig.enabled, ...base.enabled },
    imageCarousel: base.imageCarousel ?? defaultSectionsConfig.imageCarousel,
    ctaButton: base.ctaButton ?? defaultSectionsConfig.ctaButton,
    promoModal: base.promoModal ?? defaultSectionsConfig.promoModal,
  };
}
