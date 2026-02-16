import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@types/index';
import { apiClient } from '@utils/api';
import { secureStorage, appStorage, STORAGE_KEYS } from '@utils/storage';
import { API_CONFIG } from '@constants/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'RESTORE_TOKEN'; payload: { user: User; token: string } };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return initialState;
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'RESTORE_TOKEN':
      return {
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await secureStorage.get('accessToken');
        const userData = await appStorage.get<User>(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          await apiClient.setToken(token);
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { user: userData, token },
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error restoring token:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (employeeId: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.post<AuthResponse>(API_CONFIG.AUTH.LOGIN, {
        employeeId,
        password,
      });

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Save tokens
        await secureStorage.set('accessToken', accessToken);
        await secureStorage.set('refreshToken', refreshToken);
        await appStorage.set(STORAGE_KEYS.USER_DATA, user);

        // Set token in API client
        await apiClient.setToken(accessToken);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user,
            accessToken,
            refreshToken,
          },
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: message });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await apiClient.post(API_CONFIG.AUTH.LOGOUT, {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await secureStorage.clear();
      await appStorage.remove(STORAGE_KEYS.USER_DATA);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<User>(API_CONFIG.PROFILE.GET);
      if (response.success && response.data) {
        await appStorage.set(STORAGE_KEYS.USER_DATA, response.data);
        dispatch({
          type: 'SET_USER',
          payload: response.data,
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
