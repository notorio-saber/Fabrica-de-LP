import { useEffect, useState } from 'react';
import { brand, ui } from '../styles/adminUi';

export function AuthGateLoading() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStuck(true), 8000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: brand.bodyFont,
        background: brand.canvas,
        padding: 24,
      }}
    >
      {!stuck ? (
        <p style={{ color: brand.mutedText, fontSize: 14 }}>Carregando...</p>
      ) : (
        <div style={{ ...ui.card, padding: 24, maxWidth: 360, textAlign: 'center' }}>
          <p style={{ ...ui.error, marginBottom: 12 }}>
            Isso está demorando demais. Pode ser uma extensão do navegador ou um antivírus bloqueando a conexão.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ ...ui.buttonSecondary, width: '100%' }}
          >
            Recarregar página
          </button>
        </div>
      )}
    </div>
  );
}
