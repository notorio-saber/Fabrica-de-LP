const HANDLES = ['@luxoessencial_01', '@luxoessencial_promos', '@luxoessencial_promos', '@luxoessencial_promos'];

export function HandlesMarquee() {
  const loopHandles = [...HANDLES, ...HANDLES];

  return (
    <div className="julia-marquee">
      <div className="julia-marquee-track">
        {loopHandles.map((handle, index) => (
          <div className="julia-marquee-item" key={`${handle}-${index}`}>
            <span>{handle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
