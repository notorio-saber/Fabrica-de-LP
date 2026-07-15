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
