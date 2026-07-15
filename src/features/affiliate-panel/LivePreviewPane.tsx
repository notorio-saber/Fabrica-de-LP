import { JuliaLandingTemplate } from '../landing-page/templates/JuliaLandingTemplate';
import type { LandingTheme } from '../landing-page/themes/landingThemes';

interface LivePreviewPaneProps {
  affiliateName: string;
  profileImageUrl?: string;
  whatsappUrl: string;
  theme: LandingTheme;
}

export function LivePreviewPane(props: LivePreviewPaneProps) {
  return (
    <div
      style={{
        width: 390,
        maxHeight: '85vh',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: 16,
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      }}
    >
      <JuliaLandingTemplate {...props} />
    </div>
  );
}
