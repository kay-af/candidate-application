/// Pagination params to be passed to the API
export interface PaginationOptions {
  page: number;
  size: number;
}

/// Service options to be passed to the API
export interface ServiceOptions {
  abortSignal?: AbortSignal;
}

/// Response model for a paginated data
export interface PaginatedResponse<T> {
  pagination: {
    page: number;
    size: number;
    total: number;
  };
  data: T[];
}
