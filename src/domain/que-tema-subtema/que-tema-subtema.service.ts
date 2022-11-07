import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QueTemaSubtema } from './que-tema-subtema.entity';

@Injectable()
export class QueTemaSubtemaService extends CoreService<QueTemaSubtema> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(QueTemaSubtema)
  protected repositorio: Repository<QueTemaSubtema>;

  deletarRelacao(
    questionario_id: number,
    tema_id: number,
    subtema_id: number,
    item: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({
      questionario_id,
      tema_id,
      subtema_id,
      item,
    });
  }
}
