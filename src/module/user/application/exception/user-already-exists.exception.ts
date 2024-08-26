import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistException extends ConflictException {
  constructor() {
    super('User with the provided email already exist.');
  }
}
