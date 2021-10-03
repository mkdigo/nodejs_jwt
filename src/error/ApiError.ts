export default class ApiError {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  public static unauthorized() {
    return new ApiError(401, 'Unauthorized');
  }

  public static invalidToken() {
    return new ApiError(403, 'Invalid Token');
  }

  public static badRequest(msg: string) {
    return new ApiError(400, msg);
  }

  public static internal(msg: string) {
    return new ApiError(500, msg);
  }
}
