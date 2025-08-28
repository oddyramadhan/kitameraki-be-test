import { ApiSuccessResponse } from "../types/api";

export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}
