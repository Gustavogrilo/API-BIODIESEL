import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { CoreService } from 'src/core';
import { Insumo } from './insumo.entity';

type InsumosMaisUtilizados = {
  tipo_insumo: string;
  insumos: { name: string; value: number }[];
};

@Injectable()
export class InsumoService extends CoreService<Insumo> {
  protected relacoesLista: string[] = ['tipo'];
  protected relacoesUnico: string[] = ['tipo'];
  @InjectRepository(Insumo)
  protected repositorio: Repository<Insumo>;

  insumosMaisUtilizados(query?): Promise<InsumosMaisUtilizados[]> {
    const consulta = this.repositorio.createQueryBuilder('i');

    // Select
    consulta.select([
      'it.nome tipo_insumo',
      'i.nome name',
      'count(DISTINCT qd.propriedade_id) value',
    ]);

    // Joins
    consulta
      .innerJoin('insumo_tipo', 'it', 'i.tipo_id = it.id')
      .innerJoin('que_resposta_insumo', 'qri', 'i.id = qri.insumo_id')
      .innerJoin('que_resposta', 'qr', 'qr.id = qri.resposta_id')
      .innerJoin('que_diagnostico', 'qd', 'qd.id = qr.diagnostico_id')
      .innerJoin('propriedade', 'p', 'p.id = qd.propriedade_id')
      .innerJoin('pessoa', 'produtor', 'produtor.id = p.produtor_id');

    // Group by
    consulta.groupBy('i.nome').addGroupBy('it.nome');

    // Order by
    consulta
      .orderBy('it.nome', 'ASC')
      .addOrderBy('count(DISTINCT qd.propriedade_id)', 'DESC')
      .addOrderBy('i.nome', 'ASC');

    // Where
    consulta.where(
      'i.ativo IS TRUE AND p.ativo IS TRUE AND produtor.ativo IS TRUE',
    );

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
      consulta.andWhere('p.id = :propriedade_id', { propriedade_id });
    } else if (produtor_id) {
      consulta.andWhere('p.produtor_id = :produtor_id', { produtor_id });
    }

    if (municipio_id) {
      consulta.andWhere('p.municipio_id = :municipio_id', { municipio_id });
    }

    if (estado_id) {
      consulta.innerJoin('municipio', 'm', 'm.id = p.municipio_id');

      consulta.andWhere('m.estado_id = :estado_id', { estado_id });
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

    // Agrupar por tipo de insumo
    const consultaAsObservable = from(consulta.getRawMany()).pipe(
      map(insumos => {
        const payload: InsumosMaisUtilizados[] = [];

        for (const insumo of insumos) {
          const { tipo_insumo, name, value } = insumo;

          const tipoInsumoIndex = payload.indexOf(
            payload.find(tipo => tipo.tipo_insumo === tipo_insumo),
          );

          if (tipoInsumoIndex === -1) {
            // Adiciona novo tipo se nao estiver no array
            payload.push({ tipo_insumo, insumos: [{ name, value: +value }] });
          } else {
            //Adiciona o insumo a um tipo que ja esta no array
            const tipoInsumoLength = payload[tipoInsumoIndex].insumos.length;

            // Se o tipo ja conter 4 insumos, o restante e agrupado
            if (tipoInsumoLength === 4) {
              payload[tipoInsumoIndex].insumos.push({
                name: 'Outros',
                value: +value,
              });
            } else if (tipoInsumoLength > 4) {
              payload[tipoInsumoIndex].insumos[4].value += +value;
            } else {
              payload[tipoInsumoIndex].insumos.push({ name, value: +value });
            }
          }
        }

        return payload;
      }),
    );

    return consultaAsObservable.toPromise();
  }

  getInsumos(query?): Promise<any> {
    const consulta = this.repositorio.createQueryBuilder('i');
    if (query.ativo) {
      consulta.where('i.ativo = 1');
    }

    if (query.tipo_id) {
      consulta.andWhere('i.tipo_id = :tipo_id ', { tipo_id: query.tipo_id });
    }

    return consulta.getMany();
  }
}
