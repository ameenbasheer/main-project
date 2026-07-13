import { createContext, useContext, useEffect, useReducer } from 'react';
import { appReducer, initialAppState, APP_ACTIONS } from '../reducers/appReducer';
import { cropApi, productApi, authApi, adminApi } from '../services/api';
import { getWeather } from '../services/weatherService';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const { isAuthenticated, user } = useAuth();

  // ---- Initial data loading ----------------------------------------------

  // Products power the public marketplace — load them for everyone.
  useEffect(() => {
    dispatch({ type: APP_ACTIONS.SET_PRODUCTS_LOADING, payload: true });
    productApi
      .list()
      .then((products) => dispatch({ type: APP_ACTIONS.SET_PRODUCTS, payload: products }))
      .catch(() => dispatch({ type: APP_ACTIONS.SET_PRODUCTS, payload: [] }))
      .finally(() => dispatch({ type: APP_ACTIONS.SET_PRODUCTS_LOADING, payload: false }));
  }, []);

  // Crops & farmer profile are per-user — (re)load whenever auth changes.
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: APP_ACTIONS.SET_CROPS, payload: [] });
      return;
    }

    if (user?.farmerProfile) {
      dispatch({ type: APP_ACTIONS.SET_FARMER_PROFILE, payload: user.farmerProfile });
    }

    if (user?.role === 'farmer' || user?.role === 'admin') {
      cropApi
        .list()
        .then((crops) => dispatch({ type: APP_ACTIONS.SET_CROPS, payload: crops }))
        .catch(() => dispatch({ type: APP_ACTIONS.SET_CROPS, payload: [] }));
    }

    // Admins manage every user on the platform.
    if (user?.role === 'admin') {
      adminApi
        .listUsers()
        .then((users) => dispatch({ type: APP_ACTIONS.SET_USERS, payload: users }))
        .catch(() => dispatch({ type: APP_ACTIONS.SET_USERS, payload: [] }));
    }
  }, [isAuthenticated, user?.id, user?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cart & orders are client-side only — load them from localStorage whenever the
  // logged-in user changes (and clear on logout). Mutations below persist as they go.
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      dispatch({ type: APP_ACTIONS.SET_CART, payload: [] });
      dispatch({ type: APP_ACTIONS.SET_ORDERS, payload: [] });
      return;
    }
    const read = (key) => {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        return [];
      }
    };
    dispatch({ type: APP_ACTIONS.SET_CART, payload: read(`grownroot_cart_${user.id}`) });
    dispatch({ type: APP_ACTIONS.SET_ORDERS, payload: read(`grownroot_orders_${user.id}`) });
  }, [isAuthenticated, user?.id]);

  // Live weather for the farmer's location (Open-Meteo). Refetches whenever the
  // saved coordinates change; leaves the placeholder in place if none are set.
  const { lat, lng } = state.farmerProfile;
  useEffect(() => {
    if (lat == null || lng == null) return;
    let active = true;
    getWeather(lat, lng)
      .then((w) => {
        if (active) dispatch({ type: APP_ACTIONS.SET_WEATHER, payload: w });
      })
      .catch(() => {}); // keep last known weather on failure
    return () => {
      active = false;
    };
  }, [lat, lng]);

  // ---- Crops --------------------------------------------------------------

  const setCrops = (crops) => dispatch({ type: APP_ACTIONS.SET_CROPS, payload: crops });

  const addCrop = async (crop) => {
    const created = await cropApi.create(crop);
    dispatch({ type: APP_ACTIONS.ADD_CROP, payload: created });
    return created;
  };

  const updateCrop = async (id, changes) => {
    const updated = await cropApi.update(id, changes);
    dispatch({ type: APP_ACTIONS.UPDATE_CROP, payload: { id, changes: updated } });
    return updated;
  };

  const deleteCrop = async (id) => {
    await cropApi.remove(id);
    dispatch({ type: APP_ACTIONS.DELETE_CROP, payload: id });
  };

  // Expense / sale / note endpoints return the full updated crop.
  const addCropExpense = async (cropId, expense) => {
    const updated = await cropApi.addExpense(cropId, expense);
    dispatch({ type: APP_ACTIONS.UPDATE_CROP, payload: { id: cropId, changes: updated } });
    return updated;
  };

  const addCropSale = async (cropId, sale) => {
    const updated = await cropApi.addSale(cropId, sale);
    dispatch({ type: APP_ACTIONS.UPDATE_CROP, payload: { id: cropId, changes: updated } });
    return updated;
  };

  const updateCropNote = async (cropId, note) => {
    const updated = await cropApi.updateNote(cropId, note);
    dispatch({ type: APP_ACTIONS.UPDATE_CROP, payload: { id: cropId, changes: updated } });
    return updated;
  };

  // ---- Products -----------------------------------------------------------

  const addProduct = async (product) => {
    const created = await productApi.create(product);
    dispatch({ type: APP_ACTIONS.ADD_PRODUCT, payload: created });
    return created;
  };

  const deleteProduct = async (id) => {
    await productApi.remove(id);
    dispatch({ type: APP_ACTIONS.DELETE_PRODUCT, payload: id });
  };

  // ---- Farmer profile -----------------------------------------------------

  const setFarmerProfile = async (profile) => {
    const { user: updated } = await authApi.updateProfile({ farmerProfile: profile });
    dispatch({ type: APP_ACTIONS.SET_FARMER_PROFILE, payload: updated.farmerProfile });
    return updated;
  };

  const updateFarmerProfile = async (changes) => {
    const { user: updated } = await authApi.updateProfile({
      farmerProfile: { ...state.farmerProfile, ...changes },
    });
    dispatch({ type: APP_ACTIONS.SET_FARMER_PROFILE, payload: updated.farmerProfile });
    return updated;
  };

  // ---- Cart & orders (localStorage-backed, per user) ----------------------

  const persist = (key, value) => {
    if (user?.id) localStorage.setItem(`grownroot_${key}_${user.id}`, JSON.stringify(value));
  };

  // Build a lean cart line from a product so the cart doesn't carry the full record.
  const toCartItem = (product, quantity = 1) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    unit: product.unit || '',
    image: product.image || null,
    farmer: product.farmer || '',
    quantity,
  });

  const addToCart = (product, quantity = 1) => {
    const item = toCartItem(product, quantity);
    const existing = state.cart.find((i) => i.id === item.id);
    const cart = existing
      ? state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...state.cart, item];
    dispatch({ type: APP_ACTIONS.SET_CART, payload: cart });
    persist('cart', cart);
  };

  const updateCartQty = (id, quantity) => {
    const cart =
      quantity <= 0
        ? state.cart.filter((i) => i.id !== id)
        : state.cart.map((i) => (i.id === id ? { ...i, quantity } : i));
    dispatch({ type: APP_ACTIONS.SET_CART, payload: cart });
    persist('cart', cart);
  };

  const removeFromCart = (id) => {
    const cart = state.cart.filter((i) => i.id !== id);
    dispatch({ type: APP_ACTIONS.SET_CART, payload: cart });
    persist('cart', cart);
  };

  const clearCart = () => {
    dispatch({ type: APP_ACTIONS.SET_CART, payload: [] });
    persist('cart', []);
  };

  // Turn the current cart (or a single product, for "Buy Now") into a placed order.
  // `payment` is the summary handed back by the (dummy) PaymentModal.
  const placeOrder = (items = state.cart, payment = null) => {
    if (!items.length) return null;
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = {
      id: `ord_${Date.now()}`,
      items,
      total,
      payment,
      status: 'Processing',
      createdAt: new Date().toISOString(),
    };
    const orders = [order, ...state.orders];
    dispatch({ type: APP_ACTIONS.SET_ORDERS, payload: orders });
    persist('orders', orders);
    // A full-cart checkout empties the cart; a direct "Buy Now" leaves it untouched.
    if (items === state.cart) clearCart();
    return order;
  };

  // ---- Local-only state (no backend yet) ----------------------------------

  const setWeather = (data) => dispatch({ type: APP_ACTIONS.SET_WEATHER, payload: data });
  const setDiseaseResult = (result) => dispatch({ type: APP_ACTIONS.SET_DISEASE_RESULT, payload: result });
  const clearDiseaseResult = () => dispatch({ type: APP_ACTIONS.CLEAR_DISEASE_RESULT });

  // ---- Admin: user management (backend-backed) ----------------------------

  const setUserStatus = async (id, status) => {
    const updated = await adminApi.setUserStatus(id, status);
    dispatch({ type: APP_ACTIONS.UPDATE_USER, payload: { id, changes: { status: updated.status } } });
    return updated;
  };

  const deleteUser = async (id) => {
    await adminApi.deleteUser(id);
    dispatch({ type: APP_ACTIONS.DELETE_USER, payload: id });
  };

  return (
    <AppContext.Provider value={{
      ...state,
      setCrops,
      addCrop,
      updateCrop,
      deleteCrop,
      addCropExpense,
      addCropSale,
      updateCropNote,
      addProduct,
      deleteProduct,
      setWeather,
      setDiseaseResult,
      clearDiseaseResult,
      setUserStatus,
      deleteUser,
      setFarmerProfile,
      updateFarmerProfile,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      placeOrder,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
