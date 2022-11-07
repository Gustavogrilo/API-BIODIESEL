import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getConnection, Repository } from 'typeorm';

import { from } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService, QueryParams } from 'src/core';
import { Perfil } from './perfil.entity';
import { PerfilTema } from '../perfil-tema/perfil-tema.entity';
import { PerfilSubtema } from '../perfil-subtema/perfil-subtema.entity';
import { PerfilItem } from '../perfil-item/perfil-item.entity';

@Injectable()
export class PerfilService extends CoreService<Perfil> {
  protected relacoesLista: string[] = [];
  protected relacoesUnico: string[] = [];

  @InjectRepository(Perfil)
  protected repositorio: Repository<Perfil>;

  private logger = new Logger('Perfil Service');

  findAll(query?): Promise<Perfil[]> {
    const { cliente_id } = query;

    delete query.cliente_id;

    const quandidadeDeParametros = Object.keys(query).length;

    return this.repositorio.find({
      join: {
        alias: 'perfil',
        innerJoin: cliente_id
          ? {
              cliente: 'perfil.clientes',
            }
          : {},
      },
      where: qb => {
        cliente_id
          ? qb
              .where('cliente.id = :cliente_id', { cliente_id })
              .andWhere(quandidadeDeParametros > 0 ? query : '1=1')
          : qb.where(quandidadeDeParametros > 0 ? query : '1=1');
      },
      relations: this.relacoesLista || [],
    });
  }

  findById(id: number): Promise<Perfil> {
    const ativo = (tabela: string): string => {
      return `(${tabela}.ativo = 1 OR ${tabela}.ativo IS NULL)`;
    };

    const promise = this.repositorio.findOne(id, {
      join: {
        alias: 'perfil',
        leftJoinAndSelect: {
          tema: 'perfil.perfil_temas',
          subtema: 'tema.perfil_subtemas',
          item: 'subtema.perfil_itens',
          clientes: 'perfil.clientes',
        },
      },
      where: qb => {
        qb.where(ativo('perfil'))
          .andWhere(ativo('tema'))
          .andWhere(ativo('subtema'))
          .andWhere(ativo('item'));
      },
    });

    return from(promise)
      .pipe(
        map(perfil => {
          perfil.perfil_temas?.sort((a, b) => a.ordem - b.ordem);

          perfil.perfil_temas?.forEach(tema => {
            tema.perfil_subtemas?.sort((a, b) => a.ordem - b.ordem);

            tema.perfil_subtemas.forEach(subtema =>
              subtema.perfil_itens?.sort((a, b) => a.id - b.id),
            );
          });

          return perfil;
        }),
        take(1),
      )
      .toPromise();
  }

  save(data): Promise<Perfil> {
    return this.repositorio.manager
      .transaction(async transactionalEntityManager => {
        let perfil: Perfil = Object.assign(new Perfil(), data);

        const { perfil_temas } = perfil;

        delete perfil.perfil_temas;

        perfil = await transactionalEntityManager.save(perfil);

        if (perfil_temas) {
          // Salva temas
          const temasIDs = [0];
          for (let perfilTema of perfil_temas) {
            const { perfil_subtemas } = perfilTema;

            delete perfilTema.perfil_subtemas;

            perfilTema.perfil_id = perfil.id;

            perfilTema = await transactionalEntityManager.save(
              Object.assign(new PerfilTema(), perfilTema),
            );

            temasIDs.push(perfilTema.id);

            // Salva subtemas
            const subtemasIDs = [0];
            for (let perfilSubtema of perfil_subtemas) {
              const { perfil_itens } = perfilSubtema;

              delete perfilSubtema.perfil_itens;

              perfilSubtema.perfil_tema_id = perfilTema.id;

              perfilSubtema = await transactionalEntityManager.save(
                Object.assign(new PerfilSubtema(), perfilSubtema),
              );

              subtemasIDs.push(perfilSubtema.id);

              // Salva itens do subtema
              const itensIDs = [0];
              if (perfil_itens && perfil_itens.length > 0) {
                for (let perfilItem of perfil_itens) {
                  perfilItem.perfil_subtema_id = perfilSubtema.id;

                  perfilItem = await transactionalEntityManager.save(
                    Object.assign(new PerfilItem(), perfilItem),
                  );

                  itensIDs.push(perfilItem.id);
                }
              }

              // Deleta itens removidos no cadastro
              await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from(PerfilItem)
                .where('perfil_subtema_id = :perfilSubtemaId', {
                  perfilSubtemaId: perfilSubtema.id,
                })
                .andWhere('id NOT IN (:itensIDs)', { itensIDs })
                .execute();
            }

            // Deleta subtemas removidos no cadastro
            await transactionalEntityManager
              .createQueryBuilder()
              .delete()
              .from(PerfilSubtema)
              .where('perfil_tema_id = :perfilTemaId', {
                perfilTemaId: perfilTema.id,
              })
              .andWhere('id NOT IN (:subtemasIDs)', { subtemasIDs })
              .execute();
          }

          // Deleta subtemas removidos no cadastro
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(PerfilTema)
            .where('perfil_id = :perfilId', {
              perfilId: perfil.id,
            })
            .andWhere('id NOT IN (:temasIDs)', { temasIDs })
            .execute();
        }

        return perfil;
      })
      .catch(e => {
        this.logger.error(e);

        throw e;
      });
  }

  async respostasDoPerfil(id, query?: QueryParams) {
    let propriedadesElegiveisIDs: any[];
    let resQualitativo: any[] = [];
    let resQuantitativo: any[] = [];

    await carregarPropriedadesElegiveisIDs();

    await Promise.all([
      carregarResultadosQualitativos(),
      carregarResultadosQuantitativos(),
    ]);

    return [...resQualitativo, ...resQuantitativo];

    async function carregarPropriedadesElegiveisIDs() {
      const consultaPropriedadesElegiveisIDs = await getConnection()
        .createQueryBuilder()
        .select('p.id id')
        .from('Propriedade', 'p')
        .where('p.ativo IS TRUE');

      if (query.propriedade_id) {
        consultaPropriedadesElegiveisIDs.andWhere('p.id = :propriedade_id', {
          propriedade_id: query.propriedade_id,
        });
      } else if (query.produtor_id) {
        consultaPropriedadesElegiveisIDs.andWhere(
          'p.produtor_id = :produtor_id',
          {
            produtor_id: query.produtor_id,
          },
        );
      }

      if (query.municipio_id) {
        consultaPropriedadesElegiveisIDs.andWhere(
          'p.municipio_id = :municipio_id',
          {
            municipio_id: query.municipio_id,
          },
        );
      } else if (query.estado_id) {
        consultaPropriedadesElegiveisIDs
          .innerJoin('Municipio', 'm', 'p.municipio_id = m.id')
          .andWhere('m.estado_id = :estado_id', {
            estado_id: query.estado_id,
          });
      }

      if (query.filial_id) {
        consultaPropriedadesElegiveisIDs
          .innerJoin('ClientePropriedade', 'cp', 'cp.propriedade_id = p.id')
          .andWhere(
            'cp.filial_id = :filial_id AND cp.cliente_id = :cliente_id',
            {
              filial_id: query.filial_id,
              cliente_id: query.cliente_id,
            },
          );
      }

      propriedadesElegiveisIDs = await consultaPropriedadesElegiveisIDs
        .getRawMany()
        .then(RowDataPacket => RowDataPacket.map(Data => Data.id));
    }

    async function carregarResultadosQualitativos() {
      const consultaQualitativo = getConnection().createQueryBuilder();

      consultaQualitativo
        .select([
          'pt.id id_tema',
          'ps.id id_subtema',
          'pi.valor resposta',
          'COALESCE(COUNT(DISTINCT pr.propriedade_id), 0) resultado',
        ])
        .from('PerfilTema', 'pt')
        .innerJoin('PerfilSubtema', 'ps', 'pt.id = ps.perfil_tema_id')
        .innerJoin('PerfilItem', 'pi', 'ps.id = pi.perfil_subtema_id')
        .leftJoin(
          'PerfilResposta',
          'pr',
          'pi.id = pr.resultado_qualitativo' +
            ` AND pr.propriedade_id IN (${[0, ...propriedadesElegiveisIDs]})` +
            ` AND pr.cliente_id = ${query.cliente_id}` +
            (query.consultor_id
              ? ` AND pr.consultor_id = ${query.consultor_id}`
              : ''),
        )
        .where('1 = 1')
        .groupBy('pt.id, ps.id, pi.valor');

      resQualitativo = await consultaQualitativo.getRawMany();
    }

    async function carregarResultadosQuantitativos() {
      const consultaQuantitativo = getConnection().createQueryBuilder();

      consultaQuantitativo
        .select([
          'pt.id id_tema',
          'ps.id id_subtema',
          'SUM(pr.resultado_quantitativo) resultado_quantitativo',
        ])
        .from('PerfilTema', 'pt')
        .innerJoin(
          'PerfilSubtema',
          'ps',
          "pt.id = ps.perfil_tema_id AND ps.tipo = 'QUANTITATIVO'",
        )
        .leftJoin(
          'PerfilResposta',
          'pr',
          'ps.id = pr.perfil_subtema_id AND pr.propriedade_id IN(' +
            [0, ...propriedadesElegiveisIDs] +
            ')' +
            ` AND pr.cliente_id = ${query.cliente_id}` +
            (query.consultor_id
              ? ` AND pr.consultor_id = ${query.consultor_id}`
              : ''),
        )
        .where(`pt.perfil_id = :perfil_id`, { perfil_id: id })
        .groupBy('pt.id, ps.id');

      resQuantitativo = await consultaQuantitativo.getRawMany();
    }
  }
}
