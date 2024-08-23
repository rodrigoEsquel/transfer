import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { IHashProvider } from '../../application/interface/hash-provider.interface';

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
      console.log(error);
    }
  }

  async verifyHash(payload: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(payload, hash);
  }
}
