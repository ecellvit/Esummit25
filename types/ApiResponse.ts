//todo: (1) Customise this for all APIResponses
//Just take this pull
export interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}