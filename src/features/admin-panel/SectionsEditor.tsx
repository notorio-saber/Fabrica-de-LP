import type { SectionsConfig, SectionType } from '../../types/landingPage';
import { brand, ui } from '../../styles/adminUi';

const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Título principal (hero)',
  profile: 'Foto e nome da afiliada',
  handles: 'Faixa de handles (marquee)',
  offer: 'Subtítulo / oferta',
  whatsappButton: 'Botão do WhatsApp',
  marketplaceLogos: 'Logos de marketplaces',
  benefits: 'Benefícios',
  brandsCarousel: 'Carrossel de marcas (fixo)',
  footer: 'Rodapé',
  joinPopupToast: 'Pop-up "entrou no grupo"',
  imageCarousel: 'Carrossel de imagens (personalizado)',
  ctaButton: 'Botão de CTA extra',
  promoModal: 'Modal promocional',
};

interface SectionsEditorProps {
  value: SectionsConfig;
  onChange: (next: SectionsConfig) => void;
}

export function SectionsEditor({ value, onChange }: SectionsEditorProps) {
  const moveSection = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= value.order.length) return;
    const nextOrder = [...value.order];
    [nextOrder[index], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[index]];
    onChange({ ...value, order: nextOrder });
  };

  const toggleSection = (type: SectionType, enabled: boolean) => {
    onChange({ ...value, enabled: { ...value.enabled, [type]: enabled } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {value.order.map((type, index) => (
        <div
          key={type}
          style={{
            ...ui.card,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => moveSection(index, -1)}
              disabled={index === 0}
              style={{ ...ui.buttonSecondary, padding: '4px 8px' }}
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => moveSection(index, 1)}
              disabled={index === value.order.length - 1}
              style={{ ...ui.buttonSecondary, padding: '4px 8px' }}
            >
              ▼
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: brand.text, flex: 1 }}>
              <input
                type="checkbox"
                checked={value.enabled[type] ?? false}
                onChange={(e) => toggleSection(type, e.target.checked)}
              />
              {SECTION_LABELS[type]}
            </label>
          </div>

          {type === 'imageCarousel' && value.enabled.imageCarousel && (
            <ImageCarouselFields value={value} onChange={onChange} />
          )}
          {type === 'ctaButton' && value.enabled.ctaButton && <CtaButtonFields value={value} onChange={onChange} />}
          {type === 'promoModal' && value.enabled.promoModal && <PromoModalFields value={value} onChange={onChange} />}
        </div>
      ))}
    </div>
  );
}

function ImageCarouselFields({ value, onChange }: SectionsEditorProps) {
  const images = value.imageCarousel?.images ?? [];

  const updateImages = (nextImages: { url: string; alt?: string }[]) => {
    onChange({ ...value, imageCarousel: { images: nextImages } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 60 }}>
      {images.map((image, index) => (
        <div key={index} style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...ui.input, flex: 2 }}
            placeholder="URL da imagem"
            value={image.url}
            onChange={(e) => {
              const next = [...images];
              next[index] = { ...next[index], url: e.target.value };
              updateImages(next);
            }}
          />
          <input
            style={{ ...ui.input, flex: 1 }}
            placeholder="Texto alternativo"
            value={image.alt ?? ''}
            onChange={(e) => {
              const next = [...images];
              next[index] = { ...next[index], alt: e.target.value };
              updateImages(next);
            }}
          />
          <button
            type="button"
            style={{ ...ui.buttonSecondary, padding: '4px 10px' }}
            onClick={() => updateImages(images.filter((_, i) => i !== index))}
          >
            Remover
          </button>
        </div>
      ))}
      <button
        type="button"
        style={{ ...ui.buttonSecondary, alignSelf: 'flex-start' }}
        onClick={() => updateImages([...images, { url: '', alt: '' }])}
      >
        + Adicionar imagem
      </button>
    </div>
  );
}

function CtaButtonFields({ value, onChange }: SectionsEditorProps) {
  const cta = value.ctaButton ?? { label: '', url: '' };

  const update = (patch: Partial<typeof cta>) => {
    onChange({ ...value, ctaButton: { ...cta, ...patch } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 60 }}>
      <input
        style={ui.input}
        placeholder="Texto do botão"
        value={cta.label}
        onChange={(e) => update({ label: e.target.value })}
      />
      <input
        style={ui.input}
        placeholder="Link do botão"
        value={cta.url}
        onChange={(e) => update({ url: e.target.value })}
      />
      <input
        style={ui.input}
        placeholder="Nome do evento do Pixel (opcional)"
        value={cta.pixelEventName ?? ''}
        onChange={(e) => update({ pixelEventName: e.target.value || undefined })}
      />
    </div>
  );
}

function PromoModalFields({ value, onChange }: SectionsEditorProps) {
  const modal = value.promoModal ?? { title: '', body: '', delaySeconds: 5 };

  const update = (patch: Partial<typeof modal>) => {
    onChange({ ...value, promoModal: { ...modal, ...patch } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 60 }}>
      <input
        style={ui.input}
        placeholder="Título"
        value={modal.title}
        onChange={(e) => update({ title: e.target.value })}
      />
      <textarea
        style={{ ...ui.input, resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }}
        placeholder="Texto"
        value={modal.body}
        onChange={(e) => update({ body: e.target.value })}
      />
      <input
        style={ui.input}
        placeholder="URL da imagem (opcional)"
        value={modal.imageUrl ?? ''}
        onChange={(e) => update({ imageUrl: e.target.value || undefined })}
      />
      <input
        style={ui.input}
        placeholder="Texto do botão (opcional)"
        value={modal.ctaLabel ?? ''}
        onChange={(e) => update({ ctaLabel: e.target.value || undefined })}
      />
      <input
        style={ui.input}
        placeholder="Link do botão (opcional)"
        value={modal.ctaUrl ?? ''}
        onChange={(e) => update({ ctaUrl: e.target.value || undefined })}
      />
      <label style={ui.label}>
        Mostrar depois de quantos segundos
        <input
          type="number"
          min={0}
          style={ui.input}
          value={modal.delaySeconds}
          onChange={(e) => update({ delaySeconds: Number(e.target.value) || 0 })}
        />
      </label>
    </div>
  );
}
