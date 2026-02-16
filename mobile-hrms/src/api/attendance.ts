import { ApiResponse, LocationCoordinates } from '@types/index';
import { MOCK_ATTENDANCE_RECORDS } from '@/data/mockData';

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

// In-memory mock state for today's attendance
let mockToday: TodayAttendance = {
  hasCheckedIn: false,
  hasCheckedOut: false,
  status: 'absent',
};

function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Mock implementation — no backend. */
export const attendanceApi = {
  async checkIn(location: LocationCoordinates): Promise<ApiResponse<AttendanceRecord>> {
    const t = nowTime();
    mockToday = {
      hasCheckedIn: true,
      hasCheckedOut: false,
      checkInTime: t,
      status: 'present',
    };
    const record: AttendanceRecord = {
      id: `att-today-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      checkInTime: t,
      checkInLocation: { latitude: location.latitude, longitude: location.longitude },
      status: 'present',
    };
    return { success: true, data: record };
  },

  async checkOut(location: LocationCoordinates): Promise<ApiResponse<AttendanceRecord>> {
    const outTime = nowTime();
    const checkIn = mockToday.checkInTime || '09:00';
    mockToday = {
      ...mockToday,
      hasCheckedOut: true,
      checkOutTime: outTime,
      workingHours: 8,
      status: 'present',
    };
    const record: AttendanceRecord = {
      id: `att-today-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      checkInTime: checkIn,
      checkOutTime: outTime,
      checkInLocation: { latitude: location.latitude, longitude: location.longitude },
      checkOutLocation: { latitude: location.latitude, longitude: location.longitude },
      status: 'present',
      workingHours: 8,
    };
    return { success: true, data: record };
  },

  async getTodayAttendance(): Promise<ApiResponse<TodayAttendance>> {
    return { success: true, data: { ...mockToday } };
  },

  async getAttendanceHistory(
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<{ records: AttendanceRecord[]; total: number }>> {
    const start = (page - 1) * pageSize;
    const records = MOCK_ATTENDANCE_RECORDS.slice(start, start + pageSize);
    return {
      success: true,
      data: { records, total: MOCK_ATTENDANCE_RECORDS.length },
    };
  },

  async getAttendanceDetails(id: string): Promise<ApiResponse<AttendanceRecord>> {
    const record = MOCK_ATTENDANCE_RECORDS.find((r) => r.id === id);
    if (!record) return { success: false, error: 'Not found' };
    return { success: true, data: record };
  },
};
