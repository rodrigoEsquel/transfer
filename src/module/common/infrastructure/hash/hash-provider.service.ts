import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { IHashProvider } from '../../application/interface/hash-provider.interface';
import { FailHashingSecretException } from '../../exception/fail-hashing-secret.exeption';
import { ErrorVerifyingSecret } from '../../exception/error-verifying-secret.exeption';

@Injectable()
export class HashProviderService implements IHashProvider {
  private readonly hashRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.hashRounds = this.configService.get('hash.hashRounds');
  }

  async hash(payload: string): Promise<string> {
    try {
      const crypto = await bcrypt.hash(payload, this.hashRounds);
      return crypto;
    } catch (error) {
      throw new FailHashingSecretException();
    }
  }

  async verifyHash(payload: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(payload, hash);
    } catch (error) {
      throw new ErrorVerifyingSecret();
    }
  }
}
