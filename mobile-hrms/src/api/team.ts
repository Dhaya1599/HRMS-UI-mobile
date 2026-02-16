import { ApiResponse, User } from '@types/index';
import { MOCK_TEAM_MEMBERS, MOCK_TEAM_ATTENDANCE } from '@/data/mockData';

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

/** Mock implementation — no backend. */
export const teamApi = {
  async getTeamMembers(
    _page: number = 1,
    _pageSize: number = 20
  ): Promise<ApiResponse<{ members: TeamMember[]; total: number }>> {
    return {
      success: true,
      data: { members: [...MOCK_TEAM_MEMBERS], total: MOCK_TEAM_MEMBERS.length },
    };
  },

  async getTeamMemberDetails(id: string): Promise<ApiResponse<TeamMember>> {
    const member = MOCK_TEAM_MEMBERS.find((m) => m.id === id);
    if (!member) return { success: false, error: 'Not found' };
    return { success: true, data: { ...member } };
  },

  async getTeamMemberAttendance(
    _id: string,
    _month?: string
  ): Promise<ApiResponse<TeamMemberAttendance[]>> {
    return { success: true, data: [...MOCK_TEAM_ATTENDANCE] };
  },
};
