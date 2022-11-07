import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CoreService } from 'src/core';
import { Propriedade } from './propriedade.entity';

@Injectable()
export class PropriedadeService extends CoreService<Propriedade> {
  protected relacoesLista: string[] = ['produtor', 'municipio', 'filiais'];
  protected relacoesUnico: string[] = [
    'produtor',
    'municipio',
    'filiais',
    'daps',
  ];
  @InjectRepository(Propriedade)
  protected repositorio: Repository<Propriedade>;
  protected ModelConstructor = Propriedade;

  findAll(query?): Promise<Propriedade[]> {
    const { cliente_id, filial_id, safra_id } = query;
    delete query.cliente_id;
    delete query.filial_id;
    delete query.safra_id;

    const innerJoin = {};
    let innerJoinAndSelect = {};
    let where: any[];

    if ((safra_id)) {
      innerJoinAndSelect = {
        safra: 'propriedade.safras'
      }
      where = [`safra.id = ${safra_id}`];
    }

    if ((filial_id)) {
      innerJoinAndSelect = {
        filial: 'propriedade.filiais',
        safra: 'propriedade.safras',
      }
      where = [`filial.id = ${filial_id}`];
    }    
    if ((cliente_id)) {
      innerJoinAndSelect = {
        cliente: 'propriedade.clientes'
      }
      where = [`cliente.id = ${cliente_id}`];
    }    
    if ((safra_id) && (filial_id)) {
      innerJoinAndSelect = {
        safra: 'propriedade.safras',
        filial: 'propriedade.filiais'
      }
      where = [`safra.id = ${safra_id} and filial.id = ${filial_id}`];
    }
    if ((safra_id) && (cliente_id)) {
      innerJoinAndSelect = {
        safra: 'propriedade.safras',
        cliente: 'propriedade.clientes'
      }
      where = [`safra.id = ${safra_id} and cliente.id = ${cliente_id}`];
    }
    if ((filial_id) && (cliente_id)) {
      innerJoinAndSelect = {
        filial: 'propriedade.filiais',
        cliente: 'propriedade.clientes',
      }
      where = [`filial.id = ${filial_id} and cliente.id = ${cliente_id}`];
    }
    if ((safra_id) && (filial_id) && (cliente_id)) {
      innerJoinAndSelect = {
        cliente: 'propriedade.clientes',
        filial: 'propriedade.filiais',
        safra: 'propriedade.safras'
      }
      where = [`cliente.id = ${cliente_id} and filial.id = ${filial_id} and safra.id = ${safra_id}`];
    }

    const quandidadeDeParametros = Object.keys(query).length;
    return this.repositorio.find({
      join: {
        alias: 'propriedade',
        innerJoin,
        innerJoinAndSelect
      },
      where: qb => {
        where?.length == 1
          ? qb
            .where(...where)
            .andWhere(quandidadeDeParametros > 0 ? query : '1=1')
            .orderBy('propriedade.nome')
          : qb.where(quandidadeDeParametros > 0 ? query : '1=1')
            .orderBy('propriedade.nome');
      },
      relations: this.relacoesLista || [],
    });

  }

  getContagem(query?): Promise<number> {
    const consulta = this.repositorio.createQueryBuilder('p');

    if (query.ativo == '1') consulta.andWhere('p.ativo = 1');

    consulta
      .innerJoin('cliente_propriedade', 'cp', 'cp.propriedade_id = p.id')
      .where('cp.cliente_id = :cliente_id', { cliente_id: query.cliente_id });

    if (query.diagnostico_id && query.consultor_id) {
      consulta.innerJoin('que_diagnostico', 'qd', 'qd.propriedade_id = p.id');
      consulta.andWhere('qd.id = :diagnostico_id', {
        diagnostico_id: query.diagnostico_id,
      });
      consulta.andWhere('qd.consultor_id = :consultor_id ', {
        consultor_id: query.tecnico_id,
      });
    } else {
      if (query.consultor_id && !query.diagnostico_id) {
        consulta.innerJoin('que_diagnostico', 'qd', 'qd.propriedade_id = p.id');
        consulta.andWhere('qd.consultor_id = :consultor_id ', {
          consultor_id: query.tecnico_id,
        });
      }
      if (!query.consultor_id && query.diagnostico_id) {
        consulta.innerJoin('que_diagnostico', 'qd', 'qd.propriedade_id = p.id');
        consulta.andWhere('qd.id = :diagnostico_id', {
          diagnostico_id: query.diagnostico_id,
        });
      }
    }

    if (query.estado_id && query.municipio_id) {
      consulta
        .innerJoin('municipio', 'm', 'm.id = p.municipio_id')
        .andWhere('m.id = :municipio_id', { municipio_id: query.municipio_id });
    } else {
      if (!query.estado_id && query.municipio_id) {
        consulta.innerJoin('municipio', 'm', 'm.id = p.municipio_id');
        consulta.andWhere('m.id = :municipio_id', {
          municipio_id: query.municipio_id,
        });
      }
      if (query.estado_id && !query.municipio_id) {
        consulta.innerJoin('municipio', 'm', 'm.id = p.municipio_id');
        consulta.innerJoin('estado', 'e', 'e.id = m.estado_id');
        consulta.andWhere('e.id = :estado_id', { estado_id: query.estado_id });
      }
    }

    if (query.questionario_id && query.safra_id) {
      consulta
        .innerJoin('questionario', 'q', 'q.cliente_id = cp.cliente_id')
        .innerJoin('safra', 's', 's.id = q.safra_id')
        .andWhere('q.id = :questionario_id', {
          questionario_id: query.questionario_id,
        })
        .andWhere('s.id = :safra_id', { safra_id: query.safra_id });
    } else {
      if (!query.questionario_id && query.safra_id) {
        consulta.innerJoin('questionario', 'q', 'q.cliente_id = cp.cliente_id');
        consulta
          .innerJoin('safra', 's', 's.id = q.safra_id')
          .andWhere('s.id = :safra_id', { safra_id: query.safra_id });
      }
      if (query.questionario_id && !query.safra_id) {
        consulta.innerJoin('questionario', 'q', 'q.cliente_id = cp.cliente_id');
        consulta.andWhere('q.id = :questionario_id', {
          questionario_id: query.questionario_id,
        });
      }
    }
    if (query.filial_id) {
      consulta.andWhere('cp.filial_id = :filial_id', {
        filial_id: query.filial_id,
      });
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

    if (query.tema_id) {
      consulta
        .innerJoin('que_tema', 'qt', 'qt.cliente_id = cp.cliente_id')
        .andWhere('qt.id = :formulario_id', {
          formulario_id: query.formulario_id,
        });
    }

    consulta.select('COUNT(DISTINCT(cp.propriedade_id))');

    return consulta.getRawOne();
  }

  getProdutorContagemIndicador(query?): Promise<any> {
    // nessa query retiramos propriedades inativas da contagem
    const consulta = this.repositorio
      .createQueryBuilder()
      .from('safra_propriedade', 'sp')
      .innerJoin('propriedade', 'p', 'sp.propriedade_id = p.id')
      .where('p.ativo = true');

    consulta.select('COUNT(DISTINCT(sp.propriedade_id))');

    if (query.safra_id) {
      consulta.andWhere('safra_id = :safra_id', {
        safra_id: query.safra_id,
      });
    }

    return consulta.getRawOne();
  }

  getPropriedadeAreaContadaPorEstadoPlotted(
    query?,
  ): Promise<{ name: string; value: number }[]> {
    const consulta = this.repositorio
      .createQueryBuilder('p')
      .select('SUM(p.area_contratada) as value, e.sigla as name');

    if (query.ativo) consulta.where('p.ativo = 1');
    if (query.safra_id) {
      consulta
        .innerJoin('que_diagnostico', 'qd', 'p.id = qd.propriedade_id')
        .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    consulta
      .innerJoin('municipio', 'm', 'p.municipio_id = m.id')
      .innerJoin('estado', 'e', 'm.estado_id = e.id')
      .groupBy('name');

    return consulta.getRawMany() as Promise<{ name: string; value: number }[]>;
  }

  getMediaHectarePorEstado(query?): Promise<{ name: string; value: number }[]> {
    const consulta = this.repositorio
      .createQueryBuilder('p')
      .select('AVG(p.area_total) as value, e.sigla as name');

    if (query.ativo) {
      consulta.where('p.ativo = 1');
    }

    if (query.safra_id) {
      consulta
        .innerJoin('que_diagnostico', 'qd', 'p.id = qd.propriedade_id')
        .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    consulta
      .innerJoin('municipio', 'm', 'p.municipio_id = m.id')
      .innerJoin('estado', 'e', 'm.estado_id = e.id')
      .groupBy('name');

    return consulta.getRawMany() as Promise<{ name: string; value: number }[]>;
  }

  getComparativoDeInsumoComQuantidadeDeProdutoresPlotted(
    query?,
  ): Promise<{ name: string; percent: number; value: number }[]> {
    const consulta = this.repositorio.createQueryBuilder('p');

    consulta
      .select('i.nome as name, COUNT(qd.propriedade_id) as value')
      .innerJoin('que_diagnostico', 'qd', 'qd.propriedade_id = p.id')
      .innerJoin('que_resposta', 'r', 'qd.id = r.diagnostico_id')
      .innerJoin('que_resposta_insumo', 'qri', 'r.id = qri.resposta_id')
      .innerJoin('insumo', 'i', 'qri.insumo_id = i.id')
      .innerJoin('insumo_tipo', 'it', 'it.id = i.tipo_id')
      .where('r.pergunta_id = 72');

    if (query.ativo) consulta.andWhere('p.ativo = 1');
    if (query.safra_id) {
      consulta
        .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    consulta.groupBy('name').orderBy('value', 'DESC');

    return new Promise<{ name: string; percent: number; value: number }[]>(
      (resolve, reject) => {
        consulta
          .getRawMany()
          .then((rankInsumo: { name: string; value: string }[]) => {
            let max = 0;
            const rankWithPercent: {
              name: string;
              value: number;
              percent: number;
            }[] = [];

            rankInsumo.forEach(insumo => {
              if (Number(insumo.value) > max) {
                max = Number(insumo.value);
              }
            });

            rankInsumo.forEach(insumo => {
              rankWithPercent.push({
                name: insumo.name,
                percent: Math.ceil((Number(insumo.value) / max) * 100),
                value: Number(insumo.value),
              });
            });
            resolve(rankWithPercent);
          })
          .catch(e => {
            reject(e);
          });
      },
    );
  }

  listaMapa(
    query?,
  ): Promise<
    { propriedade: Propriedade; estimativa: string; cultivares: string }[]
  > {
    const consultaPropriedade = this.repositorio.createQueryBuilder('p');
    const consultaCutivare = this.repositorio.createQueryBuilder('p');
    const consultaEstimativa = this.repositorio.createQueryBuilder('p');
    const consultaPraga = this.repositorio.createQueryBuilder('p');

    consultaPropriedade.innerJoin(
      'que_diagnostico',
      'qd',
      'qd.propriedade_id  = p.id ',
    );
    consultaCutivare
      .select('p.id as propriedade, GROUP_CONCAT(DISTINCT i.nome) cultivares')
      .innerJoin('que_diagnostico', 'qd', 'qd.propriedade_id  = p.id ')
      .innerJoin('que_resposta', 'r', 'qd.id = r.diagnostico_id')
      .innerJoin('que_resposta_insumo', 'qri', 'r.id = qri.resposta_id')
      .innerJoin('insumo', 'i', 'qri.insumo_id = i.id')
      .where('r.pergunta_id = 72')
      .groupBy('propriedade');

    consultaEstimativa
      .select('p.id as propriedade, r.resultado estimativa')
      .innerJoin('que_diagnostico', 'qd', 'qd.propriedade_id  = p.id ')
      .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
      .innerJoin('que_resposta', 'r', 'qd.id = r.diagnostico_id')
      .where('r.pergunta_id = 74');

    consultaPraga
      .select('p.id as propriedade, r.resultado praga, r.pergunta_id pergunta')
      .innerJoin('que_diagnostico', 'qd', 'qd.propriedade_id  = p.id ')
      .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
      .innerJoin('que_resposta', 'r', 'qd.id = r.diagnostico_id')
      .where('(r.pergunta_id = 56 OR r.pergunta_id = 57)');

    if (query.praga_id) {
      consultaPropriedade
        .innerJoin(
          'que_resposta',
          'resposta_praga',
          'qd.id = resposta_praga.diagnostico_id AND resposta_praga.pergunta_id = 56',
        )
        .innerJoin(
          'que_resposta_item_lista',
          'qril1',
          'qril1.que_resposta_id = resposta_praga.id',
        )
        .where('qril1.que_item_lista_id = :praga_id', {
          praga_id: query.praga_id,
        });
    }

    if (query.insumo_id) {
      consultaPropriedade
        .innerJoin(
          'que_resposta',
          'resposta_insumo',
          'qd.id = resposta_insumo.diagnostico_id   AND resposta_insumo.pergunta_id = 72',
        )
        .innerJoin(
          'que_resposta_insumo',
          'qri',
          'qri.resposta_id = resposta_insumo.id',
        )
        .where('qri.insumo_id = :insumo_id', {
          insumo_id: query.insumo_id,
        });

      consultaCutivare.where('i.id = :insumo_id', {
        insumo_id: query.insumo_id,
      });
    }

    if (query.safra_id) {
      consultaPropriedade
        .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .where('q.safra_id = :safra_id', { safra_id: query.safra_id });
      consultaCutivare
        .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .where('q.safra_id = :safra_id', { safra_id: query.safra_id });
      consultaPraga
        .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .where('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    if (query.ativo) {
      consultaPropriedade.where('p.ativo = 1');
      consultaCutivare.where('p.ativo = 1');
      consultaPraga.where('p.ativo = 1');
    }

    return new Promise<
      {
        propriedade: Propriedade;
        estimativa: string;
        cultivares: string;
        praga: string;
      }[]
    >((resolve, reject) => {
      consultaPropriedade
        .getMany()
        .then((propriedadesArr: Propriedade[]) => {
          consultaEstimativa
            .getRawMany()
            .then(
              (
                estimativasArr: { propriedade: number; estimativa: string }[],
              ) => {
                consultaCutivare
                  .getRawMany()
                  .then(
                    (
                      cultivaresArr: {
                        propriedade: number;
                        cultivares: string;
                      }[],
                    ) => {
                      consultaPraga
                        .getRawMany()
                        .then(
                          (
                            pragasArr: {
                              propriedade: number;
                              praga: string;
                              pergunta: string;
                            }[],
                          ) => {
                            const response: {
                              propriedade: Propriedade;
                              estimativa: string;
                              cultivares: string;
                              praga: string;
                            }[] = [];
                            propriedadesArr.forEach(propriedade => {
                              const estimativa: string = estimativasArr.filter(
                                e => e.propriedade == propriedade.id,
                              )[0]?.estimativa;
                              const cultivares: string = cultivaresArr.filter(
                                c => c.propriedade == propriedade.id,
                              )[0]?.cultivares;
                              let praga;

                              pragasArr
                                .filter(c => c.propriedade == propriedade.id)
                                .forEach(pr => {
                                  if (
                                    pr.pergunta == '56' &&
                                    pr.praga == 'SIM'
                                  ) {
                                    praga = 'Apresenta praga';
                                  } else if (
                                    pr.pergunta == '57' &&
                                    pr.praga == 'SIM'
                                  ) {
                                    praga = 'Apresenta daninha';
                                  } else {
                                    praga = '';
                                  }
                                });

                              response.push({
                                propriedade,
                                cultivares: cultivares ? cultivares : '',
                                estimativa: estimativa ? estimativa : '',
                                praga: praga ? praga : '',
                              });
                            });
                            resolve(response);
                          },
                        )
                        .catch(e => reject(e));
                    },
                  )
                  .catch(e => reject(e));
              },
            )
            .catch(e => reject(e));
        })
        .catch(e => reject(e));
    });
  }

  getSelectItem(query?): Promise<{ label: string; value: number }[]> {
    const selectQuery: SelectQueryBuilder<any> = this.repositorio
      .createQueryBuilder('p')
      .select([
        'p.nome label',
        "CONCAT(p2.nome, ' ', p2.sobrenome) labelAlt",
        "CONCAT(p2.nome, ' ', p2.sobrenome, ' ', p.nome) filter",
        'p.id value',
      ])
      .innerJoin('pessoa', 'p2', 'p.produtor_id = p2.id')
      .where('1=1')
      .orderBy('p.nome');

    if (query?.ativo) {
      selectQuery.andWhere('p.ativo = 1');
    }

    if (query?.cliente_id) {
      selectQuery
        .innerJoin('cliente_propriedade', 'cp', 'p.id = cp.propriedade_id')
        .andWhere('cp.cliente_id = :cliente_id', {
          cliente_id: query?.cliente_id,
        });
    }

    return selectQuery.getRawMany();
  }
}
