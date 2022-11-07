import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QuePerguntaVariavel } from 'src/domain/que-pergunta-variavel/que-pergunta-variavel.entity';

@Injectable()
export class QuePerguntaVariavelService extends CoreService<
  QuePerguntaVariavel
> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(QuePerguntaVariavel)
  protected repositorio: Repository<QuePerguntaVariavel>;

  deletarRelacao(
    pergunta_id: number,
    pergunta_referenciada_id: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({
      pergunta_id,
      pergunta_referenciada_id,
    });
  }
}
