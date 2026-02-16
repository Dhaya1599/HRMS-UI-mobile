/**
 * Mock only — no backend. No network calls.
 */
import { ApiResponse, AuthResponse } from '@types/index';
import { MOCK_USER } from '@/data/mockData';

export interface LoginRequest {
  employeeId: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export const authApi = {
  async login(_employeeId: string, _password: string): Promise<ApiResponse<AuthResponse>> {
    return {
      success: true,
      data: {
        user: { ...MOCK_USER },
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        expiresIn: 3600,
      },
    };
  },

  async logout(): Promise<ApiResponse<unknown>> {
    return { success: true };
  },

  async refreshToken(_refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return {
      success: true,
      data: {
        user: { ...MOCK_USER },
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        expiresIn: 3600,
      },
    };
  },
};
