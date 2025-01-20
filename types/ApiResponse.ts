//todo: (1) Customise this for all APIResponses

export interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}