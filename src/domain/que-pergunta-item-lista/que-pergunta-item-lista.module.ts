import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuePerguntaItemLista } from './que-pergunta-item-lista.entity';
import { QuePerguntaItemListaService } from './que-pergunta-item-lista.service';
import { QuePerguntaItemListaController } from './que-pergunta-item-lista.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuePerguntaItemLista])],
  providers: [QuePerguntaItemListaService],
  controllers: [QuePerguntaItemListaController],
})
export class QuePerguntaItemListaModule {}
