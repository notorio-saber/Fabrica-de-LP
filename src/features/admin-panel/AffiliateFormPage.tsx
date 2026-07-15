import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useLandingPageDoc } from '../../hooks/useLandingPageDoc';
import { landingThemes } from '../landing-page/themes/landingThemes';
import { defaultLandingPagePermissions, type LandingPagePermissions } from '../../types/landingPage';
import { createAffiliateAccount } from './services/createAffiliateAccount';
import { uploadProfilePhoto } from '../affiliate-panel/uploadProfilePhoto';
import { brand, ui } from '../../styles/adminUi';

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

interface CreatedAffiliate {
  slug: string;
  email: string;
  password: string;
}

function CreateForm() {
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [affiliateName, setAffiliateName] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [themeId, setThemeId] = useState(landingThemes[0].id);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<CreatedAffiliate | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const { password } = await createAffiliateAccount({ slug, email, affiliateName, whatsappUrl, pixelId, themeId });
      setCreated({ slug, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar afiliada.');
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return <CreatedAffiliateSummary affiliate={created} />;
  }

  return (
    <div style={ui.content}>
      <BackLink />
      <h1 style={ui.pageTitle}>Nova afiliada</h1>
      <p style={ui.pageSubtitle}>
        Isso cria a conta de login da afiliada e a página pública dela ao mesmo tempo, prontas pra ela editar depois
        de acordo com as permissões que você definir.
      </p>
      <form style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: 16, padding: 24, maxWidth: 420, marginTop: 20 }} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <label style={ui.label}>
          Slug (ex: ana)
          <input style={ui.input} value={slug} onChange={(e) => setSlug(e.target.value.trim().toLowerCase())} required />
        </label>
        <label style={ui.label}>
          E-mail de login
          <input style={ui.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label style={ui.label}>
          Nome de exibição
          <input style={ui.input} value={affiliateName} onChange={(e) => setAffiliateName(e.target.value)} required />
        </label>
        <label style={ui.label}>
          Link do grupo do WhatsApp
          <input style={ui.input} value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} required />
        </label>
        <label style={ui.label}>
          ID do Pixel da Meta
          <input style={ui.input} value={pixelId} onChange={(e) => setPixelId(e.target.value)} />
        </label>
        <label style={ui.label}>
          Paleta de cores
          <select style={ui.input} value={themeId} onChange={(e) => setThemeId(e.target.value)}>
            {landingThemes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        {error && <p style={ui.error}>{error}</p>}
        <button type="submit" disabled={submitting} style={ui.buttonPrimary}>
          {submitting ? 'Criando...' : 'Criar afiliada'}
        </button>
      </form>
    </div>
  );
}

function CreatedAffiliateSummary({ affiliate }: { affiliate: CreatedAffiliate }) {
  const [copied, setCopied] = useState(false);
  const pageUrl = `${window.location.origin}/p/${affiliate.slug}`;
  const message = [
    'Sua página da Fábrica de Landing Page está pronta!',
    '',
    `Link da sua página: ${pageUrl}`,
    '',
    'Pra editar foto, texto, link e cor, entre no painel:',
    `${window.location.origin}/painel/login`,
    `E-mail: ${affiliate.email}`,
    `Senha: ${affiliate.password}`,
  ].join('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
  };

  return (
    <div style={ui.content}>
      <BackLink />
      <h1 style={ui.pageTitle}>Afiliada criada!</h1>
      <p style={ui.pageSubtitle}>
        Copie a mensagem abaixo e mande pra ela pelo WhatsApp — é a única vez que a senha aparece aqui.
      </p>

      <div style={{ ...ui.card, padding: 24, maxWidth: 480, marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: brand.mutedText, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Link da página pública
          </p>
          <p style={{ margin: 0, fontWeight: 600 }}>{pageUrl}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: brand.mutedText, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Login do painel
          </p>
          <p style={{ margin: 0 }}>{affiliate.email}</p>
          <p style={{ margin: 0, fontWeight: 600, fontFamily: 'monospace', fontSize: 15 }}>{affiliate.password}</p>
        </div>

        <button type="button" onClick={handleCopy} style={ui.buttonPrimary}>
          {copied ? 'Copiado!' : 'Copiar mensagem pra enviar'}
        </button>
        <Link to="/admin" style={{ ...ui.buttonSecondary, textAlign: 'center', textDecoration: 'none' }}>
          Voltar pra lista de afiliadas
        </Link>
      </div>
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

  if (state.status === 'loading' || !loaded) return <div style={ui.content}><p style={{ color: brand.mutedText }}>Carregando...</p></div>;
  if (state.status === 'not-found') return <div style={ui.content}><p style={ui.error}>Afiliada não encontrada.</p></div>;
  if (state.status === 'error') return <div style={ui.content}><p style={ui.error}>Erro: {state.message}</p></div>;

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
    <div style={ui.content}>
      <BackLink />
      <h1 style={ui.pageTitle}>Editar {slug}</h1>
      <p style={ui.pageSubtitle}>Ajuste os dados da página e escolha o que essa afiliada pode alterar por conta própria.</p>
      <form style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: 16, padding: 24, maxWidth: 420, marginTop: 20 }} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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

        <label style={ui.label}>
          Nome de exibição
          <input style={ui.input} value={affiliateName} onChange={(e) => setAffiliateName(e.target.value)} />
        </label>
        <label style={ui.label}>
          Link do grupo do WhatsApp
          <input style={ui.input} value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} />
        </label>
        <label style={ui.label}>
          ID do Pixel da Meta
          <input style={ui.input} value={pixelId} onChange={(e) => setPixelId(e.target.value)} />
        </label>
        <label style={ui.label}>
          Paleta de cores
          <select style={ui.input} value={themeId} onChange={(e) => setThemeId(e.target.value)}>
            {landingThemes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label style={ui.label}>
          Status
          <select style={ui.input} value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}>
            <option value="active">Ativa</option>
            <option value="inactive">Inativa</option>
          </select>
        </label>

        <fieldset style={{ border: `1px solid ${brand.border}`, borderRadius: 12, padding: 14 }}>
          <legend style={{ fontSize: 13, color: brand.mutedText, padding: '0 6px' }}>O que a afiliada pode editar</legend>
          {(Object.keys(PERMISSION_LABELS) as Array<keyof LandingPagePermissions>).map((key) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '4px 0', color: brand.text }}>
              <input
                type="checkbox"
                checked={permissions[key]}
                onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
              />
              {PERMISSION_LABELS[key]}
            </label>
          ))}
        </fieldset>

        <button type="submit" disabled={saving} style={ui.buttonPrimary}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/admin" style={{ ...ui.linkButton, textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}>
      ← Voltar pra lista de afiliadas
    </Link>
  );
}
