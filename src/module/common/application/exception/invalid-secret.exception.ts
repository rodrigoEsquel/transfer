import { InternalServerErrorException } from '@nestjs/common';

export class EmptySecretException extends InternalServerErrorException {
  constructor() {
    super('A valid secret is required');
  }
}
