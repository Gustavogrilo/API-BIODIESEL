import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CroquiPropriedade } from './croqui-propriedade.entity';
import { CroquiPropriedadeController } from './croqui-propriedade.controller';
import { CroquiPropriedadeService } from './croqui-propriedade.service';

@Module({
  imports: [TypeOrmModule.forFeature([CroquiPropriedade])],
  controllers: [CroquiPropriedadeController],
  providers: [CroquiPropriedadeService],
  exports: [CroquiPropriedadeService],
})
export class CroquiPropriedadeModule {}
