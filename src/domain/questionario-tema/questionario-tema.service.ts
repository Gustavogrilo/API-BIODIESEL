import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QuestionarioTema } from './questionario-tema.entity';

@Injectable()
export class QuestionarioTemaService extends CoreService<QuestionarioTema> {
  protected relacoesLista: string[] = ['tema'];
  protected relacoesUnico: string[];
  @InjectRepository(QuestionarioTema)
  protected repositorio: Repository<QuestionarioTema>;

  deletarRelacao(
    questionario_id: number,
    tema_id: number,
    item: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({ questionario_id, tema_id, item });
  }
}
