import { apiClient } from '@utils/api';
import { API_CONFIG } from '@constants/api';
import { ApiResponse, LeaveType, LeaveStatus } from '@types/index';

export interface LeaveRequest {
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
}

export interface LeaveRecord {
  id: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  status: LeaveStatus;
  reason: string;
  approvedBy?: string;
  createdAt: string;
}

export interface LeaveBalance {
  sick: number;
  casual: number;
  earned: number;
  maternity?: number;
  paternity?: number;
}

export const leaveApi = {
  async applyLeave(request: LeaveRequest): Promise<ApiResponse<LeaveRecord>> {
    return apiClient.post<LeaveRecord>(
      API_CONFIG.LEAVE.APPLY,
      request
    );
  },

  async getLeaveRequests(
    status?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<{ records: LeaveRecord[]; total: number }>> {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    query.append('page', page.toString());
    query.append('pageSize', pageSize.toString());

    return apiClient.get(
      `${API_CONFIG.LEAVE.REQUESTS}?${query.toString()}`
    );
  },

  async getLeaveBalance(): Promise<ApiResponse<LeaveBalance>> {
    return apiClient.get<LeaveBalance>(API_CONFIG.LEAVE.BALANCE);
  },

  async approveLeave(id: string): Promise<ApiResponse<LeaveRecord>> {
    return apiClient.put<LeaveRecord>(
      `${API_CONFIG.LEAVE.APPROVE}/${id}/approve`,
      {}
    );
  },

  async rejectLeave(id: string, reason?: string): Promise<ApiResponse<LeaveRecord>> {
    return apiClient.put<LeaveRecord>(
      `${API_CONFIG.LEAVE.REJECT}/${id}/reject`,
      { reason }
    );
  },
};
