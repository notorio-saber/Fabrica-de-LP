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
  headline: string;
  subheadline: string;
  buttonText: string;
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
        headline: state.data.headline ?? '',
        subheadline: state.data.subheadline ?? '',
        buttonText: state.data.buttonText ?? '',
      });
    }
  }, [state, draft]);

  if (state.status === 'loading' || !draft) return null;
  if (state.status === 'not-found') return <div style={ui.content}><p style={ui.error}>Sua página ainda não foi cadastrada. Fale com o administrador.</p></div>;
  if (state.status === 'error') return <div style={ui.content}><p style={ui.error}>Erro ao carregar seus dados: {state.message}</p></div>;

  const { permissions } = state.data;
  const theme = landingThemes.find((t) => t.id === draft.themeId) ?? defaultLandingTheme;
  const noPermissionsGranted = !Object.values(permissions).some(Boolean);

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
      if (permissions.allowHeadlineEdit) updates.headline = draft.headline || null;
      if (permissions.allowSubheadlineEdit) updates.subheadline = draft.subheadline || null;
      if (permissions.allowButtonTextEdit) updates.buttonText = draft.buttonText || null;

      await updateDoc(doc(db, 'landingPages', slug), updates);
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ ...ui.content, maxWidth: 'none', padding: '32px 40px' }}>
      <h1 style={ui.pageTitle}>Editar minha página</h1>
      <p style={ui.pageSubtitle}>As alterações aparecem na pré-visualização ao lado assim que você salva.</p>

      <div style={{ display: 'flex', gap: 32, marginTop: 20, alignItems: 'flex-start' }}>
        <form
          style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: 16, padding: 28, flex: 1, minWidth: 320 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
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

            {permissions.allowButtonTextEdit && (
              <label style={ui.label}>
                Texto do botão
                <input
                  style={ui.input}
                  value={draft.buttonText}
                  placeholder="ENTRAR NO GRUPO 🤍"
                  onChange={(e) => setDraft({ ...draft, buttonText: e.target.value })}
                />
              </label>
            )}
          </div>

          {permissions.allowHeadlineEdit && (
            <label style={ui.label}>
              Título principal
              <textarea
                style={{ ...ui.input, resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }}
                value={draft.headline}
                placeholder="CURADORIA EXCLUSIVA DOS PRODUTOS DE BELEZA MAIS DESEJADOS DO MOMENTO"
                onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
              />
            </label>
          )}

          {permissions.allowSubheadlineEdit && (
            <label style={ui.label}>
              Subtítulo
              <textarea
                style={{ ...ui.input, resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }}
                value={draft.subheadline}
                placeholder="Uma seleção diária com marcas confiáveis..."
                onChange={(e) => setDraft({ ...draft, subheadline: e.target.value })}
              />
            </label>
          )}

          {noPermissionsGranted && (
            <p style={{ fontSize: 13, color: brand.mutedText, margin: 0 }}>
              O administrador ainda não liberou nenhum campo pra você editar.
            </p>
          )}

          <button type="submit" disabled={saving} style={{ ...ui.buttonPrimary, alignSelf: 'flex-start' }}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          {savedAt && <p style={ui.success}>Salvo!</p>}
        </form>

        <div style={{ flexShrink: 0 }}>
          <LivePreviewPane
            affiliateName={draft.affiliateName}
            profileImageUrl={state.data.profileImageUrl ?? undefined}
            whatsappUrl={draft.whatsappUrl}
            headline={draft.headline || undefined}
            subheadline={draft.subheadline || undefined}
            buttonText={draft.buttonText || undefined}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
