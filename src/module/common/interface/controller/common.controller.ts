import { Controller, Get } from '@nestjs/common';

@Controller('common')
export class CommonController {
  @Get('health')
  async healthCheck(): Promise<void> {
    return;
  }
}
