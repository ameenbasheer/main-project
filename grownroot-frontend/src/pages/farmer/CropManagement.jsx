import { useNavigate, Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiArrowLeft } from 'react-icons/fi';
import { GiPlantSeed } from 'react-icons/gi';
import { useApp } from '../../context/AppContext';
import PieChart3D, { PIE_PALETTE } from '../../components/common/PieChart3D';

export default function CropManagement() {
  const { crops, farmerProfile } = useApp();
  const navigate = useNavigate();

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

  const goToCrop = (slice) => {
    if (slice.id !== 'unused') navigate(`/dashboard/crops/${slice.id}`);
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
        <h1 className="text-3xl md:text-4xl font-light text-light-text">Manage</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-accent">Your Crops</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 relative z-10">
        {/* Pie chart */}
        <div className="lg:col-span-2 rounded-3xl border border-light-border bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-light-muted text-xs uppercase tracking-wider">Land allocation</p>
              <p className="text-light-text text-base font-semibold">
                {farmerProfile?.totalArea || 0} {farmerProfile?.areaUnit || 'acre'}
                {Number(farmerProfile?.totalArea) === 1 ? '' : 's'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-accent">
              <FiTrendingUp size={12} />
              {allocated}% used
            </span>
          </div>
          <PieChart3D data={pieData} size={300} depth={28} onSliceClick={goToCrop} />
          <p className="text-light-muted text-xs text-center mt-3">
            Tap a slice to open crop details
          </p>
        </div>

        {/* Horizontal crop list */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-light-muted text-xs uppercase tracking-wider">Your crops</p>
            <Link
              to="/dashboard/crops/add"
              className="inline-flex items-center gap-1.5 text-accent text-xs hover:underline no-underline"
            >
              <FiPlus size={12} /> Add Crop
            </Link>
          </div>

          {crops.length === 0 ? (
            <div className="rounded-2xl border border-light-border bg-white p-5 text-center text-light-muted">
              No crops yet. Add your first one.
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
              {crops.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate(`/dashboard/crops/${c.id}`)}
                  className="shrink-0 w-44 rounded-2xl overflow-hidden border border-light-border bg-white hover:border-accent/60 transition-all hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(22,163,74,0.18)] text-left"
                >
                  <div className="h-28 relative bg-accent/10">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent">
                        <GiPlantSeed size={36} />
                      </div>
                    )}
                    <span
                      className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full"
                      style={{ background: PIE_PALETTE[i % PIE_PALETTE.length] }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-light-text text-sm font-semibold truncate">{c.name}</p>
                    <p className="text-light-muted text-xs">{c.currentStage || c.status}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-accent text-xs font-medium">{c.areaPercent || 0}%</span>
                      <span className="text-light-muted text-[10px]">{(c.expenses?.length || 0)} expenses</span>
                    </div>
                  </div>
                </button>
              ))}

              {/* Add crop tile */}
              <Link
                to="/dashboard/crops/add"
                className="shrink-0 w-44 rounded-2xl border-2 border-dashed border-light-border hover:border-accent/60 flex flex-col items-center justify-center gap-2 text-light-muted hover:text-accent transition-all no-underline"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <FiPlus size={20} />
                </div>
                <span className="text-xs font-medium">Add Crop</span>
              </Link>
            </div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="rounded-2xl border border-light-border bg-white p-3">
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Active</p>
              <p className="text-light-text text-lg font-bold">
                {crops.filter((c) => c.status !== 'Harvested').length}
              </p>
            </div>
            <div className="rounded-2xl border border-light-border bg-white p-3">
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Total spent</p>
              <p className="text-light-text text-lg font-bold">
                ₹{crops.reduce((s, c) => s + (c.expenses?.reduce((a, e) => a + (e.amount || 0), 0) || 0), 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-light-border bg-white p-3">
              <p className="text-light-muted text-[10px] uppercase tracking-wider">Total earned</p>
              <p className="text-light-text text-lg font-bold">
                ₹{crops.reduce((s, c) => s + (c.sales?.reduce((a, e) => a + (e.amount || 0), 0) || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
