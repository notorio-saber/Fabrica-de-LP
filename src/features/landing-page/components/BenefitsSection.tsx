const BENEFITS = [
  { icon: '✨', title: 'Beleza selecionada', subtitle: 'Produtos escolhidos com critério' },
  { icon: '🌺', title: 'Fragrâncias marcantes', subtitle: 'Perfumes que realmente se destacam' },
  { icon: '🔒', title: 'Qualidade confiável', subtitle: 'Marcas reconhecidas e seguras' },
  { icon: '📵', title: 'Sem excesso', subtitle: 'Apenas conteúdo relevante' },
];

export function BenefitsSection() {
  return (
    <div className="julia-benefits">
      {BENEFITS.map((benefit) => (
        <div className="julia-benefit-card" key={benefit.title}>
          <div className="julia-benefit-icon">{benefit.icon}</div>
          <div className="julia-benefit-title">{benefit.title}</div>
          <div className="julia-benefit-subtitle">{benefit.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
