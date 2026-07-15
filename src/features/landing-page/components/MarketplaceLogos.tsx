import amazonLogo from '../assets/images/logo-amazon.png';
import mercadoLivreLogo from '../assets/images/logo-mercado-livre.png';
import shopeeLogo from '../assets/images/logo-shopee.png';

const LOGOS = [
  { src: amazonLogo, alt: 'Amazon' },
  { src: mercadoLivreLogo, alt: 'Mercado Livre' },
  { src: shopeeLogo, alt: 'Shopee' },
];

export function MarketplaceLogos() {
  return (
    <div className="julia-marketplace-logos">
      {LOGOS.map((logo) => (
        <div className="julia-marketplace-logo-item" key={logo.alt}>
          <img src={logo.src} alt={logo.alt} />
        </div>
      ))}
    </div>
  );
}
