import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit3,
  FiSave,
  FiCalendar,
  FiDollarSign,
  FiPlus,
  FiZap,
  FiTrendingUp,
  FiTrendingDown,
  FiTrash2,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import { GiPlantSeed } from 'react-icons/gi';
import { useApp } from '../../context/AppContext';
import { CROP_STAGES } from '../../reducers/appReducer';
import { suggestCropImprovements } from '../../services/aiService';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Glassmorphism surfaces — translucent, blurred, soft inner highlight.
const CARD =
  'rounded-3xl border border-white/60 bg-white/45 backdrop-blur-xl p-5 shadow-[0_8px_32px_-8px_rgba(20,80,40,0.18)] ring-1 ring-white/40';
const INPUT =
  'w-full bg-white/50 backdrop-blur border border-white/60 focus:border-accent focus:bg-white/70 rounded-xl px-3 py-2 text-light-text text-sm outline-none placeholder:text-light-muted transition';

function StageProgress({ current }) {
  const idx = Math.max(0, CROP_STAGES.indexOf(current));
  const pct = ((idx + 1) / CROP_STAGES.length) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-light-muted mb-2">
        <span>{CROP_STAGES[0]}</span>
        <span className="text-accent font-semibold">{current}</span>
        <span>{CROP_STAGES[CROP_STAGES.length - 1]}</span>
      </div>
      <div className="h-2 bg-white/40 backdrop-blur rounded-full overflow-hidden ring-1 ring-white/50">
        <div
          className="h-full bg-gradient-to-r from-accent/70 to-accent shadow-[0_0_12px_rgba(22,163,74,0.5)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EditPanel({ crop, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: crop.name || '',
    currentStage: crop.currentStage || CROP_STAGES[0],
    areaPercent: crop.areaPercent || 0,
    plantingDate: crop.plantingDate || '',
    harvestingDate: crop.harvestingDate || '',
  });

  return (
    <div className="rounded-3xl border border-accent/40 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-light-text text-sm font-semibold">Edit crop</p>
        <button onClick={onCancel} className="text-light-muted hover:text-light-text">
          <FiX size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-light-muted text-xs block mb-2">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={INPUT}
          />
        </div>
        <div>
          <label className="text-light-muted text-xs block mb-2">Area %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.areaPercent}
            onChange={(e) => setForm({ ...form, areaPercent: e.target.value })}
            className={INPUT}
          />
        </div>
        <div>
          <label className="text-light-muted text-xs block mb-2">Planting date</label>
          <input
            type="date"
            value={form.plantingDate}
            onChange={(e) => setForm({ ...form, plantingDate: e.target.value })}
            className={INPUT}
          />
        </div>
        <div>
          <label className="text-light-muted text-xs block mb-2">Harvesting date</label>
          <input
            type="date"
            value={form.harvestingDate}
            onChange={(e) => setForm({ ...form, harvestingDate: e.target.value })}
            className={INPUT}
          />
        </div>
      </div>

      <div>
        <label className="text-light-muted text-xs block mb-2">Current stage</label>
        <div className="flex flex-wrap gap-2">
          {CROP_STAGES.map((stage) => {
            const sel = form.currentStage === stage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setForm({ ...form, currentStage: stage })}
                className={`px-3 py-2 rounded-full text-xs font-medium transition ${sel
                  ? 'bg-accent text-white'
                  : 'bg-white text-light-text border border-light-border hover:border-accent/40'
                  }`}
              >
                {stage}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full bg-white text-light-text text-xs border border-light-border hover:border-accent/40 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() =>
            onSave({
              ...form,
              areaPercent: Number(form.areaPercent),
              status: form.currentStage === 'Harvested' ? 'Harvested' : 'Active',
              plantedDate: form.plantingDate
                ? new Date(form.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '',
              harvestDate: form.harvestingDate
                ? new Date(form.harvestingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '',
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:shadow-[0_8px_24px_rgba(22,163,74,0.4)] transition"
        >
          <FiSave size={12} /> Save
        </button>
      </div>
    </div>
  );
}

export default function CropDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { crops, weather, updateCrop, deleteCrop, addCropExpense, addCropSale, updateCropNote } = useApp();
  const crop = crops.find((c) => String(c.id) === String(id));

  const [editing, setEditing] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ label: '', amount: '', date: '' });
  const [saleForm, setSaleForm] = useState({ label: '', amount: '', date: '' });
  const [noteDraft, setNoteDraft] = useState(crop?.notes || '');
  const [aiTips, setAiTips] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const totals = useMemo(() => {
    if (!crop) return { spent: 0, earned: 0, profit: 0 };
    const spent = (crop.expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const earned = (crop.sales || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
    return { spent, earned, profit: earned - spent };
  }, [crop]);

  if (!crop) {
    return (
      <div className="text-center py-5">
        <p className="text-light-muted mb-4">Crop not found.</p>
        <Link to="/dashboard/crops" className="text-accent">Back to crops</Link>
      </div>
    );
  }

  const handleSave = (changes) => {
    updateCrop(crop.id, changes);
    setEditing(false);
  };

  const advanceStage = () => {
    const idx = CROP_STAGES.indexOf(crop.currentStage);
    if (idx < 0 || idx >= CROP_STAGES.length - 1) return;
    const next = CROP_STAGES[idx + 1];
    updateCrop(crop.id, {
      currentStage: next,
      status: next === 'Harvested' ? 'Harvested' : 'Active',
    });
  };

  const submitExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.label.trim() || !Number(expenseForm.amount)) return;
    addCropExpense(crop.id, {
      label: expenseForm.label.trim(),
      amount: Number(expenseForm.amount),
      date: expenseForm.date || new Date().toISOString().slice(0, 10),
    });
    setExpenseForm({ label: '', amount: '', date: '' });
  };

  const submitSale = (e) => {
    e.preventDefault();
    if (!saleForm.label.trim() || !Number(saleForm.amount)) return;
    addCropSale(crop.id, {
      label: saleForm.label.trim(),
      amount: Number(saleForm.amount),
      date: saleForm.date || new Date().toISOString().slice(0, 10),
    });
    setSaleForm({ label: '', amount: '', date: '' });
  };

  const saveNote = () => {
    updateCropNote(crop.id, noteDraft);
  };

  const fetchAiTips = async () => {
    setAiLoading(true);
    const tips = await suggestCropImprovements({
      name: crop.name,
      currentStage: crop.currentStage,
      weather,
      notes: crop.notes,
    });
    setAiTips(tips);
    updateCrop(crop.id, { aiSuggestion: tips.join(' • ') });
    setAiLoading(false);
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete "${crop.name}"? This can't be undone.`)) return;
    deleteCrop(crop.id);
    navigate('/dashboard/crops');
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      <Link
        to="/dashboard/crops"
        className="inline-flex items-center gap-2 text-light-muted hover:text-accent text-sm mb-5 no-underline"
      >
        <FiArrowLeft size={16} /> Back to crops
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-5">
        <div className="md:col-span-1 rounded-3xl overflow-hidden border border-light-border h-56 md:h-85 bg-accent/10 relative">
          {crop.image ? (
            <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-accent">
              <GiPlantSeed size={64} />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-xs font-medium">{crop.currentStage || crop.status}</p>
          </div>
        </div>

        <div className="md:col-span-2 rounded-3xl border border-light-border bg-white p-4 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-light-muted text-xs uppercase tracking-wider">Crop</p>
              <h1 className="text-3xl md:text-4xl font-bold text-light-text">{crop.name}</h1>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing((e) => !e)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-accent/15 border border-accent/40 text-accent text-xs font-medium hover:bg-accent hover:text-white transition"
              >
                <FiEdit3 size={12} /> Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 rounded-full bg-white border border-light-border text-light-muted hover:text-red-500 hover:border-red-400/40 transition"
                aria-label="Delete crop"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Area</p>
              <p className="text-light-text text-sm font-semibold">{crop.areaPercent || 0}%</p>
            </div>
            <div>
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Status</p>
              <p className="text-light-text text-sm font-semibold">{crop.status}</p>
            </div>
            <div>
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Spent</p>
              <p className="text-light-text text-sm font-semibold">₹{totals.spent}</p>
            </div>
            <div>
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Earned</p>
              <p className="text-light-text text-sm font-semibold">₹{totals.earned}</p>
            </div>
          </div>

          <StageProgress current={crop.currentStage || CROP_STAGES[0]} />

          {crop.currentStage !== 'Harvested' && (
            <button
              type="button"
              onClick={advanceStage}
              className="self-start mt-4 inline-flex items-center gap-2 text-accent text-xs hover:underline"
            >
              <FiCheck size={12} /> Mark stage complete
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="mb-5">
          <EditPanel crop={crop} onSave={handleSave} onCancel={() => setEditing(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Dates */}
        <div className={CARD}>
          <div className="flex  gap-2 mb-3">
            <FiCalendar className="text-accent" size={16} />
            <p className="text-light-text text-sm font-semibold">Important dates</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-light-bg p-3 border border-light-border">
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Planting</p>
              <p className="text-light-text text-sm font-semibold mt-1">{formatDate(crop.plantingDate)}</p>
            </div>
            <div className="rounded-xl bg-light-bg p-3 border border-light-border">
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Harvesting</p>
              <p className="text-light-text text-sm font-semibold mt-1">{formatDate(crop.harvestingDate)}</p>
            </div>
          </div>
          <p className="text-light-muted text-[11px] mt-3">
            Dates show on your <Link to="/dashboard/calendar" className="text-accent hover:underline">farmer calendar</Link>.
          </p>
        </div>

        {/* AI suggestions */}
        <div className={CARD}>
          <div className="flex  justify-between mb-3">
            <div className="flex  gap-2">
              <FiZap className="text-accent" size={16} />
              <p className="text-light-text text-sm font-semibold">AI suggestions</p>
            </div>
            <button
              type="button"
              onClick={fetchAiTips}
              disabled={aiLoading}
              className="text-xs text-accent hover:underline disabled:opacity-50"
            >
              {aiLoading ? 'Thinking…' : aiTips.length ? 'Refresh' : 'Generate'}
            </button>
          </div>
          {aiTips.length === 0 && !crop.aiSuggestion && (
            <p className="text-light-muted text-xs">
              Click "Generate" to get tailored, stage-aware tips for this crop.
            </p>
          )}
          {(aiTips.length > 0 ? aiTips : crop.aiSuggestion ? crop.aiSuggestion.split(' • ') : []).map((tip, i) => (
            <div key={i} className="flex gap-2 mb-2 last:mb-0">
              <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
              <p className="text-light-text text-xs leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        {/* Expenses */}
        <div className={CARD}>
          <div className="flex justify-between mb-3">
            <div className="flex gap-2">
              <FiTrendingDown className="text-red-500" size={16} />
              <p className="text-light-text text-sm font-semibold">Expenses</p>
            </div>
            <p className="text-red-500 text-sm font-bold">₹{totals.spent}</p>
          </div>
          <ul className="space-y-2 mb-3 max-h-44 overflow-y-auto">
            {(crop.expenses || []).length === 0 && (
              <li className="text-light-muted text-xs">No expenses yet.</li>
            )}
            {(crop.expenses || []).map((e) => (
              <li key={e.id} className="flex items-center justify-between text-xs py-2 px-2 rounded-lg bg-light-bg">
                <div>
                  <p className="text-light-text">{e.label}</p>
                  <p className="text-light-muted text-[10px]">{formatDate(e.date)}</p>
                </div>
                <span className="text-red-500 font-medium">₹{e.amount}</span>
              </li>
            ))}
          </ul>
          <form onSubmit={submitExpense} className="grid grid-cols-12 gap-2">
            <input
              type="text"
              placeholder="Label"
              value={expenseForm.label}
              onChange={(e) => setExpenseForm({ ...expenseForm, label: e.target.value })}
              className="col-span-5 bg-white border border-light-border focus:border-accent rounded-lg px-3 py-2 text-light-text text-xs outline-none placeholder:text-light-muted"
            />
            <input
              type="number"
              placeholder="₹"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              className="col-span-3 bg-white border border-light-border focus:border-accent rounded-lg px-3 py-2 text-light-text text-xs outline-none placeholder:text-light-muted"
            />
            <input
              type="date"
              value={expenseForm.date}
              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
              className="col-span-3 bg-white border border-light-border focus:border-accent rounded-lg px-2 py-2 text-light-text text-xs outline-none"
            />
            <button
              type="submit"
              className="col-span-1 bg-accent text-white rounded-lg flex items-center justify-center hover:shadow-[0_4px_12px_rgba(22,163,74,0.35)] transition"
              aria-label="Add expense"
            >
              <FiPlus size={14} />
            </button>
          </form>
        </div>

        {/* Sales */}
        <div className={CARD}>
          <div className="flex justify-between mb-3">
            <div className="flex gap-2">
              <FiTrendingUp className="text-accent" size={16} />
              <p className="text-light-text text-sm font-semibold">Sales</p>
            </div>
            <p className="text-accent text-sm font-bold">₹{totals.earned}</p>
          </div>
          <ul className="space-y-2 mb-3 max-h-44 overflow-y-auto">
            {(crop.sales || []).length === 0 && (
              <li className="text-light-muted text-xs">No sales yet.</li>
            )}
            {(crop.sales || []).map((e) => (
              <li key={e.id} className="flex items-center justify-between text-xs py-2 px-2 rounded-lg bg-light-bg">
                <div>
                  <p className="text-light-text">{e.label}</p>
                  <p className="text-light-muted text-[10px]">{formatDate(e.date)}</p>
                </div>
                <span className="text-accent font-medium">₹{e.amount}</span>
              </li>
            ))}
          </ul>
          <form onSubmit={submitSale} className="grid grid-cols-12 gap-2">
            <input
              type="text"
              placeholder="Buyer / channel"
              value={saleForm.label}
              onChange={(e) => setSaleForm({ ...saleForm, label: e.target.value })}
              className="col-span-5 bg-white border border-light-border focus:border-accent rounded-lg px-3 py-2 text-light-text text-xs outline-none placeholder:text-light-muted"
            />
            <input
              type="number"
              placeholder="₹"
              value={saleForm.amount}
              onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
              className="col-span-3 bg-white border border-light-border focus:border-accent rounded-lg px-3 py-2 text-light-text text-xs outline-none placeholder:text-light-muted"
            />
            <input
              type="date"
              value={saleForm.date}
              onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
              className="col-span-3 bg-white border border-light-border focus:border-accent rounded-lg px-2 py-2 text-light-text text-xs outline-none"
            />
            <button
              type="submit"
              className="col-span-1 bg-accent text-white rounded-lg flex items-center justify-center hover:shadow-[0_4px_12px_rgba(22,163,74,0.35)] transition"
              aria-label="Add sale"
            >
              <FiPlus size={14} />
            </button>
          </form>
        </div>

        {/* Profit report */}
        <div className={CARD}>
          <div className="flex gap-2 mb-3">
            <FiDollarSign className="text-accent" size={16} />
            <p className="text-light-text text-sm font-semibold">Profit report</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-light-muted">Total earned</span>
              <span className="text-accent font-semibold">₹{totals.earned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-muted">Total spent</span>
              <span className="text-red-500 font-semibold">₹{totals.spent}</span>
            </div>
            <div className="border-t border-light-border pt-2 flex justify-between">
              <span className="text-light-text font-medium">Net profit</span>
              <span className={`text-lg font-bold ${totals.profit >= 0 ? 'text-accent' : 'text-red-500'}`}>
                ₹{totals.profit}
              </span>
            </div>
            {totals.spent > 0 && (
              <p className="text-light-muted text-[11px] pt-1">
                ROI: {((totals.profit / totals.spent) * 100).toFixed(0)}%
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className={CARD}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-light-text text-sm font-semibold">Field notes</p>
            <button
              type="button"
              onClick={saveNote}
              className="text-xs text-accent hover:underline"
            >
              Save
            </button>
          </div>
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Anything you want to remember — pest sightings, weather impact, ideas for next season..."
            rows={5}
            className="w-full bg-white border border-light-border focus:border-accent rounded-xl px-3 py-2 text-light-text text-xs outline-none resize-none placeholder:text-light-muted"
          />
        </div>
      </div>
    </div>
  );
}
