import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Insumo } from './insumo.entity';
import { InsumoService } from './insumo.service';
import { InsumoController } from './insumo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Insumo])],
  providers: [InsumoService],
  controllers: [InsumoController],
})
export class InsumoModule {}
