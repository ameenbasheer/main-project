// Thin wrapper around Groq's OpenAI-compatible Chat Completions API (free tier).
// Node 22 has native fetch, so no SDK dependency is needed.
//
// Get a free key (no credit card) at https://console.groq.com/keys and put it in .env:
//   GROQ_API_KEY=your_key_here
//
// The API key lives ONLY on the server — never ship it to the frontend bundle.

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Models are env-overridable so you can adjust if Groq's lineup changes.
// List what your key can use: https://console.groq.com/docs/models
const TEXT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const VISION_MODEL =
  process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';

function ensureKey() {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    const err = new Error('AI is not configured on the server (missing GROQ_API_KEY).');
    err.status = 503;
    throw err;
  }
  return key;
}

// Strip ```json fences a model sometimes wraps JSON in, then parse.
function safeParseJSON(text) {
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const err = new Error('AI returned a response that could not be parsed.');
    err.status = 502;
    throw err;
  }
}

/**
 * Low-level call. `messages` is the OpenAI chat format:
 *   [{ role: 'user', content: '<text>' }]
 * or, for vision, content can be an array of parts:
 *   [{ type: 'text', text }, { type: 'image_url', image_url: { url } }]
 */
async function chat(messages, { model = TEXT_MODEL, json = false, temperature = 0.4 } = {}) {
  const key = ensureKey();

  const body = {
    model,
    messages,
    temperature,
    ...(json ? { response_format: { type: 'json_object' } } : {}),
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error?.message || `AI request failed (${res.status})`);
    err.status = res.status === 429 ? 429 : 502; // surface rate limits clearly
    throw err;
  }

  const text = data?.choices?.[0]?.message?.content || '';
  if (!text) {
    const err = new Error('AI returned an empty response.');
    err.status = 502;
    throw err;
  }
  return text;
}

// Free-form text generation.
export function generateText(prompt, opts) {
  return chat([{ role: 'user', content: prompt }], opts);
}

// Generation that must return JSON — returns the parsed object.
export async function generateJSON(prompt, opts) {
  const text = await chat([{ role: 'user', content: prompt }], { ...opts, json: true });
  return safeParseJSON(text);
}

// Vision: prompt + one image (raw base64, no data: prefix). Returns parsed JSON.
// Note: vision models don't reliably support forced JSON mode, so we ask for JSON
// in the prompt and lean on safeParseJSON to strip any code fences.
export async function generateJSONFromImage(prompt, { mimeType, data }, opts) {
  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${data}` } },
      ],
    },
  ];
  const text = await chat(messages, { ...opts, model: VISION_MODEL });
  return safeParseJSON(text);
}
