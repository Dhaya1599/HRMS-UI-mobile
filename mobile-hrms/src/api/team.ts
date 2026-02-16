import { apiClient } from '@utils/api';
import { API_CONFIG } from '@constants/api';
import { ApiResponse, User } from '@types/index';

export interface TeamMember extends User {
  currentStatus?: 'in' | 'out' | 'on_leave';
  lastCheckIn?: string;
  lastCheckOut?: string;
}

export interface TeamMemberAttendance {
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export const teamApi = {
  async getTeamMembers(
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<{ members: TeamMember[]; total: number }>> {
    return apiClient.get(
      `${API_CONFIG.TEAM.MEMBERS}?page=${page}&pageSize=${pageSize}`
    );
  },

  async getTeamMemberDetails(id: string): Promise<ApiResponse<TeamMember>> {
    return apiClient.get<TeamMember>(`${API_CONFIG.TEAM.MEMBER_DETAILS}/${id}`);
  },

  async getTeamMemberAttendance(
    id: string,
    month?: string
  ): Promise<ApiResponse<TeamMemberAttendance[]>> {
    const query = month ? `?month=${month}` : '';
    return apiClient.get(
      `${API_CONFIG.TEAM.MEMBER_ATTENDANCE}/${id}/attendance${query}`
    );
  },
};
