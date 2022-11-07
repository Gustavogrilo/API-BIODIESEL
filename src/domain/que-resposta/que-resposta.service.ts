import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getConnection, Repository, SelectQueryBuilder } from 'typeorm';

import { CoreService } from 'src/core';
import { QueResposta } from './que-respostas.entity';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class QueRespostaService extends CoreService<QueResposta> {
  protected relacoesLista: string[] = ['insumos', 'insumos.insumo'];
  protected relacoesUnico: string[] = ['anexos'];
  @InjectRepository(QueResposta)
  protected repositorio: Repository<QueResposta>;

  save(data): Promise<QueResposta> {
    data = Object.assign(new QueResposta(), data);

    return this.repositorio.save(data);
  }

  async imagensPorPropriedade(parametros): Promise<ImagensPropriedade> {
    const consulta = this.queryBuilder
      .select([
        'propriedade.nome propriedade',
        'propriedade.id propriedade_id',
        'CONCAT(produtor.nome, " ", produtor.sobrenome) produtor',
        'produtor.id produtor_id',
        'CONCAT(municipio.nome, " - ", estado.sigla) municipio',
        'filial.nome filial',
        'anexo.nome',
        'anexo.tipo',
        'CASE WHEN SUBSTRING(anexo.tipo, 1, 5) LIKE "image" THEN anexo.arquivo ELSE NULL END anexo_arquivo',
      ])
      .from('Propriedade', 'propriedade')
      .leftJoin('Pessoa', 'produtor', 'propriedade.produtor_id = produtor.id')
      .leftJoin(
        'Municipio',
        'municipio',
        'propriedade.municipio_id = municipio.id',
      )
      .leftJoin('Estado', 'estado', 'municipio.estado_id = estado.id')
      .leftJoin(
        'QueDiagnostico',
        'diagnostico',
        'propriedade.id = diagnostico.propriedade_id',
      )
      .leftJoin(
        'Questionario',
        'questionario',
        'diagnostico.questionario_id = questionario.id',
      )
      .leftJoin(
        'QuestionarioTema',
        'questionario_tema',
        'questionario.id = questionario_tema.questionario_id',
      )
      .leftJoin(
        'QueTema',
        'que_tema',
        'questionario_tema.tema_id = que_tema.id',
      )
      .leftJoin(
        'ClientePropriedade',
        'cliente_propriedade',
        'propriedade.id = cliente_propriedade.propriedade_id AND cliente_propriedade.cliente_id = questionario.cliente_id',
      )
      .leftJoin('Filial', 'filial', 'cliente_propriedade.filial_id = filial.id')
      .leftJoin(
        'QueResposta',
        'resposta',
        'diagnostico.id = resposta.diagnostico_id AND resposta.tema_id = que_tema.id',
      )
      .leftJoin(
        'QueRespostaAnexo',
        'resposta_anexo',
        'resposta.id = resposta_anexo.resposta_id',
      )
      .leftJoin('Anexo', 'anexo', 'anexo.id = resposta_anexo.anexo_id')
      .where('SUBSTRING(anexo.tipo, 1, 5) LIKE "image"');

    if (!!parametros.cliente_id) {
      consulta.andWhere('questionario.cliente_id = :cliente_id', {
        cliente_id: parametros.cliente_id,
      });
    }

    if (!!parametros.filial_id) {
      consulta.andWhere('filial.id = :filial_id', {
        filial_id: parametros.filial_id,
      });
    }

    if (!!parametros.safra_id) {
      consulta.andWhere('questionario.safra_id = :safra_id', {
        safra_id: parametros.safra_id,
      });
    }

    if (!!parametros.questionario_id) {
      consulta.andWhere('questionario.id = :questionario_id', {
        questionario_id: parametros.questionario_id,
      });
    }

    if (!!parametros.tema_id) {
      consulta.andWhere('que_tema.id = :tema_id', {
        tema_id: parametros.tema_id,
      });
    }

    if (!!parametros.estado_id) {
      consulta.andWhere('estado.id = :estado_id', {
        estado_id: parametros.estado_id,
      });
    }

    if (!!parametros.municipio_id) {
      consulta.andWhere('municipio.id = :municipio_id', {
        municipio_id: parametros.municipio_id,
      });
    }

    if (!!parametros.propriedade_id) {
      consulta.andWhere('propriedade.id IN (:propriedades)', {
        propriedades: parametros.propriedade_id,
      });
    }

    if (!!parametros.tecnico_id) {
      consulta.andWhere('diagnostico.consultor_id = :tecnico_id', {
        tecnico_id: +parametros.tecnico_id,
      });
    }

    const imagens: any[] = JSON.parse(
      JSON.stringify(await consulta.getRawMany()),
    );

    const imagensPorPropriedade: ImagensPropriedade = {};

    for (const imagem of imagens) {
      if (!imagensPorPropriedade[imagem.propriedade_id]) {
        imagensPorPropriedade[imagem.propriedade_id] = [];
      }

      imagensPorPropriedade[imagem.propriedade_id].push(imagem);
    }

    return imagensPorPropriedade;
  }

  getContagem(query?): Promise<number> {
    const consulta = getConnection()
      .createQueryBuilder()
      .select(['COUNT(DISTINCT `p`.`id`) as laudos',
        `(select count(distinct va.propriedade_id) from view_atendimento va 
                 where va.safra_id = q.safra_id 
                   and va.tema_id = qr.tema_id 
                   and va.questionario_id = q.id
                   and va.perguntas = va.respostas
                   ) as concluido`])
      .from('propriedade', 'p');

    consulta
      .innerJoin(
        'pessoa',
        'produtor',
        'p.produtor_id = produtor.id AND produtor.ativo IS TRUE',
      )
      .innerJoin(
        'que_diagnostico',
        'qd',
        'p.id = qd.propriedade_id AND qd.data_atendimento IS NOT NULL',
      )
      .innerJoin('questionario', 'q', 'qd.questionario = q.id')
      .innerJoin('que_resposta', 'qr', 'qd.id = qr.diagnostico_id')
      .innerJoin(
        'safra_propriedade',
        'sp',
        'p.id = sp.propriedade_id AND q.safra_id = sp.safra_id',
      )
      .where('p.ativo = 1');

    if (query.tema_id) {
      consulta.andWhere('qr.tema_id = :tema_id', { tema_id: query.tema_id });
    }

    if (query.diagnostico_id && query.consultor_id) {
      consulta
        .andWhere('qd.id = :diagnostico_id', {
          diagnostico_id: query.diagnostico_id,
        })
        .andWhere('qd.consultor_id = :consultor_id ', {
          consultor_id: query.tecnico_id,
        });
    } else {
      if (query.consultor_id && !query.diagnostico_id) {
        consulta.andWhere('qd.consultor_id = :consultor_id ', {
          consultor_id: query.tecnico_id,
        });
      }
      if (!query.consultor_id && query.diagnostico_id) {
        consulta.andWhere('qd.id = :diagnostico_id', {
          diagnostico_id: query.diagnostico_id,
        });
      }
    }

    if (query.estado_id && query.municipio_id) {
      consulta
        .leftJoin('municipio', 'm', 'm.id = p.municipio_id')
        .andWhere('m.id = :municipio_id', { municipio_id: query.municipio_id });
    } else {
      if (!query.estado_id && query.municipio_id) {
        consulta.leftJoin('municipio', 'm', 'm.id = p.municipio_id');
        consulta.andWhere('m.id = :municipio_id', {
          municipio_id: query.municipio_id,
        });
      }
      if (query.estado_id && !query.municipio_id) {
        consulta.leftJoin('municipio', 'm', 'm.id = p.municipio_id');
        consulta.leftJoin('estado', 'e', 'e.id = m.estado_id');
        consulta.andWhere('e.id = :estado_id', { estado_id: query.estado_id });
      }
    }

    if (query.safra_id) {
      consulta.andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    if (query.questionario_id) {
      consulta.andWhere('q.id = :questionario_id', {
        questionario_id: query.questionario_id,
      });
    }

    if (query.filial_id || query.cliente_id) {
      consulta.innerJoin(
        'cliente_propriedade',
        'cp',
        'p.id = cp.propriedade_id',
      );

      if (query.cliente_id) {
        consulta.andWhere('cp.cliente_id = :cliente_id', {
          cliente_id: query.cliente_id,
        });
      }
      if (query.filial_id) {
        consulta.andWhere('cp.filial_id = :filial_id', {
          filial_id: query.filial_id,
        });
      }
    }

    if (query.propriedade_id) {
      consulta.andWhere('p.id = :propriedade_id', {
        propriedade_id: query.propriedade_id,
      });
    }

    if (query.produtor_id) {
      consulta.andWhere('p.produtor_id = :produtor_id', {
        produtor_id: query.produtor_id,
      });
    }

    return consulta.getRawOne();
  }

  async getIndicadoresQualitativos(query?) {
    let resMedia;
    let resSoma;
    let resPrevisaoRendimento;
    let resEstimativaDeProducao;

    const filtrarResultados = (
      qb: SelectQueryBuilder<QueResposta>,
      qrAlias = 'qr',
    ) => {
      const {
        cliente_id,
        filial_id,
        safra_id,
        tema_id,
        questionario_id,
        consultor_id,
        produtor_id,
        propriedade_id,
        estado_id,
        municipio_id,
        insumo_id,
        praga_id,
      } = query;

      qb.innerJoin('que_diagnostico', 'qd', qrAlias + '.diagnostico_id = qd.id')
        .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .innerJoin('propriedade', 'p', 'qd.propriedade_id = p.id');

      if (filial_id) {
        qb.innerJoin(
          'cliente_propriedade',
          'cp',
          'qd.propriedade_id = cp.propriedade_id',
        );

        qb.andWhere('cp.filial_id = :filial_id', { filial_id });
      } else if (cliente_id) {
        qb.andWhere('q.cliente_id = :cliente_id', { cliente_id });
      }

      if (tema_id) {
        qb.andWhere(qrAlias + '.tema_id = :tema_id', { tema_id });
      }

      if (questionario_id) {
        qb.andWhere('q.id = :questionario_id', { questionario_id });
      }

      if (safra_id) {
        qb.andWhere('q.safra_id = :safra_id', { safra_id });
      }

      if (consultor_id) {
        qb.andWhere('qd.consultor_id = :consultor_id', { consultor_id });
      }

      if (propriedade_id) {
        qb.andWhere('qd.propriedade_id = :propriedade_id', { propriedade_id });
      } else if (produtor_id) {
        qb.andWhere('p.produtor_id = :produtor_id', { produtor_id });
      }

      if (municipio_id) {
        qb.andWhere('p.municipio_id = :municipio_id', { municipio_id });
      } else if (estado_id) {
        qb.innerJoin('municipio', 'm', 'p.municipio_id = m.id');

        qb.andWhere('m.estado_id = :estado_id', { estado_id });
      }
    };

    const carregarMedias = async () => {
      const consulta = this.repositorio.createQueryBuilder('qr');

      consulta.select(['qp.nome name', 'round(avg(qr.resultado), 2) value']);

      consulta.innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id');

      consulta.where('qp.id IN (:perguntas)', {
        perguntas: [88, 108, 114, 139],
      });

      consulta.groupBy('qp.nome');

      consulta.orderBy('qp.nome');

      filtrarResultados(consulta);

      resMedia = await consulta.getRawMany();
    };

    const carregarSomas = async () => {
      const consulta = this.repositorio.createQueryBuilder('qr');

      consulta.select(['qp.nome name', 'round(SUM(qr.resultado), 2) value']);

      consulta.innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id');

      consulta.where('qr.tema_id = 1 and qp.id IN (:perguntas)', { perguntas: [91] });

      consulta.groupBy('qp.nome');

      consulta.orderBy('qp.nome');

      filtrarResultados(consulta);

      resSoma = await consulta.getRawMany();
    };

    const carregarPrevisaoDeRendimento = async () => {
      const consultaPrevisaoRendimento = this.repositorio.createQueryBuilder(
        'espacamento_entre_linhas',
      );

      consultaPrevisaoRendimento.select([
        'ROUND(((10 / AVG(espacamento_entre_linhas.resultado) * AVG(plantas_por_metro_linear.resultado)) * AVG(grao_por_planta.resultado) * AVG(peso_100_graos.resultado) / 60), 2) resultado',
      ]);

      consultaPrevisaoRendimento.innerJoin(
        'que_resposta',
        'plantas_por_metro_linear',
        'espacamento_entre_linhas.diagnostico_id = plantas_por_metro_linear.diagnostico_id AND plantas_por_metro_linear.pergunta_id = 139 ' +
        `AND plantas_por_metro_linear.id IN (
          SELECT MAX(que_resposta.id)
          FROM que_resposta
            JOIN que_diagnostico ON que_resposta.diagnostico_id = que_diagnostico.id
          WHERE pergunta_id = 139
          GROUP BY que_diagnostico.propriedade_id
         )`,
      );
      consultaPrevisaoRendimento.innerJoin(
        'que_resposta',
        'grao_por_planta',
        'plantas_por_metro_linear.diagnostico_id = grao_por_planta.diagnostico_id AND grao_por_planta.pergunta_id = 136 ' +
        `AND grao_por_planta.id IN (
          SELECT MAX(que_resposta.id)
          FROM que_resposta
            JOIN que_diagnostico ON que_resposta.diagnostico_id = que_diagnostico.id
          WHERE pergunta_id = 136
          GROUP BY que_diagnostico.propriedade_id
         )`,
      );
      consultaPrevisaoRendimento.innerJoin(
        'que_resposta',
        'peso_100_graos',
        'grao_por_planta.diagnostico_id = peso_100_graos.diagnostico_id AND peso_100_graos.pergunta_id = 66 ' +
        `AND peso_100_graos.id IN (
          SELECT MAX(que_resposta.id)
          FROM que_resposta
            JOIN que_diagnostico ON que_resposta.diagnostico_id = que_diagnostico.id
          WHERE pergunta_id = 66
          GROUP BY que_diagnostico.propriedade_id
         )`,
      );

      consultaPrevisaoRendimento
        .where('espacamento_entre_linhas.pergunta_id = 88')
        .andWhere(
          `espacamento_entre_linhas.id IN (
          SELECT MAX(que_resposta.id)
          FROM que_resposta
            JOIN que_diagnostico ON que_resposta.diagnostico_id = que_diagnostico.id
          WHERE pergunta_id = 88
          GROUP BY que_diagnostico.propriedade_id
         )`,
        );

      filtrarResultados(consultaPrevisaoRendimento, 'espacamento_entre_linhas');

      consultaPrevisaoRendimento.groupBy('p.id');

      resPrevisaoRendimento = this.queryBuilder
        .select([
          "'PREVISÃO DE RENDIMENTO (sacas)' AS name",
          'SUM(previsao_rendimento.resultado) AS value',
        ])
        .from(
          `(${consultaPrevisaoRendimento.getQuery()})`,
          'previsao_rendimento',
        );

      resPrevisaoRendimento.setParameters(
        consultaPrevisaoRendimento.getParameters(),
      );

      resPrevisaoRendimento = await resPrevisaoRendimento.getRawMany();
    };

    const carregarEstimativaDeProducao = async () => {
      const consultaEstimativaDeProducao = this.repositorio.createQueryBuilder(
        'estimativa_producao',
      );

      consultaEstimativaDeProducao.select([
        '(AVG(estimativa_producao.resultado) * AVG(area_contratada.resultado)) resultado',
      ]);

      consultaEstimativaDeProducao.innerJoin(
        'que_resposta',
        'area_contratada',
        'estimativa_producao.diagnostico_id = area_contratada.diagnostico_id AND area_contratada.pergunta_id = 91 ' +
        `AND area_contratada.id IN (
          SELECT MAX(que_resposta.id)
          FROM que_resposta
            JOIN que_diagnostico ON que_resposta.diagnostico_id = que_diagnostico.id
          WHERE pergunta_id = 91
          GROUP BY que_diagnostico.propriedade_id
         )`,
      );

      consultaEstimativaDeProducao
        .where('estimativa_producao.pergunta_id = 74')
        .andWhere(
          `estimativa_producao.id IN (
                  SELECT MAX(que_resposta.id)
                  FROM que_resposta
                    JOIN que_diagnostico ON que_resposta.diagnostico_id = que_diagnostico.id
                   WHERE pergunta_id = 74
                  GROUP BY que_diagnostico.propriedade_id
                  )`,
        );

      filtrarResultados(consultaEstimativaDeProducao, 'estimativa_producao');

      consultaEstimativaDeProducao.groupBy('p.id');

      resEstimativaDeProducao = this.queryBuilder
        .select([
          "'ESTIMATIVA DE PRODUÇÃO (sacas)' AS name",
          'IFNULL(ROUND(SUM(estimativa_producao.resultado), 2), 0) AS value',
        ])
        .from(
          `(${consultaEstimativaDeProducao.getQuery()})`,
          'estimativa_producao',
        );

      resEstimativaDeProducao.setParameters(
        consultaEstimativaDeProducao.getParameters(),
      );

      resEstimativaDeProducao = await resEstimativaDeProducao.getRawMany();
    };

    await Promise.all([
      carregarMedias(),
      carregarSomas(),
      carregarPrevisaoDeRendimento(),
      carregarEstimativaDeProducao(),
    ]);

    return [
      ...resMedia,
      ...resSoma,
      ...resPrevisaoRendimento,
      ...resEstimativaDeProducao,
    ];
  }

  async getMaioresProblemas(query?) {
    const perguntasIds = [56, 73];
    const labelPragas = 'Pragas';
    const labelPlantasDaninhas = 'Plantas Daninhas';

    const consulta = this.repositorio.createQueryBuilder('qr');

    consulta.select([
      `(CASE WHEN qr.pergunta_id = 56 THEN '${labelPragas}' WHEN qr.pergunta_id = 73 THEN '${labelPlantasDaninhas}' ELSE '' END) AS tipo`,
      'qil.nome name',
      'COUNT(*) value',
    ]);

    consulta
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .innerJoin(
        'que_resposta_item_lista',
        'qril',
        'qr.id = qril.que_resposta_id',
      )
      .innerJoin('que_item_lista', 'qil', 'qril.que_item_lista_id = qil.id');

    consulta.where('qr.pergunta_id in (:perguntasIds)', { perguntasIds });

    const {
      cliente_id,
      estado_id,
      municipio_id,
      filial_id,
      consultor_id,
      produtor_id,
      propriedade_id,
      safra_id,
      questionario_id,
      tema_id,
    } = query;

    if (filial_id) {
      consulta.innerJoin(
        'cliente_propriedade',
        'cp',
        'cp.propriedade_id = qd.propriedade_id',
      );

      consulta.andWhere(
        'cp.cliente_id = :cliente_id AND cp.filial_id = :filial_id',
        { cliente_id, filial_id },
      );
    }
    if (cliente_id) {
      consulta.innerJoin(
        'cliente_propriedade',
        'cp',
        'cp.propriedade_id = qd.propriedade_id',
      );

      consulta.andWhere('cp.cliente_id = :cliente_id', { cliente_id });
    }

    if (consultor_id) {
      consulta.andWhere('qd.consultor_id = :consultor_id', { consultor_id });
    }

    if (propriedade_id) {
      consulta.andWhere('qd.propriedade_id = :propriedade_id', {
        propriedade_id,
      });
    }
    if (produtor_id || municipio_id || estado_id) {
      consulta.innerJoin('propriedade', 'p', 'qd.propriedade_id = p.id');

      if (produtor_id) {
        consulta.andWhere('p.produtor_id = :produtor_id', { produtor_id });
      }

      if (municipio_id) {
        consulta.andWhere('p.municipio_id = :municipio_id', { municipio_id });
      } else if (estado_id) {
        consulta.innerJoin('municipio', 'm', 'm.id = p.municipio_id');

        consulta.andWhere('m.estado_id = :estado_id', { estado_id });
      }
    }

    if (tema_id && questionario_id) {
      consulta
        .andWhere('qd.questionario_id = :questionario_id', {
          questionario_id,
        })
        .andWhere('qr.tema_id = :tema_id', { tema_id });
    }
    if (questionario_id) {
      consulta.andWhere('qd.questionario_id = :questionario_id', {
        questionario_id,
      });
    }
    if (safra_id) {
      consulta.innerJoin('questionario', 'que', 'qd.questionario_id = que.id');

      consulta.andWhere('que.safra_id = :safra_id', {
        safra_id,
      });
    }

    consulta.groupBy('qr.pergunta_id').addGroupBy('qil.nome');

    consulta
      .orderBy('tipo')
      .addOrderBy('COUNT(*)', 'DESC')
      .addOrderBy('qil.nome');

    const consultaAsObservable = from(consulta.getRawMany()).pipe(
      map(problemas => {
        const payload: {
          tipo_problema: string;
          itens: { name: string; value: number }[];
        }[] = [
            {
              tipo_problema: labelPlantasDaninhas,
              itens: [],
            },
            {
              tipo_problema: labelPragas,
              itens: [],
            },
          ];

        for (const problema of problemas) {
          const { tipo, name, value } = problema;

          const tipoIndex = payload.indexOf(
            payload.find(
              payloadElement => payloadElement.tipo_problema === tipo,
            ),
          );

          const tipoLength = payload[tipoIndex].itens.length;

          // Se o tipo ja conter 3 itens, o restante e agrupado
          if (tipoLength === 3) {
            payload[tipoIndex].itens.push({
              name: 'Outros',
              value: +value,
            });
          } else if (tipoLength > 3) {
            payload[tipoIndex].itens[3].value += +value;
          } else {
            payload[tipoIndex].itens.push({ name, value: +value });
          }
        }

        return payload;
      }),
    );

    return consultaAsObservable.toPromise();
  }

  findById(id: number): Promise<QueResposta> {
    return this.repositorio
      .findOne(id, {
        relations: this.relacoesUnico || [],
      })
      .then(response => {
        response?.anexos?.forEach(item => {
          delete item.arquivo;
        });

        return response;
      });
  }
}

export type ImagensPropriedade = Record<
  string,
  {
    anexo_nome: string;
    anexo_tipo: string;
    anexo_arquivo: Buffer;
    propriedade: string;
    propriedade_id: number;
    produtor: string;
    produtor_id: number;
    municipio: string;
    filial: string;
    croqui?: boolean;
  }[]
>;
