import type { CSSProperties, ReactNode } from 'react';
import { LandingHero } from '../components/LandingHero';
import { AffiliateProfile } from '../components/AffiliateProfile';
import { HandlesMarquee } from '../components/HandlesMarquee';
import { OfferSection } from '../components/OfferSection';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { MarketplaceLogos } from '../components/MarketplaceLogos';
import { BenefitsSection } from '../components/BenefitsSection';
import { BrandsCarousel } from '../components/BrandsCarousel';
import { LandingFooter } from '../components/LandingFooter';
import { JoinPopupToast } from '../components/JoinPopupToast';
import { ImageCarousel } from '../components/ImageCarousel';
import { CtaButton } from '../components/CtaButton';
import { PromoModal } from '../components/PromoModal';
import { defaultLandingTheme, type LandingTheme } from '../themes/landingThemes';
import {
  resolveSectionsConfig,
  OVERLAY_SECTION_TYPES,
  type SectionsConfig,
  type SectionType,
} from '../../../types/landingPage';
import '../styles/juliaLandingTemplate.css';

interface JuliaLandingTemplateProps {
  affiliateName: string;
  profileImageUrl?: string;
  whatsappUrl: string;
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  theme?: LandingTheme;
  sections?: SectionsConfig;
}

export function JuliaLandingTemplate({
  affiliateName,
  profileImageUrl,
  whatsappUrl,
  headline,
  subheadline,
  buttonText,
  theme = defaultLandingTheme,
  sections,
}: JuliaLandingTemplateProps) {
  const themeVars = {
    '--landing-primary': theme.primary,
    '--landing-secondary': theme.secondary,
    '--landing-accent': theme.accent,
    '--landing-background': theme.background,
    '--landing-surface': theme.surface,
    '--landing-text': theme.text,
    '--landing-muted-text': theme.mutedText,
    '--landing-button-background': theme.buttonBackground,
    '--landing-button-text': theme.buttonText,
    '--landing-border': theme.border,
  } as CSSProperties;

  const resolved = resolveSectionsConfig(sections);
  const active = resolved.order.filter((type) => resolved.enabled[type] !== false);
  const flowSections = active.filter((type) => !OVERLAY_SECTION_TYPES.includes(type));

  const renderSection = (type: SectionType): ReactNode => {
    switch (type) {
      case 'hero':
        return <LandingHero headline={headline} />;
      case 'profile':
        return <AffiliateProfile name={affiliateName} photoUrl={profileImageUrl} />;
      case 'handles':
        return <HandlesMarquee />;
      case 'offer':
        return <OfferSection subheadline={subheadline} />;
      case 'whatsappButton':
        return <WhatsAppButton url={whatsappUrl} buttonText={buttonText} />;
      case 'marketplaceLogos':
        return <MarketplaceLogos />;
      case 'benefits':
        return <BenefitsSection />;
      case 'brandsCarousel':
        return <BrandsCarousel />;
      case 'footer':
        return <LandingFooter />;
      case 'imageCarousel':
        return <ImageCarousel images={resolved.imageCarousel?.images ?? []} />;
      case 'ctaButton':
        return resolved.ctaButton ? (
          <CtaButton
            label={resolved.ctaButton.label}
            url={resolved.ctaButton.url}
            eventName={resolved.ctaButton.pixelEventName}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="julia-landing-template" style={themeVars}>
      {flowSections.map((type) => (
        <section key={type} className="julia-section">
          <div className="julia-section-card">{renderSection(type)}</div>
        </section>
      ))}

      {active.includes('joinPopupToast') && <JoinPopupToast />}
      {active.includes('promoModal') && resolved.promoModal && (
        <PromoModal
          title={resolved.promoModal.title}
          body={resolved.promoModal.body}
          imageUrl={resolved.promoModal.imageUrl}
          ctaLabel={resolved.promoModal.ctaLabel}
          ctaUrl={resolved.promoModal.ctaUrl}
          delaySeconds={resolved.promoModal.delaySeconds}
        />
      )}
    </div>
  );
}
