import asyncHandler from '../utils/asyncHandler.js';
import { generateText, generateJSON, generateJSONFromImage } from '../services/groqService.js';

// Shared persona so every feature speaks with one voice.
const PERSONA =
  'You are GrownRoot, an expert agronomist assistant for small farmers. ' +
  'Be practical, specific, and concise. Never invent data you were not given.';

// Trim the weather payload to the fields the model actually needs.
function weatherSummary(w = {}) {
  return {
    temperature: w.temperature,
    condition: w.condition,
    humidity: w.humidity,
    rainfall: w.rainfall,
    soilMoisture: w.soilMoisture,
    uvIndex: w.uvIndex,
    forecast: Array.isArray(w.forecast)
      ? w.forecast.slice(0, 3).map((f) => ({
          day: f.day,
          condition: f.condition,
          tempMax: f.tempMax,
          tempMin: f.tempMin,
          rainfall: f.rainfall,
        }))
      : undefined,
  };
}

// POST /api/ai/daily-plan
// body: { crops: [{ name, currentStage, plantingDate, field }], weather, location, soilType }
// -> { plans: [{ crop, tasks: [{ action, label, reason, priority }] }], summary }
export const dailyPlan = asyncHandler(async (req, res) => {
  const { crops = [], weather = {}, location = '', soilType = '' } = req.body;

  if (!crops.length) {
    return res.json({ plans: [], summary: 'No crops yet — add a crop to get a daily plan.' });
  }

  const prompt = `${PERSONA}

For TODAY, produce an action plan for each crop below, based on the live weather,
soil, and location. Consider watering, cleaning/weeding, pest scouting, heat/cold
protection, fertilizing, and harvest readiness — but only suggest what the
conditions actually call for.

Location: ${location || 'unknown'}
Soil type: ${soilType || 'unknown'}
Weather today: ${JSON.stringify(weatherSummary(weather))}
Crops: ${JSON.stringify(crops.map((c) => ({ name: c.name, stage: c.currentStage, plantingDate: c.plantingDate, field: c.field })))}

Return ONLY JSON shaped exactly like:
{
  "summary": "one short sentence covering the whole farm today",
  "plans": [
    {
      "crop": "<crop name, verbatim>",
      "tasks": [
        { "action": "water|skip-watering|weed|scout-pests|protect-heat|protect-cold|fertilize|harvest|inspect",
          "label": "<imperative, max 8 words>",
          "reason": "<why, tied to weather/stage/soil, max 16 words>",
          "priority": "high|medium|low" }
      ]
    }
  ]
}
Give 1-3 tasks per crop. Order plans to match the input crop order.`;

  const result = await generateJSON(prompt);
  res.json(result);
});

// POST /api/ai/suggest-crops
// body: { soilType, season, weather, location }
// -> { suggestions: [{ name, score, reasons[], note, daysToHarvest }] }
export const suggestCrops = asyncHandler(async (req, res) => {
  const { soilType = '', season = '', weather = {}, location = '', currentCrops = [] } = req.body;

  const prompt = `${PERSONA}

Recommend the 5 best crops to START PLANTING NOW given these conditions.
Favor crops realistically suited to the location and current weather window.
Only recommend crops the farmer is not already growing.

Location: ${location || 'unknown'}
Soil type: ${soilType || 'unknown'}
Season: ${season || 'unknown'}
Weather: ${JSON.stringify(weatherSummary(weather))}
Current crops: ${currentCrops.length ? currentCrops.join(', ') : 'none'}

Return ONLY JSON shaped exactly like:
{
  "suggestions": [
    { "name": "<crop>",
      "score": <0-100 suitability>,
      "reasons": ["<short reason>", "..."],
      "daysToHarvest": <approx days>,
      "note": "<one practical planting tip>" }
  ]
}
Order by score, highest first.`;

  const result = await generateJSON(prompt);
  console.info('[AI] /api/ai/suggest-crops result:', result);
  res.json(result);
});

// POST /api/ai/weather-advice
// body: { weather, crops: [{ name, currentStage }], location, soilType }
// -> { verdict: 'good'|'caution'|'bad', headline, summary,
//      crops: [{ name, verdict, note }], precautions[], tips[] }
export const weatherAdvice = asyncHandler(async (req, res) => {
  const { weather = {}, crops = [], location = '', soilType = '' } = req.body;

  const prompt = `${PERSONA}

Assess whether the CURRENT weather and the next few days are GOOD or BAD for the
farmer's crops, and give protective precautions plus practical ideas.

Location: ${location || 'unknown'}
Soil type: ${soilType || 'unknown'}
Weather: ${JSON.stringify(weatherSummary(weather))}
Crops: ${JSON.stringify(crops.map((c) => ({ name: c.name, stage: c.currentStage })))}

Return ONLY JSON shaped exactly like:
{
  "verdict": "good|caution|bad",
  "headline": "<max 8 words, the overall call>",
  "summary": "<2-3 sentences: why the weather is good or risky right now>",
  "crops": [
    { "name": "<crop name, verbatim>",
      "verdict": "good|caution|bad",
      "note": "<how this weather affects this crop, max 18 words>" }
  ],
  "precautions": ["<specific protective action>", "..."],
  "tips": ["<a smart idea to make the most of these conditions>", "..."]
}
Give 2-4 precautions and 2-3 tips. If there are no crops, leave "crops" as [] and
advise generally for the location.`;

  const result = await generateJSON(prompt);
  res.json(result);
});

// POST /api/ai/diagnose
// body: { image: "<base64 or data URL>", mimeType?, cropName? }
// -> { disease, confidence, plant, severity, healthy, treatment[], note }
export const diagnose = asyncHandler(async (req, res) => {
  const { image, mimeType, cropName } = req.body;

  if (!image) {
    res.status(400);
    throw new Error('An image is required.');
  }

  // Accept either a raw base64 string or a full data URL.
  let data = image;
  let detectedMime = mimeType;
  const match = /^data:(.+?);base64,(.*)$/s.exec(image);
  if (match) {
    detectedMime = match[1];
    data = match[2];
  }

  const prompt = `${PERSONA}

Analyze this plant photo for disease.${cropName ? ` The farmer says it is: ${cropName}.` : ''}
If the plant looks healthy, say so. If the image is not a plant, set "plant" to "Not a plant".

Return ONLY JSON shaped exactly like:
{
  "plant": "<species/crop you see, or 'Not a plant'>",
  "healthy": <true|false>,
  "disease": "<disease name, or 'None detected'>",
  "confidence": <0-100>,
  "severity": "none|mild|moderate|severe",
  "treatment": ["<actionable step>", "..."],
  "note": "<one short prevention tip>"
}`;

  const result = await generateJSONFromImage(prompt, {
    mimeType: detectedMime || 'image/jpeg',
    data,
  });
  res.json(result);
});

// POST /api/ai/chat
// body: { question, context? } -> { answer }
export const chat = asyncHandler(async (req, res) => {
  const { question, context } = req.body;
  if (!question?.trim()) {
    res.status(400);
    throw new Error('A question is required.');
  }

  const prompt = `${PERSONA}
${context ? `Farm context: ${JSON.stringify(context)}\n` : ''}
Farmer's question: ${question}

Answer in 2-4 short sentences. Be concrete and actionable.`;

  const answer = await generateText(prompt, { temperature: 0.6 });
  res.json({ answer: answer.trim() });
});
