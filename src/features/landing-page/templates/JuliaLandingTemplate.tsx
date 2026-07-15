import type { CSSProperties } from 'react';
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
import { defaultLandingTheme, type LandingTheme } from '../themes/landingThemes';
import '../styles/juliaLandingTemplate.css';

interface JuliaLandingTemplateProps {
  affiliateName: string;
  profileImageUrl?: string;
  whatsappUrl: string;
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  theme?: LandingTheme;
}

export function JuliaLandingTemplate({
  affiliateName,
  profileImageUrl,
  whatsappUrl,
  headline,
  subheadline,
  buttonText,
  theme = defaultLandingTheme,
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

  return (
    <div className="julia-landing-template" style={themeVars}>
      <section className="julia-section julia-section--hero">
        <div className="julia-card--hero">
          <LandingHero headline={headline} />
          <AffiliateProfile name={affiliateName} photoUrl={profileImageUrl} />
          <HandlesMarquee />
        </div>
      </section>

      <section className="julia-section julia-section--offer">
        <div className="julia-section-inner">
          <div className="julia-card--offer">
            <OfferSection subheadline={subheadline} />
            <WhatsAppButton url={whatsappUrl} buttonText={buttonText} />
            <MarketplaceLogos />
            <BenefitsSection />
            <BrandsCarousel />
          </div>
        </div>
      </section>

      <section className="julia-section julia-section--footer">
        <LandingFooter />
      </section>

      <JoinPopupToast />
    </div>
  );
}
