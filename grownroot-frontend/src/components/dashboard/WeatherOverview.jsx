import { FiAlertTriangle } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function WeatherOverview() {
  const { weather, crops } = useApp();

  return (
    <div className="glass-card p-5">
      <span className="text-accent text-xs font-semibold mb-2 block">03</span>
      <h3 className="text-white font-bold text-lg mb-4">Today's Weather Overview</h3>
      <hr className="border-dark-border mb-4" />

      <div className="space-y-4">
        {crops.slice(0, 2).map((crop) => (
          <div key={crop.id} className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">{crop.name}</p>
              <p className="text-accent text-xs">
                {crop.status === 'Active' ? `Planted: ${crop.plantedDate}` : `Harvest: ${crop.harvestDate}`}
              </p>
            </div>
            <span className="text-white font-bold text-sm">
              {crop.name === 'Tomatoes' ? `${weather.temperature}°C` : `${weather.humidity}%`}
            </span>
          </div>
        ))}
      </div>

      <Link
        to="/dashboard/disease"
        className="mt-4 flex items-center gap-2 text-accent text-sm pill-btn !py-2 !px-4 w-full justify-center no-underline"
      >
        <FiAlertTriangle size={14} />
        Check disease status
      </Link>
    </div>
  );
}
