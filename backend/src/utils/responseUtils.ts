export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ResponseUtils {
  static success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }

  static error(message: string): ApiResponse<never> {
    return {
      success: false,
      error: message,
    };
  }
} 