import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, getManager, JoinOptions, Repository, SelectQueryBuilder } from 'typeorm';

import { CoreService } from 'src/core';
import { CroquiPropriedade } from './croqui-propriedade.entity';
import { ImagensPropriedade } from '../que-resposta/que-resposta.service';

@Injectable()
export class CroquiPropriedadeService extends CoreService<CroquiPropriedade> {
  protected relacoesLista: string[] = ['coordenadas'];
  protected relacoesUnico: string[] = ['anexo'];
  @InjectRepository(CroquiPropriedade)
  protected repositorio: Repository<CroquiPropriedade>;

  async croquiPorPropriedade(parametros): Promise<ImagensPropriedade> {
    const consulta = this.queryBuilder
      .select([
        'propriedade.nome propriedade',
        'propriedade.id propriedade_id',
        'CONCAT(produtor.nome, " ", produtor.sobrenome) produtor',
        'produtor.id produtor_id',
        'anexo.nome',
        'anexo.tipo',
        'CASE WHEN SUBSTRING(anexo.tipo, 1, 5) LIKE "image" THEN anexo.arquivo ELSE NULL END anexo_arquivo',
        'true AS croqui',
      ])
      .from('Propriedade', 'propriedade')
      .leftJoin('Pessoa', 'produtor', 'propriedade.produtor_id = produtor.id')
      .innerJoin(
        'CroquiPropriedade',
        'croqui_propriedade',
        'croqui_propriedade.propriedade_id = propriedade.id',
      )
      .innerJoin('Anexo', 'anexo', 'anexo.id = croqui_propriedade.anexo_id')
      .where('1=1');

    if (!!parametros.propriedade_id) {
      consulta.andWhere('propriedade.id IN (:propriedades)', {
        propriedades: parametros.propriedade_id,
      });
    }

    if (!!parametros.safra_id) {
      consulta.andWhere('croqui_propriedade.safra_id = :safra_id', {
        safra_id: parametros.safra_id,
      });
    }

    if (!!parametros.cliente_id || !!parametros.filial_id) {
      consulta.leftJoin(
        'ClientePropriedade',
        'cliente_propriedade',
        'propriedade.id = cliente_propriedade.propriedade_id',
      );

      if (!!parametros.filial_id) {
        consulta.andWhere('cliente_propriedade.filial_id = :filial_id', {
          filial_id: parametros.filial_id,
        });
      } else if (!!parametros.cliente_id) {
        consulta.andWhere('cliente_propriedade.cliente_id = :cliente_id', {
          cliente_id: parametros.cliente_id,
        });
      }
    }

    if (!!parametros.tecnico_id) {
      consulta
        .innerJoin(
          'que_diagnostico',
          'diagnostico',
          'propriedade.id = diagnostico.propriedade_id',
        )
        .andWhere('diagnostico.consultor_id = :tecnico_id', {
          tecnico_id: +parametros.tecnico_id,
        });
    }

    const imagensPorPropriedade: ImagensPropriedade = {};
    const croquis: any[] = JSON.parse(
      JSON.stringify(await consulta.getRawMany()),
    );

    for (const croqui of croquis) {
      if (!imagensPorPropriedade[croqui.propriedade_id]) {
        imagensPorPropriedade[croqui.propriedade_id] = [];
      }

      imagensPorPropriedade[croqui.propriedade_id].push(croqui);
    }

    return imagensPorPropriedade;
  }

  callGetCroquisProcedure(
    params?: GetCroquisProcedureParams,
  ): Promise<GetCroquisProcedureResponse> {
    return getManager()
      .query('CALL getCroquis(?, ?, ?, ?, ?, ?, ?)', [
        params?.produtorId ?? null,
        params?.propriedadeId ?? null,
        params?.safraId ?? null,
        params?.filialId ?? null,
        params?.tecnicoId ?? null,
        params?.municipioId ?? null,
        params?.estadoId ?? null,
      ])
      .then(res => (res[0] as unknown) as GetCroquisProcedureResponse);
  }

  async findAllGeoJson(params: Record<string, any>) {
    const produtorId: number = parseInt(params?.produtorId);
    const clienteId: number = parseInt(params?.clienteId);
    const municipioId: number = parseInt(params?.municipioId);
    const estadoId: number = parseInt(params?.estadoId);

    delete params?.produtorId;
    delete params?.clienteId;
    delete params?.relations;
    delete params?.municipioId;
    delete params?.atendimentoStatusId;
    delete params?.atendimentoTipoId;
    delete params?.estadoId;
    delete params?.dataInicio;
    delete params?.dataFim;

    const join: JoinOptions = {
      alias: 'cp',
    };

    join.innerJoin = {
      propriedade: 'propriedade',
      produtor: 'propriedade.produtor',
    };

    if (clienteId) {
      join.innerJoin = {
        ...join.innerJoin,
        safra: 'cp.safra',
      };
    }

    const options: FindManyOptions = {
      relations: ['coordenadas', 'propriedade', 'propriedade.produtor', 'propriedade.municipio'],
      join,
    };

    options.where = (qb: SelectQueryBuilder<any>) => {
      qb.where(params);

      if (produtorId) {
        qb.andWhere('propriedade.produtor_id = :produtorId', {
          produtorId,
        });
      }

      if (clienteId) {
        qb.andWhere('safra.cliente_id = :clienteId', {
          clienteId,
        });
      }

      if (municipioId) {
        qb.andWhere('propriedade.municipio_id = :municipioId', { municipioId });
      }

      if (estadoId) {
        qb.andWhere('municipio.estado_id = :estadoId', { estadoId });
      }

      qb.andWhere('cp.propriedade_id = propriedade.id');
    };

    const data = await this.repositorio.find(options);

     try {
      if (Array.isArray(data) && data.length > 0) {
        const features = data.map((croqui) => {
          return {
            type: 'Feature',
            properties: {
              id: croqui.propriedade_id,
              id_propriedade: croqui.propriedade_id,
              id_croqui: croqui.id,
              name: croqui.propriedade.nome || 'Nome não retornado.',
              nome_propriedade: croqui.propriedade.nome,
              nome_produtor: `${croqui.propriedade?.produtor?.nome} ${croqui.propriedade?.produtor?.sobrenome}`,
              description:
                `Propriedade ${croqui.propriedade.nome} possui ${croqui.areaTotal} ha` ||
                'Descrição não retornada.',
              area: croqui.areaTotal,
              tipo: croqui.tipo,     
            },
            geometry: {
              type: 'Polygon',
              coordinates: [
                croqui.coordenadas.map((coordenada) => {
                  return [coordenada.longitude, coordenada.latitude];
                }),
              ],
            },
          };
        });
        return {
          type: 'FeatureCollection',
          features,
        };
      } else {
        return [];
      }
     } catch (error) {
         console.log(error);
     }
 }  

}

export type GetCroquisProcedureParams = {
  produtorId?: number;
  propriedadeId?: number;
  safraId?: number;
  filialId?: number;
  tecnicoId?: number;
  municipioId?: number;
  estadoId?: number;
};

export type GetCroquisProcedureResponse = Array<{
  produtor: string;
  propriedade: string;
  imagem_nome: string;
  imagem_arquivo: Buffer;
}>;
