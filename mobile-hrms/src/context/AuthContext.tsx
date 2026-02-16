import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '@types/index';
import { secureStorage, appStorage, STORAGE_KEYS } from '@utils/storage';
import { MOCK_USER } from '@/data/mockData';

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
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session from storage (mock mode — no API)
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await secureStorage.get('accessToken');
        const userData = await appStorage.get<User>(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { user: userData, token },
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (_employeeId: string, _password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock login: accept any credentials and use demo user
    const user = { ...MOCK_USER, name: 'Demo User', employeeId: 'DEMO001' };
    const accessToken = 'mock-access-token';
    const refreshToken = 'mock-refresh-token';
    await secureStorage.set('accessToken', accessToken);
    await secureStorage.set('refreshToken', refreshToken);
    await appStorage.set(STORAGE_KEYS.USER_DATA, user);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, accessToken, refreshToken },
    });
  };

  const loginDemo = async () => {
    const demoUser: User = { ...MOCK_USER };
    const accessToken = 'mock-access-token';
    const refreshToken = 'mock-refresh-token';
    await secureStorage.set('accessToken', accessToken);
    await secureStorage.set('refreshToken', refreshToken);
    await appStorage.set(STORAGE_KEYS.USER_DATA, demoUser);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user: demoUser, accessToken, refreshToken },
    });
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await secureStorage.clear();
    await appStorage.remove(STORAGE_KEYS.USER_DATA);
    dispatch({ type: 'LOGOUT' });
  };

  const refreshUser = async () => {
    const userData = await appStorage.get<User>(STORAGE_KEYS.USER_DATA);
    if (userData) {
      dispatch({ type: 'SET_USER', payload: userData });
    }
  };

  const value: AuthContextType = {
    state,
    login,
    loginDemo,
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
