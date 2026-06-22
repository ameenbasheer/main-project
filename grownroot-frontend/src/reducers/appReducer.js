import Images from "../assets/images";

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
  DELETE_USER: 'DELETE_USER',
  SET_FARMER_PROFILE: 'SET_FARMER_PROFILE',
  UPDATE_FARMER_PROFILE: 'UPDATE_FARMER_PROFILE',
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

const today = new Date();
const isoOffset = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const initialAppState = {
  farmerProfile: {
    totalArea: 5,
    areaUnit: 'acre',
    location: 'Wayanad, Kerala',
    soilType: 'loam',
  },
  crops: [
    {
      id: 1,
      name: 'Tomatoes',
      image: Images.tomato,
      status: 'Active',
      currentStage: 'Flowering',
      areaPercent: 30,
      plantingDate: isoOffset(-40),
      harvestingDate: isoOffset(50),
      plantedDate: 'Mar 15',
      harvestDate: 'June 20',
      field: 'Field A',
      expenses: [
        { id: 1, label: 'Seeds', amount: 1200, date: isoOffset(-42) },
        { id: 2, label: 'Fertilizer', amount: 800, date: isoOffset(-20) },
      ],
      sales: [],
      notes: 'Mulched around base, watering 4× per week.',
      aiSuggestion: 'Stake plants now and watch for blight after recent humidity.',
    },
    {
      id: 2,
      name: 'Corn',
      image: Images.beans,
      status: 'Growing',
      currentStage: 'Vegetative',
      areaPercent: 25,
      plantingDate: isoOffset(-25),
      harvestingDate: isoOffset(85),
      plantedDate: 'Apr 1',
      harvestDate: 'Aug 10',
      field: 'Field B',
      expenses: [
        { id: 1, label: 'Seeds', amount: 600, date: isoOffset(-26) },
      ],
      sales: [],
      notes: '',
      aiSuggestion: 'Side-dress with nitrogen at knee height.',
    },
    {
      id: 3,
      name: 'Lettuce',
      image: Images.lettuse,
      status: 'Ready',
      currentStage: 'Maturity',
      areaPercent: 15,
      plantingDate: isoOffset(-70),
      harvestingDate: isoOffset(2),
      plantedDate: 'Feb 20',
      harvestDate: 'May 5',
      field: 'Field C',
      expenses: [
        { id: 1, label: 'Seeds', amount: 300, date: isoOffset(-72) },
        { id: 2, label: 'Compost', amount: 250, date: isoOffset(-50) },
      ],
      sales: [
        { id: 1, label: 'Local market', amount: 1800, date: isoOffset(-1) },
      ],
      notes: 'Ready for early-morning harvest.',
      aiSuggestion: 'Harvest before midday to keep leaves crisp.',
    },
  ],
  products: [
    { id: 1, name: 'Fresh Tomatoes', price: 3.50, unit: '/kg', description: 'Vine-ripened tomatoes grown without pesticides. Perfect for salads and cooking.', freshness: 98, location: 'Green Valley', farmer: 'Maria Santos', image: Images.tomato, organic: true, category: 'Vegetables' },
    { id: 2, name: 'Organic Carrots', price: 2.80, unit: '/kg', description: 'Sweet organic carrots freshly harvested. Rich in vitamins and nutrients.', freshness: 95, location: 'Sunrise Farm', farmer: 'John Fields', image: Images.carrot, organic: true, category: 'Vegetables' },
    { id: 3, name: 'Fresh Lettuce', price: 1.99, unit: '/head', description: 'Crispy green lettuce, harvested this morning. Perfect for fresh salads.', freshness: 99, location: 'Valley View', farmer: 'Sarah Green', image: Images.lettuse, organic: false, category: 'Vegetables' },
    { id: 4, name: 'Red Onions', price: 2.20, unit: '/kg', description: 'Fresh red onions with strong flavor, ideal for cooking and salads.', freshness: 96, location: 'Hilltop Farms', farmer: 'Ravi Kumar', image: Images.onion, organic: false, category: 'Vegetables' },
    { id: 5, name: 'Potatoes', price: 1.50, unit: '/kg', description: 'Farm-fresh potatoes perfect for frying, boiling, and baking.', freshness: 94, location: 'Riverdale Farm', farmer: 'Anil Joseph', image: Images.potato, organic: false, category: 'Vegetables' },
    { id: 6, name: 'Green Beans', price: 3.00, unit: '/kg', description: 'Tender green beans freshly picked, great for healthy meals.', freshness: 97, location: 'Green Leaf Farm', farmer: 'Latha Nair', image: Images.beans, organic: true, category: 'Vegetables' },
    { id: 7, name: 'Cucumber', price: 1.80, unit: '/kg', description: 'Cool and refreshing cucumbers, perfect for salads and juices.', freshness: 98, location: 'Fresh Fields', farmer: 'Rahul Das', image: Images.cucumber, organic: true, category: 'Vegetables' },
    { id: 8, name: 'Spinach', price: 2.10, unit: '/bunch', description: 'Nutrient-rich spinach leaves, freshly harvested.', freshness: 99, location: 'Green Meadows', farmer: 'Ayesha Khan', image: Images.spinach, organic: true, category: 'Vegetables' },
    { id: 9, name: 'Brinjal (Eggplant)', price: 2.60, unit: '/kg', description: 'Fresh brinjals with glossy skin, perfect for curries.', freshness: 95, location: 'Sunset Farm', farmer: 'Suresh Babu', image: Images.brinjal, organic: false, category: 'Vegetables' },
    { id: 10, name: 'Capsicum', price: 3.20, unit: '/kg', description: 'Colorful capsicum rich in flavor and nutrients.', freshness: 97, location: 'Rainbow Farms', farmer: 'Neha Patel', image: Images.capsicum, organic: true, category: 'Vegetables' },
  ],
  weather: {
    temperature: 28,
    condition: 'Sunny',
    humidity: 65,
    rainfall: 12,
  },
  diseaseResult: null,
  users: [
    { id: 1, name: 'Maria Santos', email: 'maria@farm.com', role: 'farmer', status: 'active' },
    { id: 2, name: 'John Fields', email: 'john@farm.com', role: 'farmer', status: 'active' },
    { id: 3, name: 'Sarah Green', email: 'sarah@farm.com', role: 'farmer', status: 'active' },
    { id: 4, name: 'Ahmed Khan', email: 'ahmed@buyer.com', role: 'buyer', status: 'active' },
    { id: 5, name: 'Lisa Wong', email: 'lisa@buyer.com', role: 'buyer', status: 'inactive' },
  ],
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
      return { ...state, products: [...state.products, { ...action.payload, id: Date.now() }] };
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
    case APP_ACTIONS.DELETE_USER:
      return { ...state, users: state.users.filter((u) => u.id !== action.payload) };
    case APP_ACTIONS.SET_FARMER_PROFILE:
      return { ...state, farmerProfile: action.payload };
    case APP_ACTIONS.UPDATE_FARMER_PROFILE:
      return { ...state, farmerProfile: { ...state.farmerProfile, ...action.payload } };
    default:
      return state;
  }
}
