import { useEffect, useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../auth/useAuth';
import { useLandingPageDoc } from '../../hooks/useLandingPageDoc';
import { landingThemes, defaultLandingTheme } from '../landing-page/themes/landingThemes';
import { LivePreviewPane } from './LivePreviewPane';
import { uploadProfilePhoto } from './uploadProfilePhoto';
import { brand, ui } from '../../styles/adminUi';

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
  if (state.status === 'not-found') return <div style={ui.content}><p style={ui.error}>Sua página ainda não foi cadastrada. Fale com o administrador.</p></div>;
  if (state.status === 'error') return <div style={ui.content}><p style={ui.error}>Erro ao carregar seus dados: {state.message}</p></div>;

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
    <div style={{ ...ui.content, maxWidth: 1100 }}>
      <h1 style={ui.pageTitle}>Editar minha página</h1>
      <p style={ui.pageSubtitle}>As alterações aparecem na pré-visualização ao lado assim que você salva.</p>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 20 }}>
        <form
          style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: 16, padding: 24, width: 340 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {permissions.allowProfileImageEdit && (
            <label style={ui.label}>
              Foto de perfil
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingPhoto}
                onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              />
              {uploadingPhoto && <span style={{ fontSize: 12, color: brand.mutedText }}>Enviando...</span>}
              {photoError && <span style={ui.error}>{photoError}</span>}
            </label>
          )}

          {permissions.allowAffiliateNameEdit && (
            <label style={ui.label}>
              Nome de exibição
              <input
                style={ui.input}
                value={draft.affiliateName}
                onChange={(e) => setDraft({ ...draft, affiliateName: e.target.value })}
              />
            </label>
          )}

          {permissions.allowWhatsAppUrlEdit && (
            <label style={ui.label}>
              Link do grupo do WhatsApp
              <input
                style={ui.input}
                value={draft.whatsappUrl}
                onChange={(e) => setDraft({ ...draft, whatsappUrl: e.target.value })}
              />
            </label>
          )}

          {permissions.allowPixelEdit && (
            <label style={ui.label}>
              ID do Pixel da Meta
              <input
                style={ui.input}
                value={draft.pixelId}
                onChange={(e) => setDraft({ ...draft, pixelId: e.target.value })}
              />
            </label>
          )}

          {permissions.allowThemeEdit && (
            <label style={ui.label}>
              Paleta de cores
              <select
                style={ui.input}
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

          {!permissions.allowProfileImageEdit &&
            !permissions.allowAffiliateNameEdit &&
            !permissions.allowWhatsAppUrlEdit &&
            !permissions.allowPixelEdit &&
            !permissions.allowThemeEdit && (
              <p style={{ fontSize: 13, color: brand.mutedText, margin: 0 }}>
                O administrador ainda não liberou nenhum campo pra você editar.
              </p>
            )}

          <button type="submit" disabled={saving} style={ui.buttonPrimary}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          {savedAt && <p style={ui.success}>Salvo!</p>}
        </form>

        <LivePreviewPane
          affiliateName={draft.affiliateName}
          profileImageUrl={state.data.profileImageUrl ?? undefined}
          whatsappUrl={draft.whatsappUrl}
          theme={theme}
        />
      </div>
    </div>
  );
}
