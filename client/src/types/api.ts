export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatRequest {
  message: string;
  patientId?: string;
  sessionId?: string;
}
