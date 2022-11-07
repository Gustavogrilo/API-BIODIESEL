import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueListaItemLista } from './que-lista-item-lista.entity';
import { QueListaItemListaController } from './que-lista-item-lista.controller';
import { QueListaItemListaService } from './que-lista-item-lista.service';

@Module({
  imports: [TypeOrmModule.forFeature([QueListaItemLista])],
  controllers: [QueListaItemListaController],
  providers: [QueListaItemListaService],
})
export class QueListaItemListaModule {}
