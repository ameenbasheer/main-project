// Hand-rolled 3D pie chart using SVG. Renders side walls for the visible
// (lower) half of the ellipse so the chart reads as solid even when slices
// are highlighted. No charting lib dependency.

const PALETTE = [
  '#2dd4bf',
  '#34d399',
  '#fbbf24',
  '#f97316',
  '#ec4899',
  '#a78bfa',
  '#60a5fa',
  '#f87171',
  '#84cc16',
  '#22d3ee',
];

function darken(hex, amount = 0.35) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const f = (v) => Math.max(0, Math.round(v * (1 - amount)));
  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${toHex(f(r))}${toHex(f(g))}${toHex(f(b))}`;
}

function polar(cx, cy, rx, ry, angle) {
  return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
}

function topWedgePath(cx, cy, rx, ry, start, end) {
  const a = polar(cx, cy, rx, ry, start);
  const b = polar(cx, cy, rx, ry, end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${a.x} ${a.y} A ${rx} ${ry} 0 ${largeArc} 1 ${b.x} ${b.y} Z`;
}

// Front-facing side wall for a slice. Only renders the portion of the slice
// whose top arc sits on the lower half of the ellipse (sin > 0).
function sidePath(cx, cy, rx, ry, depth, start, end) {
  const fa = Math.max(0, Math.min(Math.PI, start));
  const fb = Math.max(0, Math.min(Math.PI, end));
  if (fb - fa < 0.001) return null;
  const tA = polar(cx, cy, rx, ry, fa);
  const tB = polar(cx, cy, rx, ry, fb);
  return [
    `M ${tA.x} ${tA.y}`,
    `A ${rx} ${ry} 0 0 1 ${tB.x} ${tB.y}`,
    `L ${tB.x} ${tB.y + depth}`,
    `A ${rx} ${ry} 0 0 0 ${tA.x} ${tA.y + depth}`,
    'Z',
  ].join(' ');
}

export default function PieChart3D({
  data = [],
  size = 280,
  depth = 28,
  showLegend = true,
  onSliceClick,
  selectedId = null,
  emptyLabel = 'No crops yet',
}) {
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  // Layout: top ellipse fits inside the upper portion of the SVG.
  const w = size;
  const h = Math.round(size * 0.78);
  const cx = w / 2;
  const cy = h * 0.45;
  const rx = w * 0.42;
  const ry = h * 0.32;

  if (total <= 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: h }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-label="empty pie chart">
          <ellipse cx={cx} cy={cy + depth} rx={rx} ry={ry} fill="#0a1e1e" opacity="0.45" />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(45,212,191,0.08)" stroke="rgba(45,212,191,0.3)" />
        </svg>
        <p className="text-dark-muted text-xs mt-2">{emptyLabel}</p>
      </div>
    );
  }

  // Build slices with absolute angles (start at -π/2 / top of ellipse so the
  // first slice anchors at 12 o'clock — feels natural even though the side
  // walls only render for the lower half).
  const slices = [];
  let acc = -Math.PI / 2;
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const value = Number(d.value) || 0;
    const fraction = value / total;
    const angleSpan = fraction * Math.PI * 2;
    const start = acc;
    const end = acc + angleSpan;
    acc = end;
    const color = d.color || PALETTE[i % PALETTE.length];
    slices.push({
      ...d,
      start,
      end,
      mid: (start + end) / 2,
      color,
      sideColor: darken(color, 0.45),
      percent: Math.round(fraction * 100),
    });
  }

  // Side walls work in [0, π] (lower half of ellipse). Normalize each slice
  // into one or more sub-arcs that fall in that range.
  const sideArcs = [];
  for (const s of slices) {
    let a = s.start;
    let b = s.end;
    // Shift into [-π, 3π] via modulo so we can clip cleanly to [0, π]
    const norm = (v) => {
      let x = v;
      while (x < 0) x += Math.PI * 2;
      while (x >= Math.PI * 2) x -= Math.PI * 2;
      return x;
    };
    a = norm(a);
    b = norm(b);
    const segs = a <= b ? [[a, b]] : [[a, Math.PI * 2], [0, b]];
    for (const [sa, sb] of segs) {
      const fa = Math.max(0, Math.min(Math.PI, sa));
      const fb = Math.max(0, Math.min(Math.PI, sb));
      if (fb - fa > 0.001) sideArcs.push({ slice: s, fa, fb });
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <svg width={w} height={h + depth + 20} viewBox={`0 0 ${w} ${h + depth + 20}`} role="img" aria-label="Crop area pie chart">
        <defs>
          <radialGradient id="pieHighlight" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="pieShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="6" result="off" />
            <feComponentTransfer><feFuncA type="linear" slope="0.55" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Drop shadow plate */}
        <ellipse cx={cx} cy={cy + depth + 10} rx={rx * 1.05} ry={ry * 0.4} fill="rgba(0,0,0,0.35)" filter="url(#pieShadow)" />

        {/* Side walls */}
        {sideArcs.map(({ slice, fa, fb }, i) => (
          <path
            key={`side-${slice.id ?? i}-${i}`}
            d={sidePath(cx, cy, rx, ry, depth, fa, fb)}
            fill={slice.sideColor}
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="0.5"
          />
        ))}

        {/* Top wedges */}
        {slices.map((s, i) => {
          const isSelected = selectedId != null && s.id === selectedId;
          const lift = isSelected ? 4 : 0;
          // Pull selected slice slightly outward along its midangle
          const dx = isSelected ? Math.cos(s.mid) * 6 : 0;
          const dy = isSelected ? Math.sin(s.mid) * 4 - lift : 0;
          return (
            <g
              key={`top-${s.id ?? i}`}
              transform={`translate(${dx} ${dy})`}
              style={{ cursor: onSliceClick ? 'pointer' : 'default', transition: 'transform 0.25s ease' }}
              onClick={() => onSliceClick && onSliceClick(s)}
            >
              <path
                d={topWedgePath(cx, cy, rx, ry, s.start, s.end)}
                fill={s.color}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="0.75"
              />
              <path
                d={topWedgePath(cx, cy, rx, ry, s.start, s.end)}
                fill="url(#pieHighlight)"
                pointerEvents="none"
              />
            </g>
          );
        })}

        {/* Subtle rim highlight on top ellipse */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" pointerEvents="none" />

        {/* Percent labels */}
        {slices.map((s, i) => {
          if (s.percent < 6) return null;
          const lr = rx * 0.62;
          const lry = ry * 0.62;
          const lx = cx + lr * Math.cos(s.mid);
          const ly = cy + lry * Math.sin(s.mid);
          return (
            <text
              key={`lbl-${s.id ?? i}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="select-none"
              style={{ fontSize: 11, fontWeight: 700, fill: '#0a1e1e' }}
              pointerEvents="none"
            >
              {s.percent}%
            </text>
          );
        })}
      </svg>

      {showLegend && (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 w-full max-w-xs">
          {slices.map((s, i) => {
            const isSelected = selectedId != null && s.id === selectedId;
            return (
              <li
                key={`leg-${s.id ?? i}`}
                onClick={() => onSliceClick && onSliceClick(s)}
                className={`flex items-center gap-2 text-xs ${onSliceClick ? 'cursor-pointer' : ''} ${isSelected ? 'text-white' : 'text-dark-text'}`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ background: s.color, boxShadow: isSelected ? `0 0 0 2px ${s.color}55` : 'none' }}
                />
                <span className="truncate">{s.label}</span>
                <span className="text-dark-muted ml-auto">{s.percent}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { PALETTE as PIE_PALETTE };
