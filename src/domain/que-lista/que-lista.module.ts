import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueLista } from './que-lista.entity';
import { QueListaController } from './que-lista.controller';
import { QueListaService } from './que-lista.service';

@Module({
  imports: [TypeOrmModule.forFeature([QueLista])],
  controllers: [QueListaController],
  providers: [QueListaService],
})
export class QueListaModule {}
