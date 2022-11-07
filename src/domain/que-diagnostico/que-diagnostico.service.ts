import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository, SelectQueryBuilder } from 'typeorm';

import { CoreService } from 'src/core';
import { QueDiagnostico } from 'src/domain/que-diagnostico/que-diagnostico.entity';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

export type ConsultaLaudo3 = {
  estado?: string;
  filial?: string;
  consultores?: string;
  produtores_contratados?: number;
  produtores_atendidos?: number;
  atendimentos_realizados?: string | number;
  previsao_produtividade_media?: string;
  diferenca_dias_atendimento_plantio_media?: number | string;
};
export type PayloadConsultaLaudo3 = {
  estado: string;
  produtores_contratados: number;
  produtores_atendidos: number;
  atendimentos_realizados: number | string;
  filiais?: ConsultaLaudo3[];
};

@Injectable()
export class QueDiagnosticoService extends CoreService<QueDiagnostico> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(QueDiagnostico)
  protected repositorio: Repository<QueDiagnostico>;

  async getRelatorioLaudo03(query?): Promise<PayloadConsultaLaudo3[]> {
    const filtrar = (consulta: SelectQueryBuilder<any>) => {
      const { cliente_id, safra_id, questionario_id, filial_id } = query;
      let { propriedade_id } = query;

      if (filial_id) {
        consulta.andWhere('f.id = :filial_id', { filial_id });
      } else if (cliente_id) {
        consulta.andWhere('cp.cliente_id = :cliente_id', { cliente_id });
      }

      if (safra_id) {
        consulta.andWhere('sp.safra_id = :safra_id', { safra_id });
      }

      if (questionario_id) {
        consulta.andWhere('q.id = :questionario_id', { questionario_id });
      }

      if (propriedade_id) {
        propriedade_id = JSON.parse(propriedade_id);

        const isArray = Array.isArray(propriedade_id);

        if (!isArray) {
          propriedade_id = [propriedade_id];
        }

        consulta.andWhere('sp.propriedade_id IN (:propriedade_id)', {
          propriedade_id,
        });
      }
    };

    const consultaPipe = from(getConsulta().getRawMany()).pipe(
      map((res: ConsultaLaudo3[]) => {
        const payload: PayloadConsultaLaudo3[] = [];

        payload.push({
          estado: 'TOTAL',
          produtores_contratados: 0,
          produtores_atendidos: 0,
          atendimentos_realizados: 0,
        });

        for (const resPorFilial of res) {
          const match = payload.find(
            (element) => element.estado === resPorFilial.estado,
          );

          const {
            estado,
            produtores_atendidos,
            produtores_contratados,
            consultores,
            diferenca_dias_atendimento_plantio_media,
            previsao_produtividade_media,
            filial,
          } = resPorFilial;

          payload[0].produtores_contratados += +produtores_contratados;
          payload[0].produtores_atendidos += +produtores_atendidos;

          const porcentagemAtendimentos = +(
            (+produtores_atendidos / +produtores_contratados) *
            100
          ).toFixed(2);

          if (match) {
            const index = payload.indexOf(match);

            payload[index].produtores_atendidos += +produtores_atendidos;
            payload[index].produtores_contratados += +produtores_contratados;

            const porcentagemAtendimentos = +(
              (+payload[index].produtores_atendidos /
                +payload[index].produtores_contratados) *
              100
            ).toFixed(2);

            const porcentagemAtendimentosFilial = +(
              (+produtores_atendidos / +produtores_contratados) *
              100
            ).toFixed(2);

            payload[index].atendimentos_realizados = porcentagemAtendimentos;

            payload[index].filiais.push({
              filial,
              consultores: consultores ?? ' - ',
              produtores_contratados,
              produtores_atendidos,
              atendimentos_realizados: porcentagemAtendimentosFilial,
              previsao_produtividade_media,
              diferenca_dias_atendimento_plantio_media:
                diferenca_dias_atendimento_plantio_media ?? ' - ',
            });
          } else {
            payload.push({
              estado,
              produtores_contratados: +produtores_contratados,
              produtores_atendidos: +produtores_atendidos,
              atendimentos_realizados: porcentagemAtendimentos,
              filiais: [
                {
                  filial,
                  consultores: consultores ?? ' - ',
                  produtores_contratados,
                  produtores_atendidos,
                  previsao_produtividade_media,
                  atendimentos_realizados: porcentagemAtendimentos,
                  diferenca_dias_atendimento_plantio_media:
                    diferenca_dias_atendimento_plantio_media ?? ' - ',
                },
              ],
            });
          }
        }

        payload[0].atendimentos_realizados = +(
          (payload[0].produtores_atendidos /
            payload[0].produtores_contratados) *
          100
        ).toFixed(2);

        return payload;
      }),
    );

    return consultaPipe.toPromise();

    function getConsulta(): SelectQueryBuilder<any> {
      const consulta = getConnection().createQueryBuilder();

      consulta
        .select([
          'e.nome estado',
          'f.nome filial',
          "GROUP_CONCAT(DISTINCT atendimentos_consultores.consultor SEPARATOR ' | ') consultores",
          'COUNT(DISTINCT produtor.id) produtores_contratados',
          'IFNULL(atendimentos.produtores_atendidos, 0) produtores_atendidos',
          'IFNULL(atendimentos.previsao_produtividade_media, 0) previsao_produtividade_media',
          'atendimentos.diferenca_dias_atendimento_plantio_media diferenca_dias_atendimento_plantio_media',
        ])
        .from('safra_propriedade', 'sp');

      consulta
        .innerJoin('propriedade', 'p', 'sp.propriedade_id = p.id')
        .innerJoin('pessoa', 'produtor', 'p.produtor_id = produtor.id')
        .innerJoin('municipio', 'm', 'p.municipio_id = m.id')
        .innerJoin('estado', 'e', 'm.estado_id = e.id')
        .innerJoin('cliente_propriedade', 'cp', 'p.id = cp.propriedade_id')
        .innerJoin('filial', 'f', 'cp.filial_id = f.id')
        .leftJoin('questionario', 'q', 'sp.safra_id = q.safra_id')
        .leftJoin(
          `(${getAtendimentosGerais().getQuery()})`,
          'atendimentos',
          'atendimentos.estado_id = e.id AND atendimentos.filial_id = f.id',
        )
        .leftJoin(
          `(${getAtendimentosPorConsultor().getQuery()})`,
          'atendimentos_consultores',
          'atendimentos_consultores.estado_id = e.id AND atendimentos_consultores.filial_id = f.id',
        );

      consulta.groupBy('e.id').addGroupBy('f.id');

      filtrar(consulta);

      return consulta;
    }

    function getAtendimentosGerais(): SelectQueryBuilder<any> {
      const consultaAtendimentosGerais = getConnection().createQueryBuilder();

      consultaAtendimentosGerais
        .select([
          'e.id estado_id',
          'f.id filial_id',
          'COUNT(DISTINCT produtor.id) produtores_atendidos',
          'ROUND(IFNULL(AVG(resposta_previsao_produtividade.quantidade), 0), 2) previsao_produtividade_media',
          `
        ROUND(AVG(DATEDIFF(
                   IFNULL(STR_TO_DATE(resposta_data_atendimento.resultado, '%a %b %d %Y %T '),
                          STR_TO_DATE(resposta_data_atendimento.resultado, '%d/%m/%Y')),
                   IFNULL(STR_TO_DATE(resposta_data_plantio.resultado, '%a %b %d %Y %T '),
                          STR_TO_DATE(resposta_data_plantio.resultado, '%d/%m/%Y')))),
                 0) diferenca_dias_atendimento_plantio_media
        `,
        ])
        .from('safra_propriedade', 'sp');

      consultaAtendimentosGerais
        .innerJoin('propriedade', 'p', 'sp.propriedade_id = p.id')
        .innerJoin('pessoa', 'produtor', 'p.produtor_id = produtor.id')
        .innerJoin('municipio', 'm', 'p.municipio_id = m.id')
        .innerJoin('estado', 'e', 'm.estado_id = e.id')
        .innerJoin('cliente_propriedade', 'cp', 'p.id = cp.propriedade_id')
        .innerJoin('filial', 'f', 'cp.filial_id = f.id')
        .innerJoin('que_diagnostico', 'qd', 'p.id = qd.propriedade_id')
        .innerJoin(
          'questionario',
          'q',
          'qd.questionario_id = q.id AND sp.safra_id = q.safra_id',
        )
        .innerJoin(
          'que_resposta',
          'qr',
          'qr.diagnostico_id = qd.id AND qr.tema_id = 4 AND qr.pergunta_id IN (' +
            `SELECT pergunta_id FROM que_subtema_pergunta WHERE questionario_id = ${query.questionario_id} AND tema_id = 4` +
            ')',
        )
        .innerJoin(
          'que_resposta',
          'resposta_data_atendimento',
          'qd.id = resposta_data_atendimento.diagnostico_id AND resposta_data_atendimento.tema_id = 4 AND resposta_data_atendimento.pergunta_id = 98',
        )
        .innerJoin(
          'que_resposta',
          'resposta_previsao_produtividade',
          'resposta_data_atendimento.diagnostico_id = resposta_previsao_produtividade.diagnostico_id AND resposta_previsao_produtividade.tema_id = resposta_data_atendimento.tema_id AND resposta_previsao_produtividade.pergunta_id = 12',
        )
        .innerJoin(
          'que_resposta',
          'resposta_data_plantio',
          'resposta_previsao_produtividade.diagnostico_id = resposta_data_plantio.diagnostico_id AND resposta_data_plantio.tema_id = 2 AND resposta_data_plantio.pergunta_id = 40',
        );

      consultaAtendimentosGerais.groupBy('e.id').addGroupBy('f.id');

      consultaAtendimentosGerais.having(
        'COUNT(DISTINCT qr.pergunta_id) >= (' +
          `SELECT COUNT(DISTINCT pergunta_id) FROM que_subtema_pergunta WHERE questionario_id = ${query.questionario_id} AND tema_id = 4` +
          ')',
      );

      filtrar(consultaAtendimentosGerais);

      return consultaAtendimentosGerais;
    }

    function getAtendimentosPorConsultor(): SelectQueryBuilder<any> {
      const consultaAtendimentosPorConsultor = getConnection().createQueryBuilder();

      consultaAtendimentosPorConsultor
        .select([
          'e.id estado_id',
          'f.id filial_id',
          "CONCAT(consultor.nome, ' ', UPPER(LEFT(consultor.sobrenome, 1)), '. ', COUNT(DISTINCT produtor.id)) consultor",
        ])
        .from('safra_propriedade', 'sp');

      consultaAtendimentosPorConsultor
        .innerJoin(
          'que_diagnostico',
          'qd',
          'sp.propriedade_id = qd.propriedade_id',
        )
        .innerJoin(
          'questionario',
          'q',
          'qd.questionario_id = q.id AND sp.safra_id = q.safra_id',
        )
        .innerJoin(
          'que_resposta',
          'qr',
          'qr.diagnostico_id = qd.id AND qr.tema_id = 4 AND qr.pergunta_id IN (' +
            `SELECT pergunta_id FROM que_subtema_pergunta WHERE questionario_id = ${query.questionario_id} AND tema_id = 4` +
            ')',
        )
        .innerJoin('pessoa', 'consultor', 'qd.consultor_id = consultor.id')
        .innerJoin('propriedade', 'p', 'sp.propriedade_id = p.id')
        .innerJoin('pessoa', 'produtor', 'p.produtor_id = produtor.id')
        .innerJoin('municipio', 'm', 'p.municipio_id = m.id')
        .innerJoin('estado', 'e', 'm.estado_id = e.id')
        .innerJoin('cliente_propriedade', 'cp', 'p.id = cp.propriedade_id')
        .innerJoin('filial', 'f', 'cp.filial_id = f.id')
        .innerJoin(
          'que_resposta',
          'resposta_data_atendimento',
          'qd.id = resposta_data_atendimento.diagnostico_id AND resposta_data_atendimento.tema_id = 4 AND resposta_data_atendimento.pergunta_id = 98',
        )
        .innerJoin(
          'que_resposta',
          'resposta_previsao_produtividade',
          'resposta_data_atendimento.diagnostico_id = resposta_previsao_produtividade.diagnostico_id AND resposta_previsao_produtividade.tema_id = resposta_data_atendimento.tema_id AND resposta_previsao_produtividade.pergunta_id = 12',
        )
        .innerJoin(
          'que_resposta',
          'resposta_data_plantio',
          'resposta_previsao_produtividade.diagnostico_id = resposta_data_plantio.diagnostico_id AND resposta_data_plantio.tema_id = 2 AND resposta_data_plantio.pergunta_id = 40',
        );

      consultaAtendimentosPorConsultor
        .groupBy('e.id')
        .addGroupBy('f.id')
        .addGroupBy('consultor.id');

      consultaAtendimentosPorConsultor.having(
        'COUNT(DISTINCT qr.pergunta_id) >= (' +
          `SELECT COUNT(DISTINCT pergunta_id) FROM que_subtema_pergunta WHERE questionario_id = ${query.questionario_id} AND tema_id = 4` +
          ')',
      );

      filtrar(consultaAtendimentosPorConsultor);

      return consultaAtendimentosPorConsultor;
    }
  }
}
