import { useEffect, useRef } from 'react';

interface ImageCarouselProps {
  images: { url: string; alt?: string }[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animate = images.length >= 2;

  useEffect(() => {
    if (!animate) return;
    const track = trackRef.current;
    if (!track) return;

    const highlightCenterImage = () => {
      const items = Array.from(track.querySelectorAll('img'));
      const center = window.innerWidth / 2;

      const closest = items.reduce<HTMLImageElement | null>((nearest, item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - itemCenter);
        const nearestDistance = nearest
          ? Math.abs(center - (nearest.getBoundingClientRect().left + nearest.getBoundingClientRect().width / 2))
          : Infinity;
        return distance < nearestDistance ? item : nearest;
      }, null);

      items.forEach((item) => item.classList.remove('active'));
      closest?.classList.add('active');
    };

    const interval = setInterval(highlightCenterImage, 80);
    return () => clearInterval(interval);
  }, [animate]);

  if (images.length === 0) return null;

  const trackImages = animate ? [...images, ...images] : images;

  return (
    <div className="julia-image-carousel">
      <div className="julia-image-carousel-track" ref={trackRef}>
        {trackImages.map((image, index) => (
          <img key={`${image.url}-${index}`} src={image.url} alt={image.alt ?? ''} />
        ))}
      </div>
    </div>
  );
}
