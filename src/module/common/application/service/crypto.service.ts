import { Inject, Injectable } from '@nestjs/common';

import {
  HASH_PROVIDER,
  IHashProvider,
} from '../interface/hash-provider.interface';
import { EmptySecretException } from '../exception/invalid-secret.exception';

@Injectable()
export class CryptoService {
  constructor(
    @Inject(HASH_PROVIDER) private readonly hashProvider: IHashProvider,
  ) {}

  async hashSecret(secret: string): Promise<string> {
    if (!secret) {
      throw new EmptySecretException();
    }
    return await this.hashProvider.hash(secret);
  }

  async verifyHash(secret: string, hash: string): Promise<boolean> {
    if (!secret || !hash) {
      throw new EmptySecretException();
    }
    return await this.hashProvider.verifyHash(secret, hash);
  }
}
