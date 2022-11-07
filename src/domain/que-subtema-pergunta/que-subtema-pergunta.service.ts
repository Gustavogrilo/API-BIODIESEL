import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QueSubtemaPergunta } from './que-subtema-pergunta.entity';

@Injectable()
export class QueSubtemaPerguntaService extends CoreService<QueSubtemaPergunta> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(QueSubtemaPergunta)
  protected repositorio: Repository<QueSubtemaPergunta>;

  deletarRelacao(
    questionario_id: number,
    subtema_id: number,
    pergunta_id: number,
    item: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({
      questionario_id,
      subtema_id,
      pergunta_id,
      item,
    });
  }
}
