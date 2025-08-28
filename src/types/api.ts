export type ApiErrorResponse = {
  status: number;
  message: string;
};

export type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
  error?: ApiErrorResponse;
};
