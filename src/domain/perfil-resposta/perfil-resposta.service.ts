import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getConnection, Repository } from 'typeorm';

import { CoreService, QueryParams } from 'src/core';
import { PerfilResposta } from './perfil-resposta.entity';

@Injectable()
export class PerfilRespostaService extends CoreService<PerfilResposta> {
  protected relacoesLista: string[] = [
    'perfil_subtema',
    'perfil_subtema.perfil_tema',
    'perfil_subtema.perfil_tema.perfil',
  ];
  protected relacoesUnico: string[] = [];

  @InjectRepository(PerfilResposta)
  protected repositorio: Repository<PerfilResposta>;

  findAllView(query?: QueryParams): Promise<any[]> {
    const consulta = getConnection()
      .createQueryBuilder()
      .select([
        'c.id cliente_id',
        'c.nome cliente',
        'f.id filial_id',
        'f.nome filial',
        's.id safra_id',
        's.nome safra',
        'p.id perfil_id',
        'p.nome perfil',
        'propriedade.id',
        'propriedade.nome propriedade',
        'produtor.id produtor_id',
        'CONCAT(produtor.nome, \' \', produtor.sobrenome) produtor',
        'COUNT(DISTINCT pr.id) respostas',
        'MAX(pr.atualizado_em) atualizado_em',
      ])
      .from('PerfilResposta', 'pr')
      .innerJoin('PerfilSubtema', 'ps', 'ps.id = pr.perfil_subtema_id')
      .innerJoin('PerfilTema', 'pt', 'pt.id = ps.perfil_tema_id')
      .innerJoin('Perfil', 'p', 'p.id = pt.perfil_id')
      .innerJoin(
        'Propriedade',
        'propriedade',
        'propriedade.id = pr.propriedade_id',
      )
      .innerJoin('Pessoa', 'produtor', 'produtor.id = propriedade.produtor_id')
      .innerJoin('Cliente', 'c', 'c.id = pr.cliente_id')
      .innerJoin(
        'ClientePropriedade',
        'cp',
        'cp.cliente_id = c.id AND cp.propriedade_id = propriedade.id',
      )
      .innerJoin('Filial', 'f', 'f.id = cp.filial_id')
      .innerJoin('Safra', 's', 's.id = pr.safra_id')
      .where('pr.ativo IS TRUE')
      .groupBy('propriedade_id, p.id, c.id, f.id, safra_id')
      .orderBy('atualizado_em', 'DESC');

    const {
      cliente_id,
      filial_id,
      produtor_id,
      propriedade_id,
      perfil_id,
    } = query;

    if (filial_id) {
      consulta.andWhere('f.id = :filial_id', { filial_id });
    } else if (cliente_id) {
      consulta.andWhere('pr.cliente_id = :cliente_id', { cliente_id });
    }

    if (propriedade_id) {
      consulta.andWhere('pr.propriedade_id = :propriedade_id', {
        propriedade_id,
      });
    } else if (produtor_id) {
      consulta.andWhere('produtor.id = :produtor_id', { produtor_id });
    }

    if (perfil_id) {
      consulta.andWhere('p.id = :perfil_id', { perfil_id });
    }

    return consulta.getRawMany();
  }
}
