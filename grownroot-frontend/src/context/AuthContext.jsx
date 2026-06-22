import { createContext, useContext, useEffect, useReducer } from 'react';
import { authReducer, initialAuthState, AUTH_ACTIONS } from '../reducers/authReducer';
import { authApi, tokenStore } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Restore the session on first load if a JWT is already stored.
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) return;

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    authApi
      .me()
      .then(({ user }) => dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user }))
      .catch(() => {
        tokenStore.clear();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      });
  }, []);

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { user, token } = await authApi.login({ email, password });
      tokenStore.set(token);
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user });
      return user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: err.message });
      throw err;
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { user, token } = await authApi.register(userData);
      tokenStore.set(token);
      dispatch({ type: AUTH_ACTIONS.REGISTER, payload: user });
      return user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: err.message });
      throw err;
    }
  };

  const logout = () => {
    tokenStore.clear();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
