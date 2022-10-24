import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
