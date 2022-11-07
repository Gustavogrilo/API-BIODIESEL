import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PropriedadeController } from './propriedade.controller';
import { PropriedadeService } from './propriedade.service';
import { Propriedade } from './propriedade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Propriedade])],
  controllers: [PropriedadeController],
  providers: [PropriedadeService],
})
export class PropriedadeModule {}
