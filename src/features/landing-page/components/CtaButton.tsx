interface CtaButtonProps {
  label: string;
  url: string;
  eventName?: string;
}

export function CtaButton({ label, url, eventName }: CtaButtonProps) {
  if (!label || !url) return null;

  const handleClick = () => {
    if (!eventName) return;
    try {
      window.fbq?.('track', eventName);
    } catch {
      // tracking must never block the redirect below
    }
  };

  return (
    <div className="julia-cta-button-container">
      <a href={url} className="julia-cta-button" target="_blank" rel="noopener noreferrer" onClick={handleClick}>
        {label}
      </a>
    </div>
  );
}
