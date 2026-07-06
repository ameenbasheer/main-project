import { useState, useEffect, useCallback } from 'react';
import {
  FiZap,
  FiRefreshCw,
  FiLoader,
  FiAlertCircle,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { aiApi } from '../../services/api';

const CACHE_KEY = 'grownroot_weather_advice';

// Visual treatment per verdict — good (green), caution (amber), bad (rose).
const VERDICTS = {
  good: {
    label: 'Good for your crops',
    Icon: FiCheckCircle,
    chip: 'bg-[#DCEEDD] text-[#2D5A3D]',
    ring: 'from-[#2D5A3D] to-[#1F4530]',
    dot: 'bg-[#2D5A3D]',
  },
  caution: {
    label: 'Watch the conditions',
    Icon: FiAlertTriangle,
    chip: 'bg-[#FFE8CC] text-[#A04F1C]',
    ring: 'from-[#C9821F] to-[#9A5F12]',
    dot: 'bg-[#A04F1C]',
  },
  bad: {
    label: 'Risky for your crops',
    Icon: FiXCircle,
    chip: 'bg-[#FFE3EC] text-[#A23368]',
    ring: 'from-[#A23368] to-[#7A2750]',
    dot: 'bg-[#A23368]',
  },
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// Refetch when crops/stages or today's weather meaningfully change — not on every render.
function buildSignature(crops, weather) {
  const cropSig = crops.map((c) => `${c.id}:${c.currentStage}`).join(',');
  return `${todayKey()}|${weather.temperature}|${weather.condition}|${weather.rainfall}|${cropSig}`;
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || null;
  } catch {
    return null;
  }
}

export default function WeatherAdvisor() {
  const { crops, weather, farmerProfile } = useApp();
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvice = useCallback(
    async (signature, { force = false } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await aiApi.weatherAdvice({
          weather,
          crops: crops.map((c) => ({ name: c.name, currentStage: c.currentStage })),
          location: farmerProfile?.location || '',
          soilType: farmerProfile?.soilType || '',
        });
        setAdvice(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ signature, data }));
      } catch (err) {
        setError(err.message || 'Could not load the weather advisory.');
        if (force) return;
      } finally {
        setLoading(false);
      }
    },
    [crops, weather, farmerProfile],
  );

  useEffect(() => {
    // Need real weather before we can advise on it.
    if (weather.temperature == null) return;
    const signature = buildSignature(crops, weather);
    const cached = readCache();
    if (cached?.signature === signature) {
      setAdvice(cached.data);
    } else {
      fetchAdvice(signature);
    }
  }, [crops, weather, fetchAdvice]);

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);
    fetchAdvice(buildSignature(crops, weather), { force: true });
  };

  if (weather.temperature == null) return null;

  const verdict = VERDICTS[advice?.verdict] || VERDICTS.caution;
  const VerdictIcon = verdict.Icon;

  return (
    <section className="rounded-3xl border border-light-border bg-white overflow-hidden relative mt-3">
      <div
        aria-hidden
        className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.10), transparent 70%)' }}
      />
      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${verdict.ring} text-white grid place-items-center shrink-0`}>
              <FiZap size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-light-text font-bold text-lg leading-tight">AI Weather Advisor</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#DCEEDD] text-[#2D5A3D]">
                  AI
                </span>
              </div>
              <p className="text-light-muted text-xs mt-1 truncate">
                Is today's weather good or bad for what you're growing?
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="shrink-0 inline-flex items-center gap-2 text-accent text-xs font-semibold px-3 py-2 rounded-full border border-light-border hover:bg-accent/5 transition disabled:opacity-50"
          >
            <FiRefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading && !advice && (
          <div className="flex items-center justify-center gap-2 text-light-muted text-sm py-8">
            <FiLoader size={16} className="animate-spin" />
            Reading the weather against your crops…
          </div>
        )}

        {error && !advice && (
          <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-red-700 text-xs">
            <FiAlertCircle className="mt-1 shrink-0" size={14} />
            <span>{error}</span>
          </div>
        )}

        {advice && (
          <div className="space-y-5">
            {/* Overall verdict */}
            <div className="flex items-start gap-3 rounded-2xl border border-light-border bg-light-bg/60 p-4">
              <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${verdict.chip}`}>
                <VerdictIcon size={18} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${verdict.chip}`}>
                    {verdict.label}
                  </span>
                </div>
                {advice.headline && (
                  <p className="text-light-text font-semibold text-sm mt-2">{advice.headline}</p>
                )}
                {advice.summary && (
                  <p className="text-light-muted text-xs mt-1 leading-relaxed">{advice.summary}</p>
                )}
              </div>
            </div>

            {/* Per-crop verdicts */}
            {advice.crops?.length > 0 && (
              <div>
                <p className="text-light-muted text-xs uppercase tracking-wider mb-2 mt-5">Your crops</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {advice.crops.map((c, i) => {
                    const v = VERDICTS[c.verdict] || VERDICTS.caution;
                    const Icon = v.Icon;
                    return (
                      <div key={`${c.name}-${i}`} className="rounded-2xl border border-light-border bg-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-6 h-6 rounded-lg grid place-items-center shrink-0 ${v.chip}`}>
                            <Icon size={13} />
                          </span>
                          <h4 className="text-light-text font-semibold text-sm truncate">{c.name}</h4>
                        </div>
                        {c.note && <p className="text-light-muted text-xs leading-snug">{c.note}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Precautions + tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {advice.precautions?.length > 0 && (
                <div className="rounded-2xl border border-light-border bg-light-bg/60 p-4">
                  <p className="flex items-center gap-2 text-light-text font-semibold text-sm mb-3">
                    <FiShield size={15} className="text-accent" /> Precautions
                  </p>
                  <ul className="space-y-2">
                    {advice.precautions.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-light-muted text-xs leading-snug">
                        <span className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {advice.tips?.length > 0 && (
                <div className="rounded-2xl border border-light-border bg-light-bg/60 p-4">
                  <p className="flex items-center gap-2 text-light-text font-semibold text-sm mb-3">
                    <FiZap size={15} className="text-accent" /> Smart ideas
                  </p>
                  <ul className="space-y-2">
                    {advice.tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-light-muted text-xs leading-snug">
                        <span className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
