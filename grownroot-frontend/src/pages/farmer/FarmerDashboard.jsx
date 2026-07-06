import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiArrowRight,
  FiCalendar,
  FiSun,
  FiDroplet,
  FiCloudRain,
  FiTrendingUp,
  FiPlus,
  FiShoppingBag,
  FiAlertTriangle,
  FiActivity,
  FiZap,
  FiCamera,
  FiGrid,
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import PieChart3D, { PIE_PALETTE } from '../../components/common/PieChart3D';
import TodayPlan from '../../components/dashboard/TodayPlan';

const STAGE_COLORS = {
  'Seed prep': 'bg-[#EFE9D8] text-[#6B5D4E] border border-[#E8DCC4]',
  Sowing: 'bg-[#FFF1DA] text-[#A56A1A] border border-[#F2D9A8]',
  Germination: 'bg-[#E8F5D9] text-[#5C7A2A] border border-[#D2E6B0]',
  Vegetative: 'bg-[#DCEEDD] text-[#2D5A3D] border border-[#BBDDC0]',
  Flowering: 'bg-[#FFE3EC] text-[#A23368] border border-[#F4C2D2]',
  Fruiting: 'bg-[#FFE0CC] text-[#A04F1C] border border-[#F4C3A1]',
  Maturity: 'bg-[#D9F0E5] text-[#1E6A4B] border border-[#B7DECB]',
  Harvested: 'bg-[#E5E1D6] text-[#5F5648] border border-[#D2CCBC]',
};

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function CropTile({ crop }) {
  const now = new Date();
  const planted = crop.plantingDate ? new Date(crop.plantingDate) : null;
  const harvest = crop.harvestingDate ? new Date(crop.harvestingDate) : null;

  let progress = 0;
  let daysLeft = null;
  if (planted && harvest && !isNaN(planted) && !isNaN(harvest)) {
    const total = daysBetween(planted, harvest);
    const elapsed = daysBetween(planted, now);
    progress = total > 0 ? Math.max(0, Math.min(100, Math.round((elapsed / total) * 100))) : 0;
    daysLeft = daysBetween(now, harvest);
  }

  const stageClass = STAGE_COLORS[crop.currentStage] || STAGE_COLORS['Vegetative'];

  return (
    <Link
      to={`/dashboard/crops/${crop.id}`}
      className="group relative overflow-hidden rounded-2xl border border-[#E8DCC4] bg-white hover:border-[#2D5A3D]/40 hover:-translate-y-0.5 transition-all no-underline block"
      style={{ boxShadow: '0 1px 2px rgba(45,90,61,0.04)' }}
    >
      <div className="flex gap-4 p-4">
        <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-[#E8DCC4]">
          {crop.image ? (
            <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#F5EFE0]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-[#0E2A18] font-semibold text-base truncate">{crop.name}</h4>
              <p className="text-[#6B5D4E] text-xs truncate">{crop.field || '—'}</p>
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${stageClass}`}>
              {crop.currentStage}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-[#6B5D4E] mb-1">
              <span>Growth</span>
              <span className="text-[#2D5A3D] font-semibold">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#F0E9D8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #4A7C59, #2D5A3D)',
                }}
              />
            </div>
          </div>

          {daysLeft !== null && (
            <p className="text-[11px] mt-2 text-[#6B5D4E]">
              {daysLeft <= 0 ? (
                <span className="text-[#2D5A3D] font-semibold">Ready to harvest</span>
              ) : (
                <>
                  <span className="text-[#A04F1C] font-semibold">{daysLeft}d</span> until harvest
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

const SECTIONS = [
  {
    to: '/dashboard/crops',
    label: 'Manage crops',
    desc: 'Fields, stages & growth',
    icon: FiGrid,
    bg: 'bg-[#DCEEDD]',
    text: 'text-[#2D5A3D]',
    iconBg: 'bg-[#2D5A3D]',
  },
  {
    to: '/dashboard/calendar',
    label: 'Calendar',
    desc: 'Plan & track tasks',
    icon: FiCalendar,
    bg: 'bg-[#DDE9EE]',
    text: 'text-[#2E6076]',
    iconBg: 'bg-[#2E6076]',
  },
  {
    to: '/dashboard/suggest',
    label: 'AI suggestions',
    desc: 'What to plant next',
    icon: FiZap,
    bg: 'bg-[#FFE0CC]',
    text: 'text-[#A04F1C]',
    iconBg: 'bg-[#C4885F]',
  },
  {
    to: '/dashboard/disease',
    label: 'Disease scan',
    desc: 'Detect leaf issues',
    icon: FiCamera,
    bg: 'bg-[#F5E6D3]',
    text: 'text-[#8B5E2B]',
    iconBg: 'bg-[#8B5E2B]',
  },
  {
    to: '/dashboard/weather',
    label: 'Weather',
    desc: 'Forecast & alerts',
    icon: FiCloudRain,
    bg: 'bg-[#E8F5D9]',
    text: 'text-[#5C7A2A]',
    iconBg: 'bg-[#5C7A2A]',
  },
  {
    to: '/marketplace',
    label: 'Marketplace',
    desc: 'Sell your produce',
    icon: FiShoppingBag,
    bg: 'bg-[#FFE3EC]',
    text: 'text-[#A23368]',
    iconBg: 'bg-[#A23368]',
  },
];

function SectionTile({ section }) {
  const { to, label, desc, icon: Icon, bg, text, iconBg } = section;
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-3xl border border-[#E8DCC4] ${bg} p-4 flex flex-col gap-3 no-underline hover:-translate-y-1 transition-transform`}
      style={{ boxShadow: '0 2px 8px rgba(45,90,61,0.05)' }}
    >
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-2xl ${iconBg} text-white grid place-items-center`}>
          <Icon size={20} />
        </div>
        <FiArrowRight
          size={16}
          className={`${text} opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}
        />
      </div>
      <div>
        <p className={`font-bold text-base ${text} leading-tight`}>{label}</p>
        <p className="text-[#6B5D4E] text-xs mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}

function KpiCard({ icon, label, value, tone = 'green' }) {
  const tones = {
    green: { bg: 'bg-[#DCEEDD]', text: 'text-[#2D5A3D]' },
    terracotta: { bg: 'bg-[#FFE0CC]', text: 'text-[#A04F1C]' },
    cream: { bg: 'bg-[#F5EFE0]', text: 'text-[#6B5D4E]' },
    sky: { bg: 'bg-[#DDE9EE]', text: 'text-[#2E6076]' },
  }[tone];

  return (
    <div className="rounded-2xl bg-white border border-[#E8DCC4] p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl grid place-items-center ${tones.bg} ${tones.text} shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[#6B5D4E] text-[10px] uppercase tracking-wider font-medium">{label}</p>
        <p className="text-[#0E2A18] font-bold text-xl leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  const { crops, products, farmerProfile, weather } = useApp();
  const { user } = useAuth();

  const allocated = crops.reduce((sum, c) => sum + (Number(c.areaPercent) || 0), 0);
  const pieData = crops.map((c, i) => ({
    id: c.id,
    label: c.name,
    value: Number(c.areaPercent) || 0,
    color: PIE_PALETTE[i % PIE_PALETTE.length],
  }));
  if (allocated < 100) {
    pieData.push({ id: 'unused', label: 'Unused', value: 100 - allocated, color: '#D2CCBC' });
  }

  const upcomingHarvests = crops
    .filter((c) => c.harvestingDate)
    .map((c) => ({ ...c, _d: new Date(c.harvestingDate) }))
    .filter((c) => !isNaN(c._d.getTime()) && c._d >= new Date())
    .sort((a, b) => a._d - b._d)
    .slice(0, 4);

  const readyToHarvest = crops.filter(
    (c) => c.harvestingDate && new Date(c.harvestingDate) <= new Date(Date.now() + 7 * 86400000)
  ).length;

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative stagger-children">
      {/* Greeting strip */}
      <section className="mb-5 rounded-3xl overflow-hidden border border-[#E8DCC4] bg-light-bg p-5 relative">
        <div
          aria-hidden
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,136,95,0.18), transparent 70%)' }}
        />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[#A04F1C] text-[11px] font-semibold tracking-widest uppercase mb-2">
              {today}
            </p>
            <h1 className="text-3xl md:text-4xl font-light text-[#0E2A18] leading-tight">
              Hello, <span className="font-bold text-[#2D5A3D]">{firstName}</span>
              <span className="text-[#A04F1C]">.</span>
            </h1>
            {farmerProfile?.location ? (
              <p className="text-[#6B5D4E] text-sm mt-2 inline-flex items-center gap-1.5">
                <FiMapPin size={13} className="text-[#A04F1C]" />
                {farmerProfile.location} · {farmerProfile.totalArea} {farmerProfile.areaUnit}
                {Number(farmerProfile.totalArea) === 1 ? '' : 's'}
              </p>
            ) : (
              <p className="text-[#6B5D4E] text-sm mt-2">Let's check on your fields today.</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 pt-2 rounded-2xl bg-white border border-[#E8DCC4]">
              <div className="w-9 h-9 rounded-full bg-[#FFE0CC] text-[#A04F1C] grid place-items-center">
                <FiSun size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6B5D4E] font-medium">
                  Now
                </p>
                <p className="text-[#0E2A18] font-bold text-base leading-tight">
                  {weather.temperature}° <span className="text-[#6B5D4E] font-normal text-xs">· {weather.condition}</span>
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/crops/add"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#2D5A3D] text-white font-semibold text-sm hover:bg-[#1F4530] transition no-underline shadow-[0_6px_16px_rgba(45,90,61,0.25)]"
            >
              <FiPlus size={16} /> Add crop
            </Link>
          </div>
        </div>
      </section>

      {/* AI: today's plan per crop */}
      <TodayPlan />

      {/* Section tiles — primary navigation */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[#0E2A18] font-bold text-lg">Where to next?</h2>
            <p className="text-[#6B5D4E] text-xs">Jump into any part of your farm</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SECTIONS.map((s) => (
            <SectionTile key={s.to} section={s} />
          ))}
        </div>
      </section>

      {/* KPI row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard icon={<FiSun size={20} />} label="Active crops" value={crops.length} tone="green" />
        <KpiCard icon={<FiShoppingBag size={20} />} label="Listings" value={products.length} tone="cream" />
        <KpiCard icon={<FiTrendingUp size={20} />} label="Land used" value={`${allocated}%`} tone="sky" />
        <KpiCard icon={<FiCalendar size={20} />} label="Harvest in 7d" value={readyToHarvest} tone="terracotta" />
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Crops list */}
        <div className="lg:col-span-2 rounded-3xl border border-[#E8DCC4] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0E2A18] font-bold text-lg">Your fields</h3>
              <p className="text-[#6B5D4E] text-xs mt-0.5">Live stages and growth progress</p>
            </div>
            <Link
              to="/dashboard/crops"
              className="text-[#2D5A3D] text-xs inline-flex items-center gap-1 font-semibold hover:underline no-underline mb-5"
            >
              Manage all <FiArrowRight size={11} />
            </Link>
          </div>

          {crops.length === 0 ? (
            <div className="text-center py-5 rounded-2xl bg-[#F5EFE0]/60 border border-dashed border-[#E8DCC4]">
              <p className="text-[#6B5D4E] text-sm mb-3">No crops planted yet.</p>
              <Link
                to="/dashboard/crops/add"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D5A3D] text-white text-sm font-semibold no-underline hover:bg-[#1F4530] transition"
              >
                <FiPlus size={14} /> Add your first crop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {crops.map((c) => (
                <CropTile key={c.id} crop={c} />
              ))}
            </div>
          )}
        </div>

        {/* Today / Weather card */}
        <div className="rounded-3xl border border-[#E8DCC4] bg-gradient-to-br from-[#2D5A3D] to-[#1F4530] text-white p-5 flex flex-col relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-10 -right-10 w-44 h-44 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(196,136,95,0.35), transparent 70%)' }}
          />
          <div className="relative flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-lg">Today</h3>
            <span className="text-[#FFD9B8] text-xs font-medium px-2 py-1 rounded-full bg-white/10 border border-white/15">
              {weather.condition}
            </span>
          </div>

          <div className="relative flex items-end gap-3 mb-5">
            <span className="text-white text-6xl font-light leading-none">
              {weather.temperature}°
            </span>
            <span className="text-[#D7E5DA] text-xs pb-2">good for the field</span>
          </div>

          <div className="relative grid grid-cols-2 gap-2 mb-4">
            <div className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/10">
              <div className="flex items-center gap-1.5 text-[#D7E5DA] text-[11px] mb-0.5">
                <FiDroplet size={11} /> Humidity
              </div>
              <p className="text-white font-semibold text-sm">{weather.humidity}%</p>
            </div>
            <div className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/10">
              <div className="flex items-center gap-1.5 text-[#D7E5DA] text-[11px] mb-0.5">
                <FiCloudRain size={11} /> Rainfall
              </div>
              <p className="text-white font-semibold text-sm">{weather.rainfall}mm</p>
            </div>
          </div>

          <Link
            to="/dashboard/disease"
            className="relative mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#A04F1C] text-white text-sm font-semibold hover:bg-[#8B3F12] transition no-underline"
          >
            <FiAlertTriangle size={14} />
            Check disease status
          </Link>
        </div>
      </section>

      {/* Bottom row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Land allocation */}
        <div className="rounded-3xl border border-[#E8DCC4] bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[#0E2A18] font-bold text-base">Land allocation</h3>
              <p className="text-[#6B5D4E] text-xs mt-0.5">
                {allocated}% of {farmerProfile?.totalArea || 0} {farmerProfile?.areaUnit || 'acre'}
                {Number(farmerProfile?.totalArea) === 1 ? '' : 's'} used
              </p>
            </div>
            <Link
              to="/dashboard/crops"
              className="text-[#2D5A3D] mb-5 text-xs inline-flex items-center gap-1 font-semibold no-underline hover:underline"
            >
              Details <FiArrowRight size={11} />
            </Link>
          </div>
          <div className="flex justify-center">
            <PieChart3D data={pieData} size={220} depth={20} />
          </div>
        </div>

        {/* Upcoming harvests */}
        <div className="rounded-3xl border border-[#E8DCC4] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0E2A18] font-bold text-base">Upcoming harvests</h3>
              <p className="text-[#6B5D4E] text-xs mt-0.5">Next 4 scheduled</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#FFE0CC] text-[#A04F1C] grid place-items-center mb-5">
              <FiCalendar size={15} />
            </div>
          </div>

          {upcomingHarvests.length === 0 ? (
            <div className="text-center py-5 rounded-2xl bg-[#F5EFE0]/60 border border-dashed border-[#E8DCC4]">
              <p className="text-[#6B5D4E] text-sm">No harvests scheduled.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {upcomingHarvests.map((c) => {
                const daysLeft = daysBetween(new Date(), c._d);
                return (
                  <li
                    key={c.id}
                    className="flex  items-center gap-3 p-2 mt-2 rounded-2xl bg-[#FAF7F0] border border-[#E8DCC4] hover:border-[#2D5A3D]/40 transition"
                  >
                    <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#E8DCC4]">
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#F5EFE0]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0E2A18] text-sm font-semibold truncate">{c.name}</p>
                      <p className="text-[#6B5D4E] text-[11px]">
                        {c._d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-[#A04F1C] text-xs font-bold whitespace-nowrap px-2 py-1 rounded-full bg-[#FFE0CC]">
                      {daysLeft}d
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Insights / Tip */}
        <div className="rounded-3xl border border-[#E8DCC4] bg-gradient-to-br from-[#F5EFE0] to-[#EFE9D8] p-5 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(45,90,61,0.18), transparent 70%)' }}
          />
          <div className="relative flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0E2A18] font-bold text-base">Field insight</h3>
              <p className="text-[#6B5D4E] text-xs mt-0.5">Tailored for today</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#2D5A3D] text-white grid place-items-center mb-4">
              <FiActivity size={15} />
            </div>
          </div>

          <div className="relative">
            <p className="text-[#0E2A18] text-sm leading-relaxed mb-4">
              {weather.condition?.toLowerCase().includes('rain')
                ? 'Rain expected — hold back on irrigation today and check drainage in low-lying plots.'
                : weather.humidity > 70
                  ? 'High humidity raises fungal risk. Inspect leaves on leafy crops and prune for airflow.'
                  : weather.temperature > 32
                    ? 'Heat is up. Water in the early morning or evening to reduce evaporation losses.'
                    : 'Conditions are favorable. A good day to scout fields and update growth notes.'}
            </p>

            <Link
              to="/dashboard/suggest"
              className="inline-flex items-center gap-1.5 text-[#2D5A3D] text-xs font-semibold no-underline hover:gap-2 transition-all"
            >
              See AI suggestions <FiArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
