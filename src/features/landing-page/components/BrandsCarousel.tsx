import { useEffect, useRef } from 'react';
import kerastaseLogo from '../assets/images/brand-kerastase.png';
import lorealLogo from '../assets/images/brand-loreal.jpeg';
import lancomeLogo from '../assets/images/brand-lancome.jpeg';
import wellaLogo from '../assets/images/brand-wella.jpeg';

const BRANDS = [
  { src: kerastaseLogo, alt: 'Kérastase' },
  { src: lorealLogo, alt: "L'Oréal Paris" },
  { src: lancomeLogo, alt: 'Lancôme Paris' },
  { src: wellaLogo, alt: 'Wella' },
];

export function BrandsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const highlightCenterLogo = () => {
      const logos = Array.from(track.querySelectorAll('img'));
      const center = window.innerWidth / 2;

      const closest = logos.reduce<HTMLImageElement | null>((nearest, logo) => {
        const rect = logo.getBoundingClientRect();
        const logoCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - logoCenter);
        const nearestDistance = nearest
          ? Math.abs(center - (nearest.getBoundingClientRect().left + nearest.getBoundingClientRect().width / 2))
          : Infinity;
        return distance < nearestDistance ? logo : nearest;
      }, null);

      logos.forEach((logo) => logo.classList.remove('active'));
      closest?.classList.add('active');
    };

    const interval = setInterval(highlightCenterLogo, 80);
    return () => clearInterval(interval);
  }, []);

  const loopBrands = [...BRANDS, ...BRANDS];

  return (
    <div className="julia-brands-carousel">
      <div className="julia-brands-track" ref={trackRef}>
        {loopBrands.map((brand, index) => (
          <img key={`${brand.alt}-${index}`} src={brand.src} alt={brand.alt} />
        ))}
      </div>
    </div>
  );
}
