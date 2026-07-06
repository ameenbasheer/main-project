import { FiSun, FiDroplet, FiCloudRain, FiWind, FiCloud, FiCloudSnow, FiCloudLightning, FiMapPin, FiThermometer } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import WeatherAdvisor from '../../components/weather/WeatherAdvisor';

// Map the weatherService icon category to a react-icon.
const WEATHER_ICONS = {
  sun: FiSun,
  cloud: FiCloud,
  rain: FiCloudRain,
  snow: FiCloudSnow,
  storm: FiCloudLightning,
};

function WeatherIcon({ icon, ...props }) {
  const Icon = WEATHER_ICONS[icon] || FiSun;
  return <Icon {...props} />;
}

// A single supporting metric tile (humidity, wind, UV, soil…).
function StatTile({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-light-border bg-light-bg/60 p-4 flex items-center gap-3">
      <span className="w-10 h-10 rounded-xl bg-accent/10 text-accent grid place-items-center shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-light-muted text-xs">{label}</p>
        <p className="text-light-text font-bold text-sm truncate">{value}</p>
      </div>
    </div>
  );
}

export default function WeatherPage() {
  const { weather, farmerProfile } = useApp();
  const forecastDays = weather.forecast || [];
  const hasWeather = weather.temperature != null;

  return (
    <div className="relative space-y-6">
      {/* Header */}
      <div className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-light-text leading-tight">Weather</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-accent leading-tight">Forecast</h2>
          </div>
          {farmerProfile?.location && (
            <span className="inline-flex items-center gap-1.5 text-light-muted text-sm">
              <FiMapPin size={14} className="text-accent" />
              {farmerProfile.location}
            </span>
          )}
        </div>
        <p className="text-light-muted text-sm leading-relaxed mt-3 max-w-2xl">
          Real-time conditions for your farm — temperature, rainfall, humidity and more —
          so you can plan your activities around what the sky is doing.
        </p>
      </div>

      {/* Current conditions hero */}
      <div className="relative z-10 rounded-3xl border border-light-border bg-white overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-24 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.12), transparent 70%)' }}
        />
        {hasWeather ? (
          <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_1fr] gap-6 p-5 sm:p-6">
            {/* Big current reading */}
            <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:justify-center lg:border-r lg:border-light-border lg:pr-6">
              <div className="text-accent text-6xl sm:text-7xl shrink-0">
                <WeatherIcon icon={weather.icon} />
              </div>
              <div>
                <p className="text-light-text text-5xl sm:text-6xl font-light leading-none">
                  {weather.temperature}°<span className="text-2xl align-top">C</span>
                </p>
                <p className="text-accent font-semibold text-lg mt-2">{weather.condition}</p>
              </div>
            </div>

            {/* Supporting metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 self-center">
              <StatTile icon={<FiDroplet size={18} />} label="Humidity" value={`${weather.humidity}%`} />
              <StatTile icon={<FiCloudRain size={18} />} label="Rain expected" value={`${weather.rainfall} mm`} />
              <StatTile icon={<FiWind size={18} />} label="Wind speed" value={`${weather.windSpeed} km/h`} />
              <StatTile
                icon={<FiSun size={18} />}
                label="UV index"
                value={weather.uvIndex != null ? `${weather.uvIndex} (${weather.uvLabel})` : '—'}
              />
              <StatTile
                icon={<FiThermometer size={18} />}
                label="Soil moisture"
                value={weather.soilMoisture != null ? `${weather.soilMoisture}%` : '—'}
              />
            </div>
          </div>
        ) : (
          <div className="relative p-10 text-center">
            <span className="text-5xl block mb-3">📍</span>
            <p className="text-light-muted text-sm">
              Set your farm location in onboarding to see live weather.
            </p>
          </div>
        )}
      </div>

      {/* AI weather advisory */}
      <div className="relative z-10">
        <WeatherAdvisor />
      </div>

      {/* 5-day forecast */}
      <div className="relative z-10 mt-5">
        <h3 className="text-light-text font-semibold text-lg mb-4">
          {forecastDays.length > 0 ? `${forecastDays.length}-Day Forecast` : 'Forecast'}
        </h3>
        {forecastDays.length === 0 ? (
          <p className="text-light-muted text-sm">
            {farmerProfile.lat == null
              ? 'Set your farm location in onboarding to see the forecast.'
              : 'Loading forecast…'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {forecastDays.map((day) => (
              <div
                key={day.date}
                className="rounded-2xl border border-light-border bg-white p-4 text-center hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(22,163,74,0.12)] transition-all"
              >
                <p className="text-light-muted text-xs mb-2">{day.day}</p>
                <div className="text-accent text-2xl mb-2 flex justify-center">
                  <WeatherIcon icon={day.icon} />
                </div>
                <p className="text-light-text font-bold text-lg">{day.tempMax}°C</p>
                <p className="text-light-muted text-xs">{day.tempMin}° · {day.condition}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
