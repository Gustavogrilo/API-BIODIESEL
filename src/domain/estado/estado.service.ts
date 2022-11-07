import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Estado } from './estado.entity';

@Injectable()
export class EstadoService extends CoreService<Estado> {
  protected relacoesLista: string[] = ['pais'];
  protected relacoesUnico: string[] = ['pais'];
  @InjectRepository(Estado)
  protected repositorio: Repository<Estado>;

  async acompanhamentoPorEstado(parametros): Promise<AcompanhamentoEstado> {
    const getIdPerguntaEstimativaProducao = (): number => {
      switch (Number(parametros.tema_id)) {
        case 4:
          return 12;
        case 3:
          return 52;
        default:
          return 74;
      }
    };

    const consulta = this.queryBuilder
      .select([
        'e.id estado_id',
        'e.nome estado',
        'COUNT(DISTINCT produtor.id) qtd_produtores_contratados',
        'COUNT(DISTINCT resposta_estimativa_producao.id) qtd_produtores_atendidos',
        "CONCAT(ROUND((COUNT(DISTINCT resposta_estimativa_producao.id)/COUNT(DISTINCT produtor.id) * 100),0), '%') AS porcentagem_atendimentos",
        "IFNULL(ROUND(AVG(`resposta_estimativa_producao`.`resultado`), 2), '-') previsao_produtividade_media",
      ])
      .from('Estado', 'e')
      .leftJoin('Municipio', 'm', 'e.id = m.estado_id')
      .innerJoin(
        'Propriedade',
        'prop',
        'm.id = prop.municipio_id AND prop.ativo = 1',
      )
      .innerJoin('safra_propriedade', 'sp', 'prop.id = sp.propriedade_id')
      .leftJoin('ClientePropriedade', 'cp', 'cp.propriedade_id = prop.id')
      .leftJoin('Filial', 'f', 'cp.filial_id = f.id')
      .innerJoin(
        'Pessoa',
        'produtor',
        'prop.produtor_id = produtor.id AND produtor.ativo = 1',
      )
      .leftJoin(
        'QueDiagnostico',
        'qd',
        'prop.id = qd.propriedade_id AND (qd.ativo = 1 OR qd.ativo IS NULL)' +
        (!!parametros.questionario_id
          ? ` AND qd.questionario_id = ${parametros.questionario_id}`
          : ''),
      )
      .leftJoin(
        'QueResposta',
        'resposta',
        'resposta.diagnostico_id = qd.id' +
        (!!parametros.tema_id
          ? ` AND resposta.tema_id = ${parametros.tema_id}`
          : ''),
      )
      .leftJoin(
        'QueResposta',
        'resposta_estimativa_producao',
        `resposta_estimativa_producao.pergunta_id = ${getIdPerguntaEstimativaProducao()} AND resposta_estimativa_producao.diagnostico_id = qd.id` +
        (!!parametros.tema_id
          ? ` AND resposta_estimativa_producao.tema_id = ${parametros.tema_id}`
          : ''),
      )
      .leftJoin(
        'Propriedade',
        'propriedades_atendimento',
        'propriedades_atendimento.id = qd.propriedade_id AND propriedades_atendimento.ativo = 1 AND resposta.id IS NOT NULL',
      )
      .leftJoin(
        'Pessoa',
        'produtores_atendimento',
        'produtores_atendimento.id = propriedades_atendimento.produtor_id AND produtores_atendimento.ativo = 1',
      )
      .where('f.ativo = 1')
      .groupBy('e.id')
      .addGroupBy('e.nome')
      .orderBy('e.nome');

    if (!!parametros.cliente_id) {
      consulta.andWhere('cp.cliente_id = :cliente_id', {
        cliente_id: parametros.cliente_id,
      });
    }

    if (!!parametros.safra_id) {
      consulta.andWhere('sp.safra_id = :safra_id', {
        safra_id: +parametros.safra_id,
      });
    }

    if (!!parametros.filial_id) {
      consulta.andWhere('f.id = :filial_id', {
        filial_id: parametros.filial_id,
      });
    }

    if (!!parametros.propriedade_id) {
      const propriedades = JSON.parse(parametros.propriedade_id);

      consulta.andWhere('prop.id IN (:...propriedades)', { propriedades });
    }

    const acompanhamentos: any[] = JSON.parse(
      JSON.stringify(await consulta.getRawMany()),
    );

    const acompanhamentosPorEstado: AcompanhamentoEstado = {};

    for (const a of acompanhamentos) {
      acompanhamentosPorEstado[a.estado_id] = a;
    }

    return acompanhamentosPorEstado;
  }
}

export type AcompanhamentoEstado = Record<string, AcompanhamentoEstadoItem>;

export type AcompanhamentoEstadoItem = {
  estado_id: number;
  estado: string;
  qtd_produtores_contratados: number;
  qtd_produtores_atendidos: number;
  porcentagem_atendimentos: string;
  previsao_produtividade_media: string;
};
