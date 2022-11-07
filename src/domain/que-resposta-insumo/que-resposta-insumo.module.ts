import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueRespostaInsumo } from './que-resposta-insumo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueRespostaInsumo])],
})
export class QueRespostaInsumoModule {}
