import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Filial } from './filial.entity';

@Injectable()
export class FilialService extends CoreService<Filial> {
  protected relacoesLista: string[] = ['municipio', 'municipio.estado'];
  protected relacoesUnico: string[] = [
    'cliente',
    'municipio',
    'municipio.estado',
  ];
  @InjectRepository(Filial)
  protected repositorio: Repository<Filial>;

  async acompanhamentoPorFilial(parametros): Promise<AcompanhamentoFilial> {
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

    const getIdPerguntaDataSemeadura = (): number => {
      switch (Number(parametros.tema_id)) {
        case 2:
        case 3:
        case 4:
          return 40;
        default:
          return 18;
      }
    };

    const consulta = this.queryBuilder
      .select([
        "IFNULL(f.nome, '-') filial",
        "IFNULL(e.id, '-') estado_id",
        "IFNULL(GROUP_CONCAT(DISTINCT CONCAT(consultores_atendimento.nome, ' ', consultores_atendimento.sobrenome) SEPARATOR', '), '-') consultores",
        'COUNT(DISTINCT produtor.id)               qtd_produtores_contratados',
        "COUNT(DISTINCT `resposta_estimativa_producao`.`id`) qtd_produtores_atendidos",
        "CONCAT(ROUND((COUNT(DISTINCT `resposta_estimativa_producao`.`id`) / COUNT(DISTINCT produtor.id) * 100), 0), '%') porcentagem_atendimentos",
        "IFNULL(ROUND(AVG(`resposta_estimativa_producao`.`resultado`), 2), '-') previsao_produtividade_media",
        "IFNULL(DATEDIFF(STR_TO_DATE(MIN(case when  LENGTH(resposta_data_semeadura.resultado) > 2 then  replace(SUBSTRING(resposta_data_semeadura.resultado, 1, 10), '/', '-') else null end), '%d-%m-%Y'), MIN(qd.data_atendimento)), '-') media_dias_atendimento_antes_plantio",
      ])
      .from('Filial', 'f')
      .leftJoin('ClientePropriedade', 'cp', 'f.id = cp.filial_id')
      .innerJoin(
        'Propriedade',
        'prop',
        'cp.propriedade_id = prop.id AND prop.ativo = 1',
      )
      .innerJoin('safra_propriedade', 'sp', 'prop.id = sp.propriedade_id')
      .leftJoin('Municipio', 'm', 'prop.municipio_id = m.id')
      .leftJoin('Estado', 'e', 'm.estado_id = e.id')
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
        'QueResposta',
        'resposta_data_semeadura',
        `resposta_data_semeadura.pergunta_id = ${getIdPerguntaDataSemeadura()} AND resposta_data_semeadura.diagnostico_id = qd.id` +
        (!!parametros.tema_id
          ? ` AND resposta_data_semeadura.tema_id = ${parametros.tema_id}`
          : ''),
      )
      .leftJoin(
        'Propriedade',
        'propriedades_atendimento',
        'propriedades_atendimento.id = qd.propriedade_id AND resposta.id IS NOT NULL AND propriedades_atendimento.ativo = 1',
      )
      .leftJoin(
        'Pessoa',
        'produtores_atendimento',
        'produtores_atendimento.id = propriedades_atendimento.produtor_id AND produtores_atendimento.ativo = 1',
      )
      .leftJoin(
        'Pessoa',
        'consultores_atendimento',
        'qd.consultor_id = consultores_atendimento.id AND produtores_atendimento.id IS NOT NULL',
      )
      .where('f.ativo = 1')
      .groupBy('f.id')
      .addGroupBy('f.nome')
      .addGroupBy('e.id')
      .orderBy('e.id')
      .addOrderBy('f.nome');

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

    const acompanhamentosPorFilial: AcompanhamentoFilial = {};

    for (const a of acompanhamentos) {
      if (!acompanhamentosPorFilial[a.estado_id]) {
        acompanhamentosPorFilial[a.estado_id] = [];
      }

      acompanhamentosPorFilial[a.estado_id].push(a);
    }

    return acompanhamentosPorFilial;
  }
}

export type AcompanhamentoFilial = Record<string, AcompanhamentoFilialItem[]>;

export type AcompanhamentoFilialItem = {
  estado_id: string;
  filial: string;
  consultores: string;
  qtd_produtores_contratados: string;

  qtd_produtores_atendidos: string;
  porcentagem_atendimentos: string;
  previsao_produtividade_media: string;
  media_dias_atendimento_antes_plantio: string;
};
