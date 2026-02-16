/**
 * Mock data for HRMS UI — no backend connection.
 */

import { LeaveType, LeaveStatus } from '@types/index';
import type { User } from '@types/index';
import type { LeaveRecord, LeaveBalance } from '@/api/leave';
import type { AttendanceRecord } from '@/api/attendance';
import type { TeamMember, TeamMemberAttendance } from '@/api/team';

// —— Mock user (demo)
export const MOCK_USER: User = {
  id: 'demo-1',
  name: 'Demo User',
  email: 'demo@hrms.local',
  employeeId: 'DEMO001',
  department: 'Engineering',
  role: 'manager',
  phone: '+1 555-0123',
  joinDate: '2023-01-15',
};

// —— Leave
export const MOCK_LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: 'lv-1',
    startDate: '2025-02-10',
    endDate: '2025-02-11',
    type: LeaveType.SICK,
    status: LeaveStatus.APPROVED,
    reason: 'Flu',
    approvedBy: 'Jane Manager',
    createdAt: '2025-02-05T10:00:00Z',
  },
  {
    id: 'lv-2',
    startDate: '2025-02-20',
    endDate: '2025-02-21',
    type: LeaveType.CASUAL,
    status: LeaveStatus.PENDING,
    reason: 'Personal work',
    createdAt: '2025-02-14T09:00:00Z',
  },
  {
    id: 'lv-3',
    startDate: '2025-01-15',
    endDate: '2025-01-16',
    type: LeaveType.EARNED,
    status: LeaveStatus.APPROVED,
    reason: 'Family event',
    approvedBy: 'Jane Manager',
    createdAt: '2025-01-10T14:00:00Z',
  },
];

export const MOCK_LEAVE_BALANCE: LeaveBalance = {
  sick: 8,
  casual: 6,
  earned: 12,
  maternity: 0,
  paternity: 0,
};

// —— Attendance history
export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2025-02-14',
    checkInTime: '09:15',
    checkOutTime: '18:30',
    checkInLocation: { latitude: 12.9716, longitude: 77.5946 },
    checkOutLocation: { latitude: 12.9716, longitude: 77.5946 },
    status: 'present',
    workingHours: 8.25,
  },
  {
    id: 'att-2',
    date: '2025-02-13',
    checkInTime: '09:00',
    checkOutTime: '18:00',
    checkInLocation: { latitude: 12.9716, longitude: 77.5946 },
    checkOutLocation: { latitude: 12.9716, longitude: 77.5946 },
    status: 'present',
    workingHours: 9,
  },
  {
    id: 'att-3',
    date: '2025-02-12',
    checkInTime: '09:45',
    checkOutTime: '18:15',
    checkInLocation: { latitude: 12.9716, longitude: 77.5946 },
    checkOutLocation: { latitude: 12.9716, longitude: 77.5946 },
    status: 'late',
    workingHours: 7.5,
  },
];

// —— Team members (for manager view)
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    ...MOCK_USER,
    id: 'demo-1',
    name: 'Demo User',
    employeeId: 'DEMO001',
    currentStatus: 'in',
    lastCheckIn: '09:15',
    lastCheckOut: undefined,
  },
  {
    id: 'mem-2',
    name: 'Alex Johnson',
    email: 'alex.j@hrms.local',
    employeeId: 'EMP002',
    department: 'Engineering',
    role: 'employee',
    joinDate: '2023-06-01',
    currentStatus: 'in',
    lastCheckIn: '08:55',
  },
  {
    id: 'mem-3',
    name: 'Sam Williams',
    email: 'sam.w@hrms.local',
    employeeId: 'EMP003',
    department: 'Engineering',
    role: 'employee',
    joinDate: '2024-01-10',
    currentStatus: 'out',
    lastCheckIn: '09:00',
    lastCheckOut: '17:30',
  },
  {
    id: 'mem-4',
    name: 'Jordan Lee',
    email: 'jordan.l@hrms.local',
    employeeId: 'EMP004',
    department: 'Engineering',
    role: 'employee',
    joinDate: '2024-03-15',
    currentStatus: 'on_leave',
  },
];

export const MOCK_TEAM_ATTENDANCE: TeamMemberAttendance[] = [
  { date: '2025-02-14', status: 'present', checkInTime: '09:00', checkOutTime: '18:00' },
  { date: '2025-02-13', status: 'present', checkInTime: '09:15', checkOutTime: '18:30' },
  { date: '2025-02-12', status: 'late', checkInTime: '09:45', checkOutTime: '18:15' },
];
