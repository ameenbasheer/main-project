import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiDroplet,
  FiInfo,
  FiPlus,
  FiSave,
  FiUpload,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { GiPlantSeed } from 'react-icons/gi';
import { useApp } from '../../context/AppContext';
import { CROP_STAGES } from '../../reducers/appReducer';
import { analyzeCrop } from '../../services/aiService';
import Images from '../../assets/images';

const CROP_CATALOG = [
  { name: 'Tomatoes', image: Images.tomato },
  { name: 'Lettuce', image: Images.lettuse },
  { name: 'Carrot', image: Images.carrot },
  { name: 'Onion', image: Images.onion },
  { name: 'Potato', image: Images.potato },
  { name: 'Spinach', image: Images.spinach },
  { name: 'Brinjal', image: Images.brinjal },
  { name: 'Capsicum', image: Images.capsicum },
  { name: 'Cucumber', image: Images.cucumber },
  { name: 'Green Beans', image: Images.beans },
];

const FIELD =
  'w-full bg-white border border-light-border focus:border-accent rounded-2xl px-4 py-3 text-light-text text-sm outline-none transition placeholder:text-light-muted';

export default function AddCrop() {
  const { crops, addCrop } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const usedPercent = useMemo(
    () => crops.reduce((s, c) => s + (Number(c.areaPercent) || 0), 0),
    [crops],
  );
  const remaining = Math.max(0, 100 - usedPercent);

  const [form, setForm] = useState({
    name: '',
    image: null,
    imagePreview: null,
    isCustom: false,
    currentStage: CROP_STAGES[0],
    areaPercent: '',
    plantingDate: new Date().toISOString().slice(0, 10),
    harvestingDate: '',
    field: '',
  });
  const [insights, setInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [error, setError] = useState('');

  const pickCatalog = (crop) => {
    setForm((f) => ({
      ...f,
      name: crop.name,
      image: crop.image,
      imagePreview: crop.image,
      isCustom: false,
    }));
    setError('');
  };

  const startCustom = () => {
    setForm((f) => ({
      ...f,
      name: '',
      image: null,
      imagePreview: null,
      isCustom: true,
    }));
    setError('');
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result, imagePreview: reader.result, isCustom: true }));
    };
    reader.readAsDataURL(file);
  };

  const handleAiAssist = async () => {
    if (!form.name.trim() || !form.plantingDate) {
      setAiError('Pick a crop and a planting date first.');
      return;
    }
    setAiError('');
    setAiLoading(true);
    const result = await analyzeCrop({ name: form.name, plantedDate: form.plantingDate });
    setInsights(result);
    if (result.harvestIso && !form.harvestingDate) {
      setForm((f) => ({ ...f, harvestingDate: result.harvestIso }));
    }
    setAiLoading(false);
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pct = Number(form.areaPercent);
    if (!form.name.trim()) return setError('Crop name is required.');
    if (!pct || pct <= 0) return setError('Enter the area percentage.');
    if (pct > remaining) return setError(`Only ${remaining}% of your land is available.`);
    if (!form.plantingDate) return setError('Pick a planting date.');

    const planted = new Date(form.plantingDate);
    const harvest = form.harvestingDate ? new Date(form.harvestingDate) : null;
    const plantedLabel = !isNaN(planted.getTime())
      ? planted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '';
    const harvestLabel = harvest && !isNaN(harvest.getTime())
      ? harvest.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '';

    setError('');
    setSaving(true);
    try {
      await addCrop({
        name: form.name.trim(),
        image: form.image,
        currentStage: form.currentStage,
        status: form.currentStage === 'Harvested' ? 'Harvested' : 'Active',
        areaPercent: pct,
        plantingDate: form.plantingDate,
        harvestingDate: form.harvestingDate || '',
        plantedDate: plantedLabel,
        harvestDate: harvestLabel,
        field: form.field.trim(),
        notes: '',
        aiSuggestion: insights?.note || '',
      });
      navigate('/dashboard/crops');
    } catch (err) {
      setError(err.message || 'Could not save crop. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      <Link
        to="/dashboard/crops"
        className="inline-flex items-center gap-2 text-light-muted hover:text-accent text-sm mb-5 no-underline transition-colors"
      >
        <FiArrowLeft size={16} />
        Back to Crops
      </Link>

      <div className="mb-5">
        <h1 className="text-3xl md:text-4xl font-light text-light-text">Add New</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-accent">Crop</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Allocation bar */}
        <div className="rounded-3xl border border-light-border bg-white p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-light-muted text-[11px] uppercase tracking-[0.2em] font-semibold">
              Land allocation
            </p>
            <p className="text-xs text-light-muted">
              <span className="text-accent font-semibold">{usedPercent}%</span> used · {remaining}% left
            </p>
          </div>
          <div className="h-1 bg-light-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${Math.min(100, usedPercent)}%` }}
            />
          </div>
        </div>

        {/* Catalog picker */}
        <div className="rounded-3xl border border-light-border bg-white p-4 mb-3">
          <p className="text-light-muted text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">
            Pick a crop
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {CROP_CATALOG.map((c) => {
              const selected = form.name === c.name && !form.isCustom;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => pickCatalog(c)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 ${selected
                    ? 'border-accent shadow-[0_10px_28px_rgba(22,163,74,0.35)] scale-[1.04]'
                    : 'border-transparent hover:border-accent/40 hover:-translate-y-0.5'
                    }`}
                >
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                    <p className="text-white text-xs font-semibold text-left">{c.name}</p>
                  </div>
                  {selected && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shadow-md">
                      <FiCheck size={14} />
                    </span>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={startCustom}
              className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-200 ${form.isCustom
                ? 'border-accent text-accent bg-accent/10 scale-[1.04]'
                : 'border-light-border text-light-muted hover:border-accent/50 hover:text-accent hover:-translate-y-0.5'
                }`}
            >
              <FiPlus size={24} />
              <span className="text-xs font-medium">Custom</span>
            </button>
          </div>

          {form.isCustom && (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-light-border hover:border-accent/60 flex flex-col items-center justify-center gap-0.5 text-light-muted hover:text-accent transition shrink-0 overflow-hidden"
              >
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <FiUpload size={16} />
                    <span className="text-[9px]">Upload</span>
                  </>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Crop name"
                className={FIELD}
              />
            </div>
          )}
        </div>

        {/* Current stage */}
        <div className="rounded-3xl border border-light-border bg-white p-4 mb-3">
          <p className="text-light-muted text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">
            Current stage
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CROP_STAGES.map((stage) => {
              const sel = form.currentStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setForm({ ...form, currentStage: stage })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${sel
                    ? 'bg-accent text-white border-accent'
                    : 'bg-transparent text-light-text border-light-border hover:border-accent/60'
                    }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* Area % */}
        <div className="rounded-3xl border border-light-border bg-white p-4 mb-3">
          <p className="text-light-muted text-[11px] uppercase tracking-[0.2em] font-semibold mb-2">
            Area % of farm
          </p>
          <div className="flex items-baseline gap-3 rounded-2xl border border-light-border focus-within:border-accent bg-white px-4 py-2">
            <input
              type="number"
              min="0"
              max={remaining}
              step="1"
              value={form.areaPercent}
              onChange={(e) => setForm({ ...form, areaPercent: e.target.value })}
              placeholder="0"
              className="flex-1 bg-transparent border-none outline-none text-light-text text-3xl font-bold placeholder:text-light-muted/40 tabular-nums min-w-0"
            />
            <span className="text-light-muted text-base">%</span>
          </div>
          <p className="text-light-muted text-[11px] mt-2">Up to {remaining}% available.</p>
        </div>

        {/* Dates + Field */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div className="rounded-3xl border border-light-border bg-white p-4">
            <label className="text-light-muted text-[11px] uppercase tracking-[0.2em] font-semibold block mb-2">
              Planting date
            </label>
            <input
              type="date"
              value={form.plantingDate}
              onChange={(e) => setForm({ ...form, plantingDate: e.target.value })}
              className="w-full bg-transparent border-none outline-none text-light-text text-sm"
              required
            />
          </div>
          <div className="rounded-3xl border border-light-border bg-white p-4">
            <label className="text-light-muted text-[11px] uppercase tracking-[0.2em] font-semibold block mb-2">
              Expected harvest
            </label>
            <input
              type="date"
              value={form.harvestingDate}
              onChange={(e) => setForm({ ...form, harvestingDate: e.target.value })}
              className="w-full bg-transparent border-none outline-none text-light-text text-sm"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-light-border bg-white p-4 mb-3">
          <label className="text-light-muted text-[11px] uppercase tracking-[0.2em] font-semibold block mb-2">
            Field (optional)
          </label>
          <input
            type="text"
            value={form.field}
            onChange={(e) => setForm({ ...form, field: e.target.value })}
            placeholder="e.g. Field A"
            className="w-full bg-transparent border-none outline-none text-light-text text-sm placeholder:text-light-muted"
          />
        </div>

        {/* AI assist */}
        <button
          type="button"
          onClick={handleAiAssist}
          disabled={aiLoading}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-accent/40 text-accent font-semibold text-sm hover:bg-accent hover:text-white transition-all disabled:opacity-60 mb-3"
        >
          <FiZap size={16} />
          {aiLoading ? 'AI analyzing…' : 'AI: estimate harvest, growth stages & watering'}
        </button>

        {aiError && <p className="text-red-500 text-xs text-center">{aiError}</p>}

        {insights && (
          <div className="rounded-3xl border border-accent/30 bg-white p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FiZap className="text-accent" size={14} />
              <span className="text-light-text text-sm font-semibold">AI Insights</span>
              {!insights.matched && (
                <span className="text-light-muted text-xs">(generic estimate)</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-light-text">
                <FiCalendar className="text-accent" size={12} />
                Harvest by {insights.harvestDate}
              </div>
              <div className="flex items-center gap-2 text-light-text">
                <FiDroplet className="text-accent" size={12} />
                Water {insights.wateringPerWeek}× per week
              </div>
            </div>

            <div>
              <p className="text-light-muted text-xs uppercase tracking-wider mb-2">Growth stages</p>
              <ol className="space-y-1">
                {insights.stages.map((stage, i) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <span className="text-light-text">
                      {i + 1}. {stage.name}
                    </span>
                    <span className="text-light-muted">until {stage.endDate}</span>
                  </li>
                ))}
              </ol>
            </div>

            {insights.note && (
              <div className="flex items-start gap-2 text-light-muted text-xs pt-2 border-t border-light-border">
                <FiInfo size={12} className="mt-0.5 shrink-0 text-accent/70" />
                <span>{insights.note}</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200">
            <FiX className="text-red-500 shrink-0" size={16} />
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-accent text-white font-semibold text-base hover:shadow-[0_10px_28px_rgba(22,163,74,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <FiSave size={18} />
          {saving ? 'Saving…' : 'Save Crop'}
        </button>
      </form>

      {/* Empty-state seedling hint */}
      {crops.length === 0 && (
        <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-accent/5 border border-accent/20">
          <GiPlantSeed className="text-accent" size={18} />
          <p className="text-light-text text-xs">
            This is your first crop. Allocations and dates will appear on your dashboard, calendar and pie chart.
          </p>
        </div>
      )}
    </div>
  );
}
