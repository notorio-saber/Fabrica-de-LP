import { useEffect, useState } from 'react';

interface PromoModalProps {
  title: string;
  body: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  delaySeconds: number;
}

export function PromoModal({ title, body, imageUrl, ctaLabel, ctaUrl, delaySeconds }: PromoModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), Math.max(0, delaySeconds) * 1000);
    return () => clearTimeout(timer);
  }, [delaySeconds]);

  if (!title && !body) return null;
  if (!open) return null;

  return (
    <div className="julia-promo-modal-backdrop" onClick={() => setOpen(false)}>
      <div className="julia-promo-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="julia-promo-modal-close" onClick={() => setOpen(false)} aria-label="Fechar">
          ×
        </button>
        {imageUrl && <img className="julia-promo-modal-image" src={imageUrl} alt="" />}
        {title && <h3>{title}</h3>}
        {body && <p>{body}</p>}
        {ctaLabel && ctaUrl && (
          <a
            href={ctaUrl}
            className="julia-promo-modal-cta"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}
