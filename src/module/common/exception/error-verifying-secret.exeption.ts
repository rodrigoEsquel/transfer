import { InternalServerErrorException } from '@nestjs/common';

export class ErrorVerifyingSecret extends InternalServerErrorException {
  constructor() {
    super('Error verifyng secret');
  }
}
