import { HttpException, HttpStatus } from "@nestjs/common";

export class DuplicatedResourceException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
