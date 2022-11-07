import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueSubtema } from './que-subtema.entity';
import { QueSubtemaService } from './que-subtema.service';
import { QueSubtemaController } from './que-subtema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QueSubtema])],
  providers: [QueSubtemaService],
  controllers: [QueSubtemaController],
})
export class QueSubtemaModule {}
