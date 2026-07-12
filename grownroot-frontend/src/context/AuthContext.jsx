import { createContext, useContext, useEffect, useReducer } from 'react';
import { authReducer, initialAuthState, AUTH_ACTIONS } from '../reducers/authReducer';
import { authApi, tokenStore } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // If a JWT is already stored, start in a loading state so route guards wait
  // for the session-restore check below instead of bouncing to /login on refresh.
  const [state, dispatch] = useReducer(authReducer, initialAuthState, (init) => ({
    ...init,
    isLoading: !!tokenStore.get(),
  }));

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
      const result = await authApi.register(userData);
      // Registration now requires OTP verification before login.
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return result;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: err.message });
      throw err;
    }
  };

  const verifyOtp = async (data) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { user, token } = await authApi.verifyOtp(data);
      tokenStore.set(token);
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user });
      return user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: err.message });
      throw err;
    }
  };

  const resendOtp = async (data) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const result = await authApi.resendOtp(data);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return result;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: err.message });
      throw err;
    }
  };

  // Persist basic profile fields (name, avatar) and reflect the result locally.
  const updateUser = async (changes) => {
    const { user } = await authApi.updateProfile(changes);
    dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user });
    return user;
  };

  const logout = () => {
    tokenStore.clear();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, verifyOtp, resendOtp, logout, clearError, updateUser }}>
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
