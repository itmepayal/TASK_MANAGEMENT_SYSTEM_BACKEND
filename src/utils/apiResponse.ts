// =========================================
// API RESPONSE UTILITY
// =========================================
export class ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  // =========================================
  // SUCCESS RESPONSE
  // =========================================
  static success<T>(message: string, data?: T) {
    return new ApiResponse<T>(true, message, data);
  }
}
