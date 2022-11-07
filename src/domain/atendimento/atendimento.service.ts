import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/core';
import { FindManyOptions, getConnection, Repository } from 'typeorm';
import { QuePergunta } from '../que-pergunta/que-pergunta.entity';
import { Atendimento } from './entities/atendimento.entity';
import { AtendimentoPerguntas } from './entities/atendimentoPerguntas.entity';

@Injectable()
export class AtendimentoService extends CoreService<Atendimento> {
  protected relacoesLista: string[] = [];
  protected relacoesUnico: string[] = [];

  @InjectRepository(Atendimento)
  protected repositorio: Repository<Atendimento>;

  //@InjectRepository(QuePergunta)
  //protected repositorioPergunta: Repository<QuePergunta>;

  findAllAnswers(query?): Promise<QuePergunta[]> {
    const repositorioPergunta = getConnection().getRepository(
      AtendimentoPerguntas,
    );

    const options: FindManyOptions = {
      join: {
        alias: 'perguntas',
      },
      relations: this.relacoesLista || [],
    };

    const qtdParams = Object.keys(query).length;

    options.where = qb => {
      qb.where(qtdParams > 0 ? query : '1=1');
    };

    return repositorioPergunta.find(options);
  }
}
