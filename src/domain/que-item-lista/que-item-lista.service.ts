import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QueItemLista } from 'src/domain/que-item-lista/que-item-lista.entity';

@Injectable()
export class QueItemListaService extends CoreService<QueItemLista> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(QueItemLista)
  protected repositorio: Repository<QueItemLista>;

  findAll(query?): Promise<QueItemLista[]> {
    const { lista_id } = query;

    delete query.lista_id;

    const quandidadeDeParametros = Object.keys(query).length;

    return this.repositorio.find({
      join: {
        alias: 'item_lista',
        innerJoin: lista_id
          ? {
              lista: 'item_lista.listas',
            }
          : {},
      },
      where: qb => {
        lista_id
          ? qb
              .where(quandidadeDeParametros > 0 ? query : '1=1')
              .andWhere('lista.id = :lista_id', { lista_id })
          : qb.where(quandidadeDeParametros > 0 ? query : '1=1');
      },
      relations: this.relacoesLista || [],
    });
  }

  getPragas(params?) {
    const consulta = getConnection()
      .createQueryBuilder()
      .from('que_resposta', 'qr');
    consulta
      .select('qil.id, qil.nome')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .innerJoin(
        'que_resposta_item_lista',
        'qril',
        'qr.id = qril.que_resposta_id',
      )
      .innerJoin('que_item_lista', 'qil', 'qril.que_item_lista_id = qil.id')
      .where('qr.pergunta_id = 56')
      .groupBy('qil.id');
    return consulta.getRawMany();
  }
}
