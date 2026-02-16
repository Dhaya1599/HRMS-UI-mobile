import { apiClient } from '@utils/api';
import { API_CONFIG } from '@constants/api';
import { ApiResponse, AuthResponse } from '@types/index';

export interface LoginRequest {
  employeeId: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export const authApi = {
  async login(employeeId: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(
      API_CONFIG.AUTH.LOGIN,
      {
        employeeId,
        password,
      }
    );
  },

  async logout(): Promise<ApiResponse<any>> {
    return apiClient.post(API_CONFIG.AUTH.LOGOUT, {});
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(
      API_CONFIG.AUTH.REFRESH,
      {
        refreshToken,
      }
    );
  },
};
