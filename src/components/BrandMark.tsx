import { brand } from '../styles/adminUi';

export function BrandMark({ subtitle }: { subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={28} height={28} viewBox="0 0 32 32" aria-hidden>
        <circle cx="16" cy="16" r="16" fill={brand.primary} />
        <circle cx="16" cy="16" r="7" fill={brand.canvas} />
      </svg>
      <div>
        <div style={{ fontFamily: brand.headingFont, fontWeight: 700, fontSize: 16, color: brand.primary, lineHeight: 1.1 }}>
          Fábrica de Landing Page
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: brand.mutedText, marginTop: 1 }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}
