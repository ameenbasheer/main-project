// Mock AI service. Replace internals with real model/API calls later;
// keep the function signatures stable so callers don't need to change.

const CROP_LIBRARY = [
  {
    name: 'Tomatoes',
    soils: ['loam', 'sandy-loam'],
    tempRange: [18, 32],
    rainfallRange: [5, 25],
    seasons: ['spring', 'summer'],
    daysToHarvest: 90,
    stages: [
      { name: 'Germination', days: 10 },
      { name: 'Seedling', days: 20 },
      { name: 'Flowering', days: 30 },
      { name: 'Fruiting', days: 30 },
    ],
    wateringPerWeek: 4,
    note: 'Stake plants early; mulch to retain soil moisture.',
  },
  {
    name: 'Lettuce',
    soils: ['loam', 'silt'],
    tempRange: [10, 24],
    rainfallRange: [10, 30],
    seasons: ['spring', 'autumn', 'winter'],
    daysToHarvest: 55,
    stages: [
      { name: 'Germination', days: 7 },
      { name: 'Leaf growth', days: 28 },
      { name: 'Heading', days: 20 },
    ],
    wateringPerWeek: 5,
    note: 'Bolts in heat — keep cool and harvest young.',
  },
  {
    name: 'Corn',
    soils: ['loam', 'sandy-loam'],
    tempRange: [20, 35],
    rainfallRange: [10, 30],
    seasons: ['spring', 'summer'],
    daysToHarvest: 110,
    stages: [
      { name: 'Germination', days: 12 },
      { name: 'Vegetative', days: 45 },
      { name: 'Tasseling', days: 25 },
      { name: 'Maturity', days: 28 },
    ],
    wateringPerWeek: 3,
    note: 'Heavy feeder — side-dress with nitrogen at knee height.',
  },
  {
    name: 'Carrots',
    soils: ['sandy-loam', 'sandy'],
    tempRange: [12, 26],
    rainfallRange: [5, 20],
    seasons: ['spring', 'autumn'],
    daysToHarvest: 75,
    stages: [
      { name: 'Germination', days: 14 },
      { name: 'Root development', days: 40 },
      { name: 'Maturity', days: 21 },
    ],
    wateringPerWeek: 3,
    note: 'Loose, stone-free soil for straight roots.',
  },
  {
    name: 'Spinach',
    soils: ['loam', 'silt', 'clay-loam'],
    tempRange: [8, 22],
    rainfallRange: [10, 30],
    seasons: ['spring', 'autumn', 'winter'],
    daysToHarvest: 45,
    stages: [
      { name: 'Germination', days: 8 },
      { name: 'Leaf growth', days: 30 },
    ],
    wateringPerWeek: 4,
    note: 'Quick-cycle crop — succession-plant every 2 weeks.',
  },
  {
    name: 'Potatoes',
    soils: ['sandy-loam', 'loam'],
    tempRange: [12, 25],
    rainfallRange: [10, 30],
    seasons: ['spring', 'autumn'],
    daysToHarvest: 100,
    stages: [
      { name: 'Sprouting', days: 14 },
      { name: 'Vegetative', days: 35 },
      { name: 'Tuber bulking', days: 35 },
      { name: 'Maturity', days: 16 },
    ],
    wateringPerWeek: 3,
    note: 'Hill soil around stems as they grow to keep tubers covered.',
  },
  {
    name: 'Onions',
    soils: ['loam', 'sandy-loam'],
    tempRange: [13, 28],
    rainfallRange: [5, 20],
    seasons: ['spring', 'autumn'],
    daysToHarvest: 110,
    stages: [
      { name: 'Germination', days: 14 },
      { name: 'Leaf growth', days: 50 },
      { name: 'Bulb formation', days: 46 },
    ],
    wateringPerWeek: 2,
    note: 'Stop watering once tops fall over — let bulbs cure.',
  },
  {
    name: 'Capsicum',
    soils: ['loam', 'sandy-loam'],
    tempRange: [20, 32],
    rainfallRange: [5, 25],
    seasons: ['spring', 'summer'],
    daysToHarvest: 80,
    stages: [
      { name: 'Germination', days: 12 },
      { name: 'Seedling', days: 25 },
      { name: 'Flowering', days: 20 },
      { name: 'Fruiting', days: 23 },
    ],
    wateringPerWeek: 3,
    note: 'Sensitive to cold nights — wait until soil is warm.',
  },
  {
    name: 'Cucumber',
    soils: ['loam', 'sandy-loam'],
    tempRange: [18, 32],
    rainfallRange: [10, 30],
    seasons: ['spring', 'summer'],
    daysToHarvest: 60,
    stages: [
      { name: 'Germination', days: 8 },
      { name: 'Vining', days: 25 },
      { name: 'Flowering', days: 12 },
      { name: 'Fruiting', days: 15 },
    ],
    wateringPerWeek: 5,
    note: 'Trellis vines for cleaner fruit and better airflow.',
  },
  {
    name: 'Brinjal',
    soils: ['loam', 'sandy-loam', 'clay-loam'],
    tempRange: [22, 35],
    rainfallRange: [5, 25],
    seasons: ['summer'],
    daysToHarvest: 85,
    stages: [
      { name: 'Germination', days: 12 },
      { name: 'Seedling', days: 28 },
      { name: 'Flowering', days: 20 },
      { name: 'Fruiting', days: 25 },
    ],
    wateringPerWeek: 3,
    note: 'Loves heat — avoid planting before nights stay above 18°C.',
  },
  {
    name: 'Green Beans',
    soils: ['loam', 'sandy-loam'],
    tempRange: [16, 30],
    rainfallRange: [10, 25],
    seasons: ['spring', 'summer'],
    daysToHarvest: 60,
    stages: [
      { name: 'Germination', days: 10 },
      { name: 'Vegetative', days: 25 },
      { name: 'Flowering', days: 10 },
      { name: 'Pod fill', days: 15 },
    ],
    wateringPerWeek: 3,
    note: 'Fixes its own nitrogen — skip heavy fertilizer.',
  },
];

export const SOIL_TYPES = [
  { id: 'loam', label: 'Loam' },
  { id: 'sandy-loam', label: 'Sandy Loam' },
  { id: 'sandy', label: 'Sandy' },
  { id: 'clay-loam', label: 'Clay Loam' },
  { id: 'clay', label: 'Clay' },
  { id: 'silt', label: 'Silt' },
];

export const SEASONS = [
  { id: 'spring', label: 'Spring' },
  { id: 'summer', label: 'Summer' },
  { id: 'autumn', label: 'Autumn' },
  { id: 'winter', label: 'Winter' },
];

function inRange(value, [min, max]) {
  return value >= min && value <= max;
}

function scoreCrop(crop, { soilType, season, weather }) {
  let score = 0;
  const reasons = [];

  if (soilType && crop.soils.includes(soilType)) {
    score += 35;
    reasons.push(`Thrives in ${soilType.replace('-', ' ')} soil`);
  } else if (soilType) {
    score += 5;
  }

  if (season && crop.seasons.includes(season)) {
    score += 25;
    reasons.push(`Good fit for ${season} planting`);
  }

  if (weather?.temperature != null) {
    if (inRange(weather.temperature, crop.tempRange)) {
      score += 25;
      reasons.push(`${weather.temperature}°C is within ideal range`);
    } else {
      const [lo, hi] = crop.tempRange;
      const drift = weather.temperature < lo ? lo - weather.temperature : weather.temperature - hi;
      score += Math.max(0, 25 - drift * 4);
    }
  }

  if (weather?.rainfall != null) {
    if (inRange(weather.rainfall, crop.rainfallRange)) {
      score += 15;
      reasons.push(`Rainfall (${weather.rainfall}mm) suits this crop`);
    }
  }

  return {
    crop,
    score: Math.round(score),
    reasons,
  };
}

// Returns crop suggestions ranked by suitability for the inputs.
// Shape per item: { name, score, reasons[], daysToHarvest, wateringPerWeek, note }
export async function suggestCrops({ soilType, season, weather }) {
  await new Promise((r) => setTimeout(r, 600)); // simulate AI latency

  return CROP_LIBRARY
    .map((crop) => scoreCrop(crop, { soilType, season, weather }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ crop, score, reasons }) => ({
      name: crop.name,
      score,
      reasons,
      daysToHarvest: crop.daysToHarvest,
      wateringPerWeek: crop.wateringPerWeek,
      note: crop.note,
    }));
}

function findCrop(name) {
  if (!name) return null;
  const needle = name.trim().toLowerCase();
  return CROP_LIBRARY.find(
    (c) => c.name.toLowerCase() === needle || needle.includes(c.name.toLowerCase()),
  );
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Returns 3-4 actionable, crop-aware improvement tips for a crop already in
// the field. Looks at name + current stage + (optional) weather + notes.
export async function suggestCropImprovements({ name, currentStage, weather, notes }) {
  await new Promise((r) => setTimeout(r, 600));
  const crop = findCrop(name);
  const tips = [];

  if (crop) {
    tips.push(crop.note);
    if (currentStage === 'Flowering' || currentStage === 'Fruiting') {
      tips.push(`At ${currentStage.toLowerCase()}, water consistently — ${crop.wateringPerWeek}× per week prevents fruit drop.`);
    }
    if (currentStage === 'Germination' || currentStage === 'Seedling') {
      tips.push('Keep soil consistently moist and shield young plants from harsh midday sun.');
    }
    if (currentStage === 'Maturity' || currentStage === 'Harvested') {
      tips.push('Inspect for pests one final time and harvest in cool morning hours for best shelf life.');
    }
  } else {
    tips.push(`No specific data for "${name}" — apply a balanced NPK fertilizer at the current stage.`);
  }

  if (weather?.temperature != null && crop) {
    const [lo, hi] = crop.tempRange;
    if (weather.temperature > hi) {
      tips.push(`Temperatures above ${hi}°C stress this crop — mulch heavily and water in early morning.`);
    } else if (weather.temperature < lo) {
      tips.push(`Below ${lo}°C is too cool — consider row covers overnight.`);
    }
  }
  if (weather?.rainfall != null && crop) {
    const [, rhi] = crop.rainfallRange;
    if (weather.rainfall > rhi) {
      tips.push('Recent rainfall is high — improve drainage to avoid root rot.');
    }
  }

  if (notes && /yellow|wilt|spot/i.test(notes)) {
    tips.push('Your notes mention yellowing/wilting/spots — inspect leaves for fungal disease and isolate affected plants.');
  }

  // Deduplicate, drop empties, cap to 4
  return [...new Set(tips.filter(Boolean))].slice(0, 4);
}

// Returns AI-generated insights for a single crop given its name + planted date.
// Falls back to a generic schedule when the crop isn't in the library.
export async function analyzeCrop({ name, plantedDate }) {
  await new Promise((r) => setTimeout(r, 500));

  const crop = findCrop(name);
  const planted = plantedDate ? new Date(plantedDate) : new Date();
  const validPlanted = isNaN(planted.getTime()) ? new Date() : planted;

  if (!crop) {
    const harvest = addDays(validPlanted, 75);
    return {
      matched: false,
      daysToHarvest: 75,
      harvestDate: formatDate(harvest),
      harvestIso: harvest.toISOString().slice(0, 10),
      stages: [
        { name: 'Establishment', endDate: formatDate(addDays(validPlanted, 20)) },
        { name: 'Growth', endDate: formatDate(addDays(validPlanted, 50)) },
        { name: 'Maturity', endDate: formatDate(harvest) },
      ],
      wateringPerWeek: 3,
      note: `No specific data for "${name}" — showing a generic 75-day schedule. Edit if you know better.`,
    };
  }

  let cursor = new Date(validPlanted);
  const stages = crop.stages.map((stage) => {
    cursor = addDays(cursor, stage.days);
    return { name: stage.name, endDate: formatDate(cursor) };
  });

  const harvest = addDays(validPlanted, crop.daysToHarvest);

  return {
    matched: true,
    cropName: crop.name,
    daysToHarvest: crop.daysToHarvest,
    harvestDate: formatDate(harvest),
    harvestIso: harvest.toISOString().slice(0, 10),
    stages,
    wateringPerWeek: crop.wateringPerWeek,
    note: crop.note,
  };
}
