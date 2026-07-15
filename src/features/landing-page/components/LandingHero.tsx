const DEFAULT_HEADLINE = 'CURADORIA EXCLUSIVA DOS PRODUTOS DE BELEZA MAIS DESEJADOS DO MOMENTO';

interface LandingHeroProps {
  headline?: string;
}

export function LandingHero({ headline }: LandingHeroProps) {
  return (
    <h4 className="julia-hero-headline">
      <strong>{headline || DEFAULT_HEADLINE}</strong>
    </h4>
  );
}
