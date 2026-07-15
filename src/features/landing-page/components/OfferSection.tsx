const DEFAULT_SUBHEADLINE =
  'Uma seleção diária com marcas confiáveis e tendências que realmente entregam resultado. Clique e entre no grupo para descobrir os produtos mais desejados.';

interface OfferSectionProps {
  subheadline?: string;
}

export function OfferSection({ subheadline }: OfferSectionProps) {
  return (
    <>
      <h5 className="julia-offer-subheadline">
        <strong>{subheadline || DEFAULT_SUBHEADLINE}</strong> 💕
      </h5>
      <h2 className="julia-offer-categories">
        Skincare &nbsp;•&nbsp; Haircare &nbsp;•&nbsp; Maquiagem &nbsp;•&nbsp; Perfumaria
      </h2>
    </>
  );
}
