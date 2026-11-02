export interface TResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
