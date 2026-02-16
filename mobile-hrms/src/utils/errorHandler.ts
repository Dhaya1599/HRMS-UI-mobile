import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@types/index';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export const handleApiError = (error: any): AppError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (axiosError.response) {
      // Server responded with error status
      const { status, data } = axiosError.response;

      return {
        message: data?.error || 'An error occurred',
        code: data?.error || `HTTP_${status}`,
        statusCode: status,
        details: data,
      };
    } else if (axiosError.request) {
      // Request made but no response received
      return {
        message: 'No response from server. Please check your internet connection.',
        code: 'NO_RESPONSE',
        statusCode: 0,
      };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const getErrorMessage = (error: any): string => {
  const appError = handleApiError(error);
  return appError.message;
};

export const isNetworkError = (error: any): boolean => {
  if (axios.isAxiosError(error)) {
    return !error.response && error.code === 'ECONNABORTED';
  }
  return false;
};

export const isAuthenticationError = (error: any): boolean => {
  const appError = handleApiError(error);
  return appError.statusCode === 401;
};

export const isAuthorizationError = (error: any): boolean => {
  const appError = handleApiError(error);
  return appError.statusCode === 403;
};

export const isNotFoundError = (error: any): boolean => {
  const appError = handleApiError(error);
  return appError.statusCode === 404;
};

export const isValidationError = (error: any): boolean => {
  const appError = handleApiError(error);
  return appError.statusCode === 400;
};

export const logError = (error: any, context?: string): void => {
  const appError = handleApiError(error);
  const timestamp = new Date().toISOString();

  if (context) {
    console.error(`[${timestamp}] ${context}:`, appError);
  } else {
    console.error(`[${timestamp}] Error:`, appError);
  }
};
