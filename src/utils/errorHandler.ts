import { InvocationContext } from "@azure/functions";
import { ApiErrorResponse } from "../types/api";

export function errorResponse(
  context: InvocationContext,
  error: unknown,
  statusCode: number = 500
): ApiErrorResponse {
  console.error("Error occurred:", error);
  return {
    status: statusCode,
    message: "An internal server error occurred.",
  };
}
