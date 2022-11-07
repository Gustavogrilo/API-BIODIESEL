import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QueListaItemLista } from './que-lista-item-lista.entity';

@Injectable()
export class QueListaItemListaService extends CoreService<QueListaItemLista> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(QueListaItemLista)
  protected repositorio: Repository<QueListaItemLista>;

  deletarRelacao(
    lista_id: number,
    item_lista_id: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({ lista_id, item_lista_id });
  }
}
