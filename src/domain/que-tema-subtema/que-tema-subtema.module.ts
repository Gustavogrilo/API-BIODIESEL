import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueTemaSubtemaService } from './que-tema-subtema.service';
import { QueTemaSubtemaController } from './que-tema-subtema.controller';
import { QueTemaSubtema } from './que-tema-subtema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueTemaSubtema])],
  providers: [QueTemaSubtemaService],
  controllers: [QueTemaSubtemaController],
})
export class QueTemaSubtemaModule {}
