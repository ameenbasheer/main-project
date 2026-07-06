import { useState, useEffect, useCallback } from 'react';
import {
  FiZap,
  FiDroplet,
  FiSun,
  FiSearch,
  FiScissors,
  FiFeather,
  FiShoppingBag,
  FiEye,
  FiWind,
  FiRefreshCw,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { aiApi } from '../../services/api';

const CACHE_KEY = 'grownroot_daily_plan';

// Map each AI action to an icon. Unknown actions fall back to the inspect eye.
const ACTION_ICONS = {
  water: FiDroplet,
  'skip-watering': FiDroplet,
  weed: FiScissors,
  'scout-pests': FiSearch,
  'protect-heat': FiSun,
  'protect-cold': FiWind,
  fertilize: FiFeather,
  harvest: FiShoppingBag,
  inspect: FiEye,
};

const PRIORITY_STYLES = {
  high: { dot: 'bg-[#A23368]', chip: 'bg-[#FFE3EC] text-[#A23368]' },
  medium: { dot: 'bg-[#A04F1C]', chip: 'bg-[#FFE0CC] text-[#A04F1C]' },
  low: { dot: 'bg-[#2D5A3D]', chip: 'bg-[#DCEEDD] text-[#2D5A3D]' },
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// A signature that changes when the plan's inputs meaningfully change, so we
// refetch when crops/stages or the day's weather shift — but not on every render.
function buildSignature(crops, weather) {
  const cropSig = crops.map((c) => `${c.id}:${c.currentStage}`).join(',');
  return `${todayKey()}|${weather.temperature}|${weather.condition}|${cropSig}`;
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || null;
  } catch {
    return null;
  }
}

export default function TodayPlan() {
  const { crops, weather, farmerProfile } = useApp();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlan = useCallback(
    async (signature, { force = false } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await aiApi.dailyPlan({
          crops: crops.map((c) => ({
            name: c.name,
            currentStage: c.currentStage,
            plantingDate: c.plantingDate,
            field: c.field,
          })),
          weather,
          location: farmerProfile?.location || '',
          soilType: farmerProfile?.soilType || '',
        });
        setPlan(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ signature, data }));
      } catch (err) {
        setError(err.message || 'Could not load today’s plan.');
        // Keep showing stale cached data on a refresh failure.
        if (force) return;
      } finally {
        setLoading(false);
      }
    },
    [crops, weather, farmerProfile],
  );

  useEffect(() => {
    if (!crops.length) {
      setPlan(null);
      return;
    }
    const signature = buildSignature(crops, weather);
    const cached = readCache();
    if (cached?.signature === signature) {
      setPlan(cached.data);
    } else {
      fetchPlan(signature);
    }
  }, [crops, weather, fetchPlan]);

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);
    fetchPlan(buildSignature(crops, weather), { force: true });
  };

  // Don't render the card at all until the farmer has crops to plan for.
  if (!crops.length) return null;

  return (
    <section className="mb-5 rounded-3xl border border-[#E8DCC4] bg-white overflow-hidden relative">
      <div
        aria-hidden
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(45,90,61,0.10), transparent 70%)' }}
      />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2D5A3D] to-[#1F4530] text-white grid place-items-center shrink-0">
              <FiZap size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[#0E2A18] font-bold text-lg leading-tight">Today’s plan</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCEEDD] text-[#2D5A3D]">
                  AI
                </span>
              </div>
              <p className="text-[#6B5D4E] text-xs mt-0.5">
                {plan?.summary || 'Tailored to your crops, soil & today’s weather'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="shrink-0 inline-flex items-center gap-1.5 text-[#2D5A3D] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E8DCC4] hover:bg-[#F5EFE0] transition disabled:opacity-50"
          >
            <FiRefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading && !plan && (
          <div className="flex items-center gap-2 text-[#6B5D4E] text-sm py-6 justify-center">
            <FiLoader size={16} className="animate-spin" />
            Reading the weather and your fields…
          </div>
        )}

        {error && !plan && (
          <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-red-700 text-xs">
            <FiAlertCircle className="mt-0.5 shrink-0" size={14} />
            <span>{error}</span>
          </div>
        )}

        {plan?.plans?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.plans.map((cropPlan, i) => (
              <div
                key={`${cropPlan.crop}-${i}`}
                className="rounded-2xl border border-[#E8DCC4] bg-[#FAF7F0] p-4"
              >
                <h3 className="text-[#0E2A18] font-semibold text-sm mb-3">{cropPlan.crop}</h3>
                <ul className="space-y-2.5">
                  {(cropPlan.tasks || []).map((task, j) => {
                    const Icon = ACTION_ICONS[task.action] || FiEye;
                    const styles = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
                    return (
                      <li key={j} className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 w-7 h-7 rounded-lg grid place-items-center shrink-0 ${styles.chip}`}
                        >
                          <Icon size={14} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[#0E2A18] text-sm font-medium leading-snug">
                            {task.label}
                          </p>
                          {task.reason && (
                            <p className="text-[#6B5D4E] text-xs mt-0.5 leading-snug">
                              {task.reason}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
