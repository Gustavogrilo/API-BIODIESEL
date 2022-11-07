import { Module } from '@nestjs/common';
import { ContadoresHomeService } from './contadores-home.service';
import { ContadoresHomeController } from './contadores-home.controller';

@Module({
  controllers: [ContadoresHomeController],
  providers: [ContadoresHomeService],
})
export class ContadoresHomeModule {}
