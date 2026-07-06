import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiDroplet, FiCalendar, FiTrendingUp, FiInfo, FiArrowLeft, FiWifiOff } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { aiApi } from '../../services/api';
import { suggestCrops as suggestCropsLocal, SOIL_TYPES, SEASONS } from '../../services/aiService';

const guessSeason = () => {
  const m = new Date().getMonth();
  if (m <= 1 || m === 11) return 'winter';
  if (m <= 4) return 'spring';
  if (m <= 7) return 'summer';
  return 'autumn';
};

const FIELD_CARD =
  'rounded-2xl border border-light-border bg-white p-4 mt-2';

export default function CropSuggestions() {
  const { weather, farmerProfile } = useApp();
  const [form, setForm] = useState({
    soilType: farmerProfile?.soilType || 'loam',
    season: guessSeason(),
    region: farmerProfile?.location || '',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  // 'ai' when Gemini answered, 'local' when we fell back to the rule-based engine.
  const [source, setSource] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const inputs = { soilType: form.soilType, season: form.season, weather };
    try {
      // Real AI first — richer, location-aware reasoning.
      const data = await aiApi.suggestCrops({ ...inputs, location: form.region });
      const list = (data.suggestions || []).map((s) => ({
        name: s.name,
        score: s.score,
        reasons: Array.isArray(s.reasons) ? s.reasons : [],
        daysToHarvest: s.daysToHarvest,
        note: s.note,
      }));
      setResults(list);
      setSource('ai');
    } catch {
      // Offline / no key / rate-limited — fall back to the local ranking engine.
      const list = await suggestCropsLocal(inputs);
      setResults(list);
      setSource('local');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-light-muted hover:text-accent text-sm mb-5 no-underline transition-colors relative z-10"
      >
        <FiArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="mb-5 relative z-10">
        <h1 className="text-3xl md:text-4xl font-light text-light-text">AI Crop</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-accent">Suggestions</h2>
        <p className="text-light-muted text-sm mt-3 max-w-xl">
          Tell us your soil and season — we'll combine it with current weather to rank
          the crops most likely to thrive on your field.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        {/* Left: input form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 space-y-4">
          <div className={FIELD_CARD}>
            <label className="text-light-muted text-xs block mb-2">Soil Type</label>
            <select
              name="soilType"
              value={form.soilType}
              onChange={handleChange}
              className="w-full bg-transparent border-none outline-none text-light-text text-sm"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className={FIELD_CARD}>
            <label className="text-light-muted text-xs block mb-2">Season</label>
            <select
              name="season"
              value={form.season}
              onChange={handleChange}
              className="w-full bg-transparent border-none outline-none text-light-text text-sm"
            >
              {SEASONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className={FIELD_CARD}>
            <label className="text-light-muted text-xs block mb-2">Region (optional)</label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="e.g. Green Valley"
              className="w-full bg-transparent border-none outline-none text-light-text text-sm placeholder:text-light-muted"
            />
          </div>

          <div className={FIELD_CARD}>
            <p className="text-light-muted text-xs mb-2">Current weather (used by AI)</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-light-text text-sm">
              <span>{weather.temperature}°C</span>
              <span className="text-light-muted">·</span>
              <span>{weather.condition}</span>
              <span className="text-light-muted">·</span>
              <span>Humidity {weather.humidity}%</span>
              <span className="text-light-muted">·</span>
              <span>Rain {weather.rainfall}mm</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-accent text-white font-semibold text-sm hover:shadow-[0_10px_28px_rgba(22,163,74,0.4)] transition-all disabled:opacity-60 mt-3"
          >
            <FiZap size={18} />
            {loading ? 'Analyzing…' : 'Get AI Suggestions'}
          </button>
        </form>

        {/* Right: results */}
        <div className="lg:col-span-2 space-y-3">
          {!results && !loading && (
            <div className="rounded-3xl border border-light-border h-64 lg:h-80 bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
              <div className="text-center p-5">
                <span className="text-6xl block mb-3">🌱</span>
                <p className="text-light-muted text-sm">
                  Pick your soil & season, then run the AI to see ranked crop suggestions.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="rounded-3xl border border-light-border bg-white p-5 text-center">
              <div className="inline-block animate-pulse text-accent text-3xl mb-2">⚡</div>
              <p className="text-light-muted text-sm">AI scoring crops against your conditions…</p>
            </div>
          )}

          {results && results.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-light-muted text-xs uppercase tracking-wider">
                  Top {results.length} crops for your conditions
                </p>
                {source === 'ai' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCEEDD] text-[#2D5A3D]">
                    <FiZap size={10} /> AI-powered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5EFE0] text-[#6B5D4E]">
                    <FiWifiOff size={10} /> Offline estimate
                  </span>
                )}
              </div>
              {results.map((item, idx) => (
                <div key={item.name} className="rounded-2xl border border-light-border bg-white p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-accent text-sm font-mono shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-light-text text-base font-semibold truncate">{item.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-accent text-sm shrink-0">
                      <FiTrendingUp size={14} />
                      {item.score}
                    </div>
                  </div>

                  {item.reasons.length > 0 && (
                    <ul className="text-light-text text-xs space-y-1 mb-3 ml-7">
                      {item.reasons.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-light-muted text-xs ml-7">
                    {item.daysToHarvest != null && (
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} />
                        ~{item.daysToHarvest} days to harvest
                      </span>
                    )}
                    {item.wateringPerWeek != null && (
                      <span className="flex items-center gap-1">
                        <FiDroplet size={12} />
                        {item.wateringPerWeek}× watering / week
                      </span>
                    )}
                  </div>

                  {item.note && (
                    <div className="mt-3 ml-7 flex items-start gap-2 text-light-muted text-xs">
                      <FiInfo size={12} className="mt-0.5 shrink-0 text-accent/70" />
                      <span>{item.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
