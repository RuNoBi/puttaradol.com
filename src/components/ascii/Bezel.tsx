/**
 * Watch bezel drawn in SVG: 60 minute ticks, longer gold ticks every five,
 * Roman numerals at the quarters. Purely decorative.
 */
export function Bezel({ className }: { className?: string }) {
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  const numerals: [string, number][] = [
    ["XII", 0],
    ["III", 90],
    ["VI", 180],
    ["IX", 270],
  ];
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <g className="bezel-spin" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="100" r="97" fill="none" stroke="var(--line)" strokeWidth="0.35" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="var(--line)" strokeWidth="0.25" />
        {ticks.map((i) => {
          const major = i % 5 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1={major ? 4.5 : 5.5}
              x2="100"
              y2={major ? 12 : 8.5}
              stroke={major ? "var(--accent)" : "var(--muted)"}
              strokeOpacity={major ? 0.9 : 0.45}
              strokeWidth={major ? 0.7 : 0.3}
              transform={`rotate(${i * 6} 100 100)`}
            />
          );
        })}
        {numerals.map(([n, deg]) => (
          <text
            key={n}
            x="100"
            y="21.5"
            textAnchor="middle"
            fontSize="5"
            letterSpacing="0.6"
            fill="var(--muted)"
            transform={`rotate(${deg} 100 100)`}
            style={{ fontWeight: 300 }}
          >
            {n}
          </text>
        ))}
      </g>
    </svg>
  );
}
