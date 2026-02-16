import { ApiResponse, User } from '@types/index';
import { MOCK_USER } from '@/data/mockData';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** Mock implementation — no backend. Returns mock user; updates are no-op. */
export const profileApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    return { success: true, data: { ...MOCK_USER } };
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return {
      success: true,
      data: { ...MOCK_USER, ...data },
    };
  },

  async changePassword(_request: ChangePasswordRequest): Promise<ApiResponse<unknown>> {
    return { success: true };
  },
};
