import { InternalServerErrorException } from '@nestjs/common';

export class FailHashingSecretException extends InternalServerErrorException {
  constructor() {
    super('Error hashing secret');
  }
}
