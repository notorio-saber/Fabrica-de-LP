import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useLandingPageDoc } from '../../hooks/useLandingPageDoc';
import { landingThemes } from '../landing-page/themes/landingThemes';
import { defaultLandingPagePermissions, type LandingPagePermissions } from '../../types/landingPage';
import { createAffiliateAccount } from './services/createAffiliateAccount';
import { uploadProfilePhoto } from '../affiliate-panel/uploadProfilePhoto';

const PERMISSION_LABELS: Record<keyof LandingPagePermissions, string> = {
  allowAffiliateNameEdit: 'Nome de exibição',
  allowProfileImageEdit: 'Foto de perfil',
  allowWhatsAppUrlEdit: 'Link do WhatsApp',
  allowPixelEdit: 'ID do Pixel',
  allowThemeEdit: 'Paleta de cores',
  allowHeadlineEdit: 'Título principal',
  allowSubheadlineEdit: 'Subtítulo',
  allowButtonTextEdit: 'Texto do botão',
};

export function AffiliateFormPage() {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const isEditing = Boolean(routeSlug);

  return isEditing ? <EditForm slug={routeSlug!} /> : <CreateForm />;
}

function CreateForm() {
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [affiliateName, setAffiliateName] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [themeId, setThemeId] = useState(landingThemes[0].id);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await createAffiliateAccount({ slug, email, affiliateName, whatsappUrl, pixelId, themeId });
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar afiliada.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif', maxWidth: 420 }}>
      <h1 style={{ fontSize: 20, color: '#5D1E69' }}>Nova afiliada</h1>
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label style={fieldStyle}>
          Slug (ex: ana)
          <input style={inputStyle} value={slug} onChange={(e) => setSlug(e.target.value.trim().toLowerCase())} required />
        </label>
        <label style={fieldStyle}>
          E-mail de login
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label style={fieldStyle}>
          Nome de exibição
          <input style={inputStyle} value={affiliateName} onChange={(e) => setAffiliateName(e.target.value)} required />
        </label>
        <label style={fieldStyle}>
          Link do grupo do WhatsApp
          <input style={inputStyle} value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} required />
        </label>
        <label style={fieldStyle}>
          ID do Pixel da Meta
          <input style={inputStyle} value={pixelId} onChange={(e) => setPixelId(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Paleta de cores
          <select style={inputStyle} value={themeId} onChange={(e) => setThemeId(e.target.value)}>
            {landingThemes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? 'Criando...' : 'Criar afiliada'}
        </button>
      </form>
    </div>
  );
}

function EditForm({ slug }: { slug: string }) {
  const state = useLandingPageDoc(slug);
  const [affiliateName, setAffiliateName] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [themeId, setThemeId] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [permissions, setPermissions] = useState<LandingPagePermissions>(defaultLandingPagePermissions);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === 'ready' && !loaded) {
      setAffiliateName(state.data.affiliateName);
      setWhatsappUrl(state.data.whatsappUrl);
      setPixelId(state.data.pixelId ?? '');
      setThemeId(state.data.themeId);
      setStatus(state.data.status);
      setPermissions(state.data.permissions);
      setLoaded(true);
    }
  }, [state, loaded]);

  if (state.status === 'loading' || !loaded) return <p style={{ padding: 32 }}>Carregando...</p>;
  if (state.status === 'not-found') return <p style={{ padding: 32 }}>Afiliada não encontrada.</p>;
  if (state.status === 'error') return <p style={{ padding: 32 }}>Erro: {state.message}</p>;

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file) return;
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
    setSaving(true);
    try {
      await updateDoc(doc(db, 'landingPages', slug), {
        affiliateName,
        whatsappUrl,
        pixelId: pixelId || null,
        themeId,
        status,
        permissions,
        updatedAt: new Date(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif', maxWidth: 420 }}>
      <h1 style={{ fontSize: 20, color: '#5D1E69' }}>Editar {slug}</h1>
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
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

        <label style={fieldStyle}>
          Nome de exibição
          <input style={inputStyle} value={affiliateName} onChange={(e) => setAffiliateName(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Link do grupo do WhatsApp
          <input style={inputStyle} value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          ID do Pixel da Meta
          <input style={inputStyle} value={pixelId} onChange={(e) => setPixelId(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Paleta de cores
          <select style={inputStyle} value={themeId} onChange={(e) => setThemeId(e.target.value)}>
            {landingThemes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label style={fieldStyle}>
          Status
          <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}>
            <option value="active">Ativa</option>
            <option value="inactive">Inativa</option>
          </select>
        </label>

        <fieldset style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <legend style={{ fontSize: 13, color: '#666' }}>O que a afiliada pode editar</legend>
          {(Object.keys(PERMISSION_LABELS) as Array<keyof LandingPagePermissions>).map((key) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '4px 0' }}>
              <input
                type="checkbox"
                checked={permissions[key]}
                onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
              />
              {PERMISSION_LABELS[key]}
            </label>
          ))}
        </fieldset>

        <button type="submit" disabled={saving} style={buttonStyle}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#444' };
const inputStyle: React.CSSProperties = { padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 };
const buttonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: '12px 14px',
  borderRadius: 8,
  border: 'none',
  background: '#5D1E69',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
};
