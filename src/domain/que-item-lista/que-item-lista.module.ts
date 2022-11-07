import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueItemLista } from './que-item-lista.entity';
import { QueItemListaService } from './que-item-lista.service';
import { QueItemListaController } from './que-item-lista.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QueItemLista])],
  providers: [QueItemListaService],
  controllers: [QueItemListaController],
})
export class QueItemListaModule {}
