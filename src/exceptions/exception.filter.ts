import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ErrorMessages } from "src/herpers/main.helper";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      code: status,
      message: exception?.getResponse
        ? exception?.getResponse()["message"] || exception?.getResponse()
        : ErrorMessages.INTERNAL_SERVER_ERROR,
      data: null,
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
