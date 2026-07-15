import { useEffect, useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../auth/useAuth';
import { useLandingPageDoc } from '../../hooks/useLandingPageDoc';
import { landingThemes, defaultLandingTheme } from '../landing-page/themes/landingThemes';
import { LivePreviewPane } from './LivePreviewPane';
import { uploadProfilePhoto } from './uploadProfilePhoto';

interface DraftState {
  affiliateName: string;
  whatsappUrl: string;
  pixelId: string;
  themeId: string;
}

export function AffiliateEditPage() {
  const { slug } = useAuth();
  const state = useLandingPageDoc(slug);
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === 'ready' && !draft) {
      setDraft({
        affiliateName: state.data.affiliateName,
        whatsappUrl: state.data.whatsappUrl,
        pixelId: state.data.pixelId ?? '',
        themeId: state.data.themeId,
      });
    }
  }, [state, draft]);

  if (state.status === 'loading' || !draft) return null;
  if (state.status === 'not-found') return <p>Sua página ainda não foi cadastrada. Fale com o administrador.</p>;
  if (state.status === 'error') return <p>Erro ao carregar seus dados: {state.message}</p>;

  const { permissions } = state.data;
  const theme = landingThemes.find((t) => t.id === draft.themeId) ?? defaultLandingTheme;

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file || !slug) return;
    setPhotoError(null);
    setUploadingPhoto(true);
    try {
      await uploadProfilePhoto(slug, file);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Erro ao enviar a foto.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!slug) return;
    setSaving(true);
    try {
      const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
      if (permissions.allowAffiliateNameEdit) updates.affiliateName = draft.affiliateName;
      if (permissions.allowWhatsAppUrlEdit) updates.whatsappUrl = draft.whatsappUrl;
      if (permissions.allowPixelEdit) updates.pixelId = draft.pixelId || null;
      if (permissions.allowThemeEdit) updates.themeId = draft.themeId;

      await updateDoc(doc(db, 'landingPages', slug), updates);
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 32, padding: 32, fontFamily: 'system-ui, sans-serif', flexWrap: 'wrap' }}>
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <h1 style={{ fontSize: 20, color: '#5D1E69', margin: 0 }}>Editar minha página</h1>

        {permissions.allowProfileImageEdit && (
          <label style={fieldStyle}>
            Foto de perfil
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploadingPhoto}
              onChange={(e) => handlePhotoChange(e.target.files?.[0])}
            />
            {uploadingPhoto && <span style={{ fontSize: 12, color: '#666' }}>Enviando...</span>}
            {photoError && <span style={{ fontSize: 12, color: '#c0392b' }}>{photoError}</span>}
          </label>
        )}

        {permissions.allowAffiliateNameEdit && (
          <label style={fieldStyle}>
            Nome de exibição
            <input
              style={inputStyle}
              value={draft.affiliateName}
              onChange={(e) => setDraft({ ...draft, affiliateName: e.target.value })}
            />
          </label>
        )}

        {permissions.allowWhatsAppUrlEdit && (
          <label style={fieldStyle}>
            Link do grupo do WhatsApp
            <input
              style={inputStyle}
              value={draft.whatsappUrl}
              onChange={(e) => setDraft({ ...draft, whatsappUrl: e.target.value })}
            />
          </label>
        )}

        {permissions.allowPixelEdit && (
          <label style={fieldStyle}>
            ID do Pixel da Meta
            <input
              style={inputStyle}
              value={draft.pixelId}
              onChange={(e) => setDraft({ ...draft, pixelId: e.target.value })}
            />
          </label>
        )}

        {permissions.allowThemeEdit && (
          <label style={fieldStyle}>
            Paleta de cores
            <select
              style={inputStyle}
              value={draft.themeId}
              onChange={(e) => setDraft({ ...draft, themeId: e.target.value })}
            >
              {landingThemes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: 8,
            padding: '12px 14px',
            borderRadius: 8,
            border: 'none',
            background: '#5D1E69',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        {savedAt && <p style={{ color: '#2e7d32', fontSize: 13, margin: 0 }}>Salvo!</p>}
      </form>

      <LivePreviewPane
        affiliateName={draft.affiliateName}
        profileImageUrl={state.data.profileImageUrl ?? undefined}
        whatsappUrl={draft.whatsappUrl}
        theme={theme}
      />
    </div>
  );
}

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#444' };
const inputStyle: React.CSSProperties = { padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 };
