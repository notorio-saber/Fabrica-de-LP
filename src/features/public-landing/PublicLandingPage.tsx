import { useParams } from 'react-router-dom';
import { JuliaLandingTemplate } from '../landing-page/templates/JuliaLandingTemplate';
import { landingThemes, defaultLandingTheme } from '../landing-page/themes/landingThemes';
import { resolveSlug } from './resolveSlug';
import { useLandingPageDoc } from '../../hooks/useLandingPageDoc';
import { useMetaPixel } from '../meta-pixel/useMetaPixel';

export function PublicLandingPage() {
  const { slug: paramSlug } = useParams<{ slug?: string }>();
  const slug = resolveSlug(window.location.hostname, paramSlug);
  const state = useLandingPageDoc(slug, { requireActive: true });

  useMetaPixel(state.status === 'ready' ? state.data.pixelId : null);

  if (state.status === 'loading') {
    return null;
  }

  if (state.status === 'not-found' || state.status === 'error') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#666', textAlign: 'center', padding: 24 }}>
        <p>Página não encontrada.</p>
      </div>
    );
  }

  const { data } = state;
  const theme = landingThemes.find((t) => t.id === data.themeId) ?? defaultLandingTheme;

  return (
    <JuliaLandingTemplate
      affiliateName={data.affiliateName}
      profileImageUrl={data.profileImageUrl ?? undefined}
      whatsappUrl={data.whatsappUrl}
      theme={theme}
    />
  );
}
