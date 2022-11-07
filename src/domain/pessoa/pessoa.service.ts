import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Pessoa } from 'src/domain/pessoa/pessoa.entity';

@Injectable({ scope: Scope.REQUEST })
export class PessoaService extends CoreService<Pessoa> {
  @InjectRepository(Pessoa)
  protected repositorio: Repository<Pessoa>;
  protected relacoesLista: string[] = ['municipio'];
  protected relacoesUnico: string[] = ['municipio', 'municipio.estado'];

  findAll(query?): Promise<Pessoa[]> {
    const { cliente_id } = query;

    delete query.cliente_id;

    const quandidadeDeParametros = Object.keys(query).length;

    return this.repositorio.find({
      join: {
        alias: 'pessoa',
        innerJoin: cliente_id
          ? {
              cliente: 'pessoa.clientes',
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

  getProdutorContagem(query?): Promise<any> {
    const consulta = getConnection()
      .createQueryBuilder()
      .from('cliente_propriedade', 'cp');
    consulta
      .where('cp.cliente_id = :cliente_id', { cliente_id: query.cliente_id })
      .innerJoin('propriedade', 'p', 'p.id = cp.propriedade_id')
      .innerJoin('pessoa', 'pessoa', 'pessoa.id = p.produtor_id')
      .andWhere('pessoa.produtor = 1');

    if (query.ativo == '1')
      consulta.andWhere('pessoa.ativo = 1').andWhere('p.ativo = 1');
    if (query.propriedade_id && query.produtor_id) {
      consulta
        .andWhere('p.id = :propriedade_id', {
          propriedade_id: query.propriedade_id,
        })
        .andWhere('p.produtor_id = :produtor_id', {
          produtor_id: query.produtor_id,
        });
    } else {
      if (query.propriedade_id && !query.produtor_id) {
        consulta.andWhere('p.id = :propriedade_id', {
          propriedade_id: query.propriedade_id,
        });
      }
      if (!query.propriedade_id && query.produtor_id) {
        consulta.andWhere('p.produtor_id = :produtor_id', {
          produtor_id: query.produtor_id,
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
        consulta
          .innerJoin('questionario', 'q', 'q.cliente_id = cp.cliente_id')
          .innerJoin('safra', 's', 's.id = q.safra_id')
          .andWhere('s.id = :safra_id', { safra_id: query.safra_id });
      }
      if (query.questionario_id && !query.safra_id) {
        consulta
          .innerJoin('questionario', 'q', 'q.cliente_id = cp.cliente_id')
          .andWhere('q.id = :questionario_id', {
            questionario_id: query.questionario_id,
          });
      }
    }

    if (query.filial_id) {
      consulta
        .innerJoin('filial', 'f', 'f.cliente_id = cp.cliente_id')
        .andWhere('f.id = :filial_id', { filial_id: query.filial_id });
    }

    if (query.tema_id) {
      consulta
        .innerJoin('que_tema', 'qt', 'qt.cliente_id = cp.cliente_id')
        .andWhere('qt.id = :formulario_id', {
          formulario_id: query.formulario_id,
        });
    }
    consulta.select('COUNT(DISTINCT(pessoa.id))');

    return consulta.getRawOne();
  }

  getProdutorContagemIndicador(query?): Promise<any> {
    const consulta = getConnection()
      .createQueryBuilder()
      .from('safra_propriedade', 'sp')
      .innerJoin('propriedade', 'p', 'sp.propriedade_id = p.id')
      .where('1=1');
    consulta.select('COUNT(DISTINCT(p.produtor_id))');

    if (query.safra_id) {
      consulta.andWhere('safra_id = :safra_id', {
        safra_id: query.safra_id,
      });
    }

    return consulta.getRawOne();
  }

  getProdutorPorEstado(
    query?,
  ): Promise<{ name: string; percent: number; value: number }[]> {
    // Args : ATIVO, SAFRA_ID, CLIENTE_ID,
    const consulta = this.repositorio.createQueryBuilder('p');

    consulta
      .select('e.sigla as name, COUNT(DISTINCT(p.id)) as value')
      .leftJoin('municipio', 'm', 'p.municipio_id = m.id')
      .leftJoin('estado', 'e', 'm.estado_id = e.id')
      .innerJoin('propriedade', 'pr', 'pr.produtor_id = p.id')
      .where('p.produtor = 1');

    if (query.cliente_id) {
      consulta
        .innerJoin('cliente_pessoa', 'cp', 'pr.id = cp.pessoa_id')
        .where('cp.cliente_id = :cliente_id', { cliente_id: query.cliente_id });
    }
    if (query.ativo) {
      consulta.where('p.ativo = 1');
    }

    if (query.safra_id) {
      consulta
        .innerJoin('que_diagnostico', 'qd', ' pr.id = qd.propriedade_id')
        .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .where('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    consulta.groupBy('name');

    return consulta.getRawMany() as Promise<
      { name: string; percent: number; value: number }[]
    >;
  }

  getRankingMunicipioComMaisProdutoresAtendidos(
    query?,
  ): Promise<{ name: string; value: number }[]> {
    const consulta = getConnection()
      .createQueryBuilder()
      .from('que_diagnostico', 'qd');

    consulta
      .select('m.nome as name, COUNT(qd.id) as value')
      .innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
      .innerJoin('propriedade', 'p', 'qd.propriedade_id = p.id')
      .innerJoin('municipio', 'm', 'p.municipio_id = m.id');

    if (query.ativo) consulta.where('qd.ativo = 1');
    if (query.safra_id) consulta.andWhere('q.safra_id');

    consulta.groupBy('name').orderBy('value', 'DESC');

    return new Promise<{ name: string; value: number }[]>((resolve, reject) => {
      consulta
        .getRawMany()
        .then((rankCity: { name: string; value: string }[]) => {
          let max = 0;
          const rankWithPercent: {
            name: string;
            value: number;
            percent: number;
          }[] = [];

          rankCity.slice(0, 15).forEach(city => {
            if (Number(city.value) > max) {
              max = Number(city.value);
            }
          });

          rankCity.slice(0, 15).forEach(city => {
            rankWithPercent.push({
              name: city.name,
              percent: Math.ceil((Number(city.value) / max) * 100),
              value: Number(city.value),
            });
          });
          resolve(rankWithPercent);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
