export interface ValidationResponse<T> {
  isValid: boolean;
  processedData: T;
}
