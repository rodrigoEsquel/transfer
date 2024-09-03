import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HASH_PROVIDER } from './application/interface/hash-provider.interface';
import { HashProviderService } from './infrastructure/hash/hash-provider.service';
import { CryptoService } from './application/service/crypto.service';
import { CommonController } from './interface/controller/common.controller';

@Module({
  imports: [ConfigModule],
  controllers: [CommonController],
  providers: [
    CryptoService,
    {
      provide: HASH_PROVIDER,
      useClass: HashProviderService,
    },
  ],
  exports: [CryptoService],
})
export class CommonModule {}
