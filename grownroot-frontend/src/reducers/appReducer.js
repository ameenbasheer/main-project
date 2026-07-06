export const APP_ACTIONS = {
  SET_CROPS: 'SET_CROPS',
  ADD_CROP: 'ADD_CROP',
  UPDATE_CROP: 'UPDATE_CROP',
  DELETE_CROP: 'DELETE_CROP',
  ADD_CROP_EXPENSE: 'ADD_CROP_EXPENSE',
  ADD_CROP_SALE: 'ADD_CROP_SALE',
  ADD_CROP_NOTE: 'ADD_CROP_NOTE',
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_WEATHER: 'SET_WEATHER',
  SET_DISEASE_RESULT: 'SET_DISEASE_RESULT',
  CLEAR_DISEASE_RESULT: 'CLEAR_DISEASE_RESULT',
  SET_USERS: 'SET_USERS',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  SET_FARMER_PROFILE: 'SET_FARMER_PROFILE',
  UPDATE_FARMER_PROFILE: 'UPDATE_FARMER_PROFILE',
  // Cart & orders are client-side only (persisted to localStorage per user).
  SET_CART: 'SET_CART',
  ADD_TO_CART: 'ADD_TO_CART',
  UPDATE_CART_QTY: 'UPDATE_CART_QTY',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  SET_ORDERS: 'SET_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
};

export const CROP_STAGES = [
  'Seed prep',
  'Sowing',
  'Germination',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Maturity',
  'Harvested',
];

export const initialAppState = {
  // Loaded from the logged-in user's profile via the API.
  farmerProfile: {
    totalArea: 0,
    areaUnit: 'acre',
    location: '',
    lat: null,
    lng: null,
    soilType: '',
  },
  // Crops & products are fetched from the backend (see AppContext).
  crops: [],
  products: [],
  // Shopping cart & placed orders — loaded from localStorage per logged-in user.
  cart: [],
  orders: [],
  // Placeholder until the farmer's coordinates load — then replaced with live
  // Open-Meteo data (see AppContext + weatherService).
  weather: {
    temperature: 28,
    condition: 'Sunny',
    icon: 'sun',
    humidity: 65,
    rainfall: 12,
    windSpeed: 12,
    uvIndex: 6,
    uvLabel: 'High',
    soilMoisture: 42,
    forecast: [],
  },
  diseaseResult: null,
  // Loaded from the backend for admins (see AppContext).
  users: [],
};

export function appReducer(state, action) {
  switch (action.type) {
    case APP_ACTIONS.SET_CROPS:
      return { ...state, crops: action.payload };
    case APP_ACTIONS.ADD_CROP:
      return { ...state, crops: [...state.crops, { id: Date.now(), expenses: [], sales: [], notes: '', ...action.payload }] };
    case APP_ACTIONS.UPDATE_CROP:
      return {
        ...state,
        crops: state.crops.map((c) => (c.id === action.payload.id ? { ...c, ...action.payload.changes } : c)),
      };
    case APP_ACTIONS.DELETE_CROP:
      return { ...state, crops: state.crops.filter((c) => c.id !== action.payload) };
    case APP_ACTIONS.ADD_CROP_EXPENSE:
      return {
        ...state,
        crops: state.crops.map((c) =>
          c.id === action.payload.cropId
            ? { ...c, expenses: [...(c.expenses || []), { id: Date.now(), ...action.payload.expense }] }
            : c
        ),
      };
    case APP_ACTIONS.ADD_CROP_SALE:
      return {
        ...state,
        crops: state.crops.map((c) =>
          c.id === action.payload.cropId
            ? { ...c, sales: [...(c.sales || []), { id: Date.now(), ...action.payload.sale }] }
            : c
        ),
      };
    case APP_ACTIONS.ADD_CROP_NOTE:
      return {
        ...state,
        crops: state.crops.map((c) =>
          c.id === action.payload.cropId ? { ...c, notes: action.payload.note } : c
        ),
      };
    case APP_ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload };
    case APP_ACTIONS.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case APP_ACTIONS.DELETE_PRODUCT:
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };
    case APP_ACTIONS.SET_WEATHER:
      return { ...state, weather: action.payload };
    case APP_ACTIONS.SET_DISEASE_RESULT:
      return { ...state, diseaseResult: action.payload };
    case APP_ACTIONS.CLEAR_DISEASE_RESULT:
      return { ...state, diseaseResult: null };
    case APP_ACTIONS.SET_USERS:
      return { ...state, users: action.payload };
    case APP_ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload.changes } : u
        ),
      };
    case APP_ACTIONS.DELETE_USER:
      return { ...state, users: state.users.filter((u) => u.id !== action.payload) };
    case APP_ACTIONS.SET_FARMER_PROFILE:
      return { ...state, farmerProfile: action.payload };
    case APP_ACTIONS.UPDATE_FARMER_PROFILE:
      return { ...state, farmerProfile: { ...state.farmerProfile, ...action.payload } };
    case APP_ACTIONS.SET_CART:
      return { ...state, cart: action.payload };
    case APP_ACTIONS.ADD_TO_CART: {
      const item = action.payload;
      const existing = state.cart.find((i) => i.id === item.id);
      const cart = existing
        ? state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
          )
        : [...state.cart, { ...item, quantity: item.quantity || 1 }];
      return { ...state, cart };
    }
    case APP_ACTIONS.UPDATE_CART_QTY: {
      const { id, quantity } = action.payload;
      const cart =
        quantity <= 0
          ? state.cart.filter((i) => i.id !== id)
          : state.cart.map((i) => (i.id === id ? { ...i, quantity } : i));
      return { ...state, cart };
    }
    case APP_ACTIONS.REMOVE_FROM_CART:
      return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
    case APP_ACTIONS.CLEAR_CART:
      return { ...state, cart: [] };
    case APP_ACTIONS.SET_ORDERS:
      return { ...state, orders: action.payload };
    case APP_ACTIONS.ADD_ORDER:
      return { ...state, orders: [action.payload, ...state.orders] };
    default:
      return state;
  }
}
