import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG, HTTP_STATUS } from '@constants/api';
import * as SecureStore from 'expo-secure-store';
import { ApiResponse, ErrorResponse } from '@types/index';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add token to requests
    this.client.interceptors.request.use(
      async (config) => {
        const token = this.token || (await this.getStoredToken());
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (
          error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
          originalRequest &&
          !originalRequest.url?.includes(API_CONFIG.AUTH.REFRESH)
        ) {
          try {
            const refreshToken = await this.getStoredRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.client.post(API_CONFIG.AUTH.REFRESH, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;
            await this.saveTokens(accessToken, newRefreshToken);
            this.token = accessToken;

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            await this.clearTokens();
            this.token = null;
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      this.token = accessToken;
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('accessToken');
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  async getStoredRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('refreshToken');
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      this.token = null;
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  async setToken(token: string): Promise<void> {
    this.token = token;
  }

  get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.client.get<ApiResponse<T>>(url, config).then((res) => res.data);
  }

  post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.client.post<ApiResponse<T>>(url, data, config).then((res) => res.data);
  }

  put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.client.put<ApiResponse<T>>(url, data, config).then((res) => res.data);
  }

  patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.client.patch<ApiResponse<T>>(url, data, config).then((res) => res.data);
  }

  delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.client.delete<ApiResponse<T>>(url, config).then((res) => res.data);
  }
}

export const apiClient = new ApiClient();
