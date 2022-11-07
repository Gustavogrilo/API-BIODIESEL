import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QuePerguntaItemLista } from './que-pergunta-item-lista.entity';

@Injectable()
export class QuePerguntaItemListaService extends CoreService<
  QuePerguntaItemLista
> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(QuePerguntaItemLista)
  protected repositorio: Repository<QuePerguntaItemLista>;

  deletarRelacao(
    pergunta_id: number,
    item_lista_id?: number,
  ): Promise<DeleteResult> {
    return item_lista_id
      ? this.repositorio.delete({ pergunta_id, item_lista_id })
      : this.repositorio.delete({ pergunta_id });
  }
}
