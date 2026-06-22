export default function StatsCard({ number, label, value, subtitle, icon, accent = false }) {
  return (
    <div className="glass-card stat-card p-5">
      {number && (
        <span className="text-accent text-xs font-semibold mb-2 block">{number}</span>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-bold text-base">{label}</h3>
          {subtitle && <p className="text-accent text-xs mt-1">{subtitle}</p>}
        </div>
        {value && (
          <span className={`font-bold text-lg ${accent ? 'text-accent' : 'text-white'}`}>
            {value}
          </span>
        )}
        {icon && (
          <span className="text-accent text-xl">{icon}</span>
        )}
      </div>
    </div>
  );
}
