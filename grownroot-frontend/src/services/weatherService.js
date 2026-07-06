// Weather + location data via Open-Meteo — free, no API key, no billing.
//   Geocoding: https://open-meteo.com/en/docs/geocoding-api
//   Forecast:  https://open-meteo.com/en/docs
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO weather interpretation codes -> human label + icon category.
// `icon` is a UI-agnostic key the component maps to a react-icon.
const WMO = {
  0: { condition: 'Clear', icon: 'sun' },
  1: { condition: 'Mainly Clear', icon: 'sun' },
  2: { condition: 'Partly Cloudy', icon: 'cloud' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Fog', icon: 'cloud' },
  48: { condition: 'Rime Fog', icon: 'cloud' },
  51: { condition: 'Light Drizzle', icon: 'rain' },
  53: { condition: 'Drizzle', icon: 'rain' },
  55: { condition: 'Heavy Drizzle', icon: 'rain' },
  61: { condition: 'Light Rain', icon: 'rain' },
  63: { condition: 'Rain', icon: 'rain' },
  65: { condition: 'Heavy Rain', icon: 'rain' },
  66: { condition: 'Freezing Rain', icon: 'rain' },
  67: { condition: 'Freezing Rain', icon: 'rain' },
  71: { condition: 'Light Snow', icon: 'snow' },
  73: { condition: 'Snow', icon: 'snow' },
  75: { condition: 'Heavy Snow', icon: 'snow' },
  80: { condition: 'Showers', icon: 'rain' },
  81: { condition: 'Showers', icon: 'rain' },
  82: { condition: 'Heavy Showers', icon: 'rain' },
  95: { condition: 'Thunderstorm', icon: 'storm' },
  96: { condition: 'Thunderstorm', icon: 'storm' },
  99: { condition: 'Thunderstorm', icon: 'storm' },
};

const describe = (code) => WMO[code] || { condition: 'Unknown', icon: 'cloud' };

const uvLabel = (uv) => {
  if (uv == null) return '';
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
};

/**
 * Search places by name. Returns up to `count` matches, each with coordinates.
 * @returns {Promise<Array<{id,name,label,lat,lng}>>}
 */
export async function searchLocations(query, count = 5) {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = `${GEO_URL}?name=${encodeURIComponent(q)}&count=${count}&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Location search failed');
  const data = await res.json();

  return (data.results || []).map((r) => {
    const region = [r.admin1, r.country].filter(Boolean).join(', ');
    return {
      id: r.id,
      name: r.name,
      label: region ? `${r.name}, ${region}` : r.name,
      lat: r.latitude,
      lng: r.longitude,
    };
  });
}

/**
 * Fetch current conditions + a multi-day forecast for coordinates.
 * Shape matches the `weather` slice in appReducer.
 */
export async function getWeather(lat, lng, days = 5) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max',
    hourly: 'soil_moisture_0_to_1cm',
    timezone: 'auto',
    forecast_days: String(days),
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error('Weather fetch failed');
  const d = await res.json();

  const cur = d.current || {};
  const daily = d.daily || {};
  const curDesc = describe(cur.weather_code);

  // Soil moisture: take the reading for the current hour (first hourly entry).
  const soil = d.hourly?.soil_moisture_0_to_1cm?.[0];

  const forecast = (daily.time || []).map((iso, i) => {
    const desc = describe(daily.weather_code?.[i]);
    return {
      // 'Mon', 'Tue', ... derived from the ISO date without locale parsing surprises.
      day: new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      date: iso,
      tempMax: Math.round(daily.temperature_2m_max?.[i]),
      tempMin: Math.round(daily.temperature_2m_min?.[i]),
      rainfall: daily.precipitation_sum?.[i],
      condition: desc.condition,
      icon: desc.icon,
    };
  });

  const uv = daily.uv_index_max?.[0];

  return {
    temperature: Math.round(cur.temperature_2m),
    condition: curDesc.condition,
    icon: curDesc.icon,
    humidity: Math.round(cur.relative_humidity_2m),
    rainfall: Math.round((cur.precipitation ?? 0) * 10) / 10,
    windSpeed: Math.round(cur.wind_speed_10m),
    uvIndex: uv != null ? Math.round(uv) : null,
    uvLabel: uvLabel(uv),
    // Surface soil moisture as a percentage (m³/m³ -> %).
    soilMoisture: soil != null ? Math.round(soil * 100) : null,
    forecast,
  };
}
