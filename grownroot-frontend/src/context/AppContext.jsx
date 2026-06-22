import { createContext, useContext, useReducer } from 'react';
import { appReducer, initialAppState, APP_ACTIONS } from '../reducers/appReducer';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  const setCrops = (crops) => dispatch({ type: APP_ACTIONS.SET_CROPS, payload: crops });
  const addCrop = (crop) => dispatch({ type: APP_ACTIONS.ADD_CROP, payload: crop });
  const updateCrop = (id, changes) => dispatch({ type: APP_ACTIONS.UPDATE_CROP, payload: { id, changes } });
  const deleteCrop = (id) => dispatch({ type: APP_ACTIONS.DELETE_CROP, payload: id });
  const addCropExpense = (cropId, expense) =>
    dispatch({ type: APP_ACTIONS.ADD_CROP_EXPENSE, payload: { cropId, expense } });
  const addCropSale = (cropId, sale) =>
    dispatch({ type: APP_ACTIONS.ADD_CROP_SALE, payload: { cropId, sale } });
  const updateCropNote = (cropId, note) =>
    dispatch({ type: APP_ACTIONS.ADD_CROP_NOTE, payload: { cropId, note } });

  const addProduct = (product) => dispatch({ type: APP_ACTIONS.ADD_PRODUCT, payload: product });
  const deleteProduct = (id) => dispatch({ type: APP_ACTIONS.DELETE_PRODUCT, payload: id });
  const setWeather = (data) => dispatch({ type: APP_ACTIONS.SET_WEATHER, payload: data });
  const setDiseaseResult = (result) => dispatch({ type: APP_ACTIONS.SET_DISEASE_RESULT, payload: result });
  const clearDiseaseResult = () => dispatch({ type: APP_ACTIONS.CLEAR_DISEASE_RESULT });
  const deleteUser = (id) => dispatch({ type: APP_ACTIONS.DELETE_USER, payload: id });

  const setFarmerProfile = (profile) =>
    dispatch({ type: APP_ACTIONS.SET_FARMER_PROFILE, payload: profile });
  const updateFarmerProfile = (changes) =>
    dispatch({ type: APP_ACTIONS.UPDATE_FARMER_PROFILE, payload: changes });

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
      deleteUser,
      setFarmerProfile,
      updateFarmerProfile,
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
