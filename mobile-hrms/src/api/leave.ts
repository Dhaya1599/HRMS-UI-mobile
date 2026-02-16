import { ApiResponse, LeaveType, LeaveStatus } from '@types/index';
import {
  MOCK_LEAVE_RECORDS,
  MOCK_LEAVE_BALANCE,
} from '@/data/mockData';

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

/** Mock implementation — no backend. */
export const leaveApi = {
  async applyLeave(request: LeaveRequest): Promise<ApiResponse<LeaveRecord>> {
    const record: LeaveRecord = {
      id: `lv-mock-${Date.now()}`,
      startDate: request.startDate,
      endDate: request.endDate,
      type: request.type,
      status: LeaveStatus.PENDING,
      reason: request.reason,
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: record };
  },

  async getLeaveRequests(
    _status?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<{ records: LeaveRecord[]; total: number }>> {
    const start = (page - 1) * pageSize;
    const records = MOCK_LEAVE_RECORDS.slice(start, start + pageSize);
    return {
      success: true,
      data: { records, total: MOCK_LEAVE_RECORDS.length },
    };
  },

  async getLeaveBalance(): Promise<ApiResponse<LeaveBalance>> {
    return { success: true, data: MOCK_LEAVE_BALANCE };
  },

  async approveLeave(id: string): Promise<ApiResponse<LeaveRecord>> {
    const record = MOCK_LEAVE_RECORDS.find((r) => r.id === id);
    if (!record) return { success: false, error: 'Not found' };
    return {
      success: true,
      data: { ...record, status: LeaveStatus.APPROVED, approvedBy: 'Demo Manager' },
    };
  },

  async rejectLeave(id: string, _reason?: string): Promise<ApiResponse<LeaveRecord>> {
    const record = MOCK_LEAVE_RECORDS.find((r) => r.id === id);
    if (!record) return { success: false, error: 'Not found' };
    return {
      success: true,
      data: { ...record, status: LeaveStatus.REJECTED },
    };
  },
};
