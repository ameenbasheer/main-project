
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const TOKEN_KEY = 'grownroot_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// MongoDB returns `_id` on documents (and sub-documents like expenses/sales).
// The UI works with `id`, so recursively map `_id` -> `id` and drop `__v`.
function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value)) {
      if (key === '__v') continue;
      if (key === '_id') {
        out.id = value._id;
        continue;
      }
      out[key] = normalize(value[key]);
    }
    return out;
  }
  return value;
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204 / empty body
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

// ---- Endpoint helpers (grouped by resource) ----

// Auth responses already expose `id` (the controller maps it), so no normalize.
export const authApi = {
  register: (data) => api.post('/auth/register', data, { auth: false }),
  login: (data) => api.post('/auth/login', data, { auth: false }),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const cropApi = {
  list: () => api.get('/crops').then(normalize),
  get: (id) => api.get(`/crops/${id}`).then(normalize),
  create: (data) => api.post('/crops', data).then(normalize),
  update: (id, data) => api.put(`/crops/${id}`, data).then(normalize),
  remove: (id) => api.delete(`/crops/${id}`),
  addExpense: (id, data) => api.post(`/crops/${id}/expenses`, data).then(normalize),
  addSale: (id, data) => api.post(`/crops/${id}/sales`, data).then(normalize),
  updateNote: (id, note) => api.put(`/crops/${id}/note`, { note }).then(normalize),
};

// AI features are proxied through our backend (the Gemini key stays server-side).
export const aiApi = {
  dailyPlan: (data) => api.post('/ai/daily-plan', data),
  suggestCrops: (data) => api.post('/ai/suggest-crops', data),
  weatherAdvice: (data) => api.post('/ai/weather-advice', data),
  diagnose: (data) => api.post('/ai/diagnose', data),
  chat: (data) => api.post('/ai/chat', data),
};

export const productApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/products${qs ? `?${qs}` : ''}`, { auth: false }).then(normalize);
  },
  get: (id) => api.get(`/products/${id}`, { auth: false }).then(normalize),
  create: (data) => api.post('/products', data).then(normalize),
  remove: (id) => api.delete(`/products/${id}`),
};

// Admin-only platform management (users already expose `id`, so no normalize).
export const adminApi = {
  stats: () => api.get('/admin/stats'),
  listUsers: () => api.get('/admin/users'),
  setUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
