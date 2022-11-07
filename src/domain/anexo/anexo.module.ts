import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnexoController } from './anexo.controller';
import { AnexoService } from './anexo.service';
import { Anexo } from './anexo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anexo])],
  controllers: [AnexoController],
  providers: [AnexoService],
})
export class AnexoModule {}
