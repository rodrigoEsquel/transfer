import { Inject, Injectable } from '@nestjs/common';

import {
  HASH_PROVIDER,
  IHashProvider,
} from '../interface/hash-provider.interface';

@Injectable()
export class CryptoService {
  constructor(
    @Inject(HASH_PROVIDER) private readonly hashProvider: IHashProvider,
  ) {}

  async hashSecret(secret: string): Promise<string> {
    return await this.hashProvider.hash(secret);
  }

  async verifyHash(secret: string, hash: string): Promise<boolean> {
    return await this.hashProvider.verifyHash(secret, hash);
  }
}
