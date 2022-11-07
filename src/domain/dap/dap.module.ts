import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DapService } from './dap.service';
import { DapController } from './dap.controller';
import { Dap } from './dap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dap])],
  providers: [DapService],
  controllers: [DapController],
})
export class DapModule {}
