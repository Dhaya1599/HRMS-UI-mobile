import { apiClient } from '@utils/api';
import { API_CONFIG } from '@constants/api';
import { ApiResponse, LocationCoordinates } from '@types/index';

export interface CheckInOutRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  checkInLocation: {
    latitude: number;
    longitude: number;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
  };
  status: 'present' | 'absent' | 'late' | 'half_day';
  workingHours?: number;
}

export interface TodayAttendance {
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: number;
  status: string;
}

export const attendanceApi = {
  async checkIn(location: LocationCoordinates): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.post<AttendanceRecord>(
      API_CONFIG.ATTENDANCE.CHECK_IN,
      {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: location.timestamp,
      }
    );
  },

  async checkOut(location: LocationCoordinates): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.post<AttendanceRecord>(
      API_CONFIG.ATTENDANCE.CHECK_OUT,
      {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: location.timestamp,
      }
    );
  },

  async getTodayAttendance(): Promise<ApiResponse<TodayAttendance>> {
    return apiClient.get<TodayAttendance>(API_CONFIG.ATTENDANCE.TODAY);
  },

  async getAttendanceHistory(
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<{ records: AttendanceRecord[]; total: number }>> {
    return apiClient.get(
      `${API_CONFIG.ATTENDANCE.HISTORY}?page=${page}&pageSize=${pageSize}`
    );
  },

  async getAttendanceDetails(id: string): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.get<AttendanceRecord>(`${API_CONFIG.ATTENDANCE.DETAILS}/${id}`);
  },
};
