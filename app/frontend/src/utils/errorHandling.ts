export function getErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function isNetworkError(error: any): boolean {
  return !error?.response && error?.request;
}

export function isAuthError(error: any): boolean {
  return error?.response?.status === 401 || error?.response?.status === 403;
}

export function isValidationError(error: any): boolean {
  return error?.response?.status === 400;
}

export function handleApiError(error: any): never {
  const message = getErrorMessage(error);
  
  if (isAuthError(error)) {
    // Could trigger logout or redirect to login
    console.error('Authentication error:', message);
  } else if (isNetworkError(error)) {
    console.error('Network error:', message);
  } else if (isValidationError(error)) {
    console.error('Validation error:', message);
  } else {
    console.error('API error:', message);
  }
  
  throw new Error(message);
}