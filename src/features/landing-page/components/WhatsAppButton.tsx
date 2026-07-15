import { WhatsAppIcon } from './WhatsAppIcon';

const DEFAULT_BUTTON_TEXT = 'ENTRAR NO GRUPO 🤍';

interface WhatsAppButtonProps {
  url: string;
  buttonText?: string;
  eventName?: string;
}

export function WhatsAppButton({ url, buttonText, eventName = 'Lead' }: WhatsAppButtonProps) {
  const handleClick = () => {
    try {
      window.fbq?.('track', eventName);
    } catch {
      // tracking must never block the redirect below
    }
  };

  return (
    <div className="julia-whatsapp-button-container">
      <a
        href={url}
        className="julia-whatsapp-button"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <WhatsAppIcon className="julia-whatsapp-button-icon" />
        <span className="julia-whatsapp-button-text">{buttonText || DEFAULT_BUTTON_TEXT}</span>
      </a>
    </div>
  );
}
