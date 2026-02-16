export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  
  // Auth Endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
  },
  
  // Attendance Endpoints
  ATTENDANCE: {
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    TODAY: '/attendance/today',
    HISTORY: '/attendance/history',
    DETAILS: '/attendance',
  },
  
  // Leave Endpoints
  LEAVE: {
    APPLY: '/leave/apply',
    REQUESTS: '/leave/requests',
    BALANCE: '/leave/balance',
    APPROVE: '/leave',
    REJECT: '/leave',
  },
  
  // Team Endpoints
  TEAM: {
    MEMBERS: '/team/members',
    MEMBER_DETAILS: '/team/members',
    MEMBER_ATTENDANCE: '/team/members',
  },
  
  // Profile Endpoints
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    CHANGE_PASSWORD: '/profile/change-password',
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
