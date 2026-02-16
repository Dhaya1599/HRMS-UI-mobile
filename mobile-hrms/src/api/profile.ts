import { apiClient } from '@utils/api';
import { API_CONFIG } from '@constants/api';
import { ApiResponse, User } from '@types/index';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const profileApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_CONFIG.PROFILE.GET);
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>(
      API_CONFIG.PROFILE.UPDATE,
      data
    );
  },

  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<any>> {
    return apiClient.post(
      API_CONFIG.PROFILE.CHANGE_PASSWORD,
      request
    );
  },
};
