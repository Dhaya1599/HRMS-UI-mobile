/**
 * Error handling without axios or network. Mock-only.
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR',
    };
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      message: String((error as { message: unknown }).message),
      code: 'ERROR',
    };
  }
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const getErrorMessage = (error: unknown): string => {
  return handleApiError(error).message;
};

export const isNetworkError = (_error: unknown): boolean => false;
export const isAuthenticationError = (error: unknown): boolean => {
  return handleApiError(error).statusCode === 401;
};
export const isAuthorizationError = (error: unknown): boolean => {
  return handleApiError(error).statusCode === 403;
};
export const isNotFoundError = (error: unknown): boolean => {
  return handleApiError(error).statusCode === 404;
};
export const isValidationError = (error: unknown): boolean => {
  return handleApiError(error).statusCode === 400;
};

export const logError = (error: unknown, context?: string): void => {
  const appError = handleApiError(error);
  const prefix = context ? `[${context}]` : '';
  console.error(`${prefix}`, appError.message, appError);
};
