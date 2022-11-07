import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueRespostaAnexo } from './que-resposta-anexo.entity';
import { QueRespostaAnexoController } from './que-resposta-anexo.controller';
import { QueRespostaAnexoService } from './que-resposta-anexo.service';

@Module({
  imports: [TypeOrmModule.forFeature([QueRespostaAnexo])],
  controllers: [QueRespostaAnexoController],
  providers: [QueRespostaAnexoService],
})
export class QueRespostaAnexoModule {}
