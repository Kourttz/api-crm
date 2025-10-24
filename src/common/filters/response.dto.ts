
/**
 * Generic Response Data Transfer Object
 * @author 129891 - Renato Vinicius
 * @date setembro 2025
 */
export class ResponseDto<T> {
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
  data?: T;
}
