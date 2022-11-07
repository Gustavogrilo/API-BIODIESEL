import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Dispositivo } from '../entities/Dispositivo.entity';

@Injectable()
export class DispositivoService extends CoreService<Dispositivo> {
  protected relacoesLista: string[] = ['usuario', 'usuario.pessoa'];
  protected relacoesUnico: string[] = [
    'usuario',
    'usuario.pessoa',
    'versao_app',
  ];
  @InjectRepository(Dispositivo)
  protected repositorio: Repository<Dispositivo>;

  async getUltimasSincronizacoes(
    query?,
  ): Promise<{ consultor: string; ultima_sincronizacao: string; concluido: number; em_andamento: number }[]> {
    const consulta = this.repositorio.createQueryBuilder('d');

    consulta
      .select([
        "CONCAT(p.nome, ' ', p.sobrenome) consultor",
        "DATE_FORMAT(d.atualizado_em, '%d/%m/%Y %H:%i') ultima_sincronizacao",
        `(  select coalesce(sum(case perguntas when respostas then 1 else 0 end),0) 
        from view_atendimento va
       where va.safra_id = sp.safra_id
         and va.consultor_id  = u.pessoa_id 
       group by consultor_id   
   ) concluido`,
        `(  select coalesce(sum(case perguntas when respostas then 0 else 1 end),0) 
        from view_atendimento va
       where va.safra_id = sp.safra_id
         and va.consultor_id  = u.pessoa_id 
       group by consultor_id   
   ) em_andamento`

      ])
      .distinct(true);

    consulta
      .innerJoin(
        'usuario',
        'u',
        "d.usuario_id = u.id AND u.permissao IN ('CONSULTOR') AND u.ativo IS TRUE",
      )
      .innerJoin('pessoa', 'p', 'u.pessoa_id = p.id');

    const { cliente_id, filial_id, safra_id, questionario_id, tema_id } = query;

    if (cliente_id)
      consulta.andWhere('d.cliente_id = :cliente_id', {
        cliente_id,
      });

    if (filial_id)
      consulta
        .innerJoin('filial', 'f', 'd.cliente_id = f.cliente_id')
        .andWhere('f.id = :filial_id', {
          filial_id,
        });

    if (questionario_id) {
      consulta
        .innerJoin(
          'QueDiagnostico',
          'qd',
          'qd.consultor_id = p.id AND qd.questionario_id = :questionario_id AND qd.ativo IS TRUE',
        )
        .innerJoin(
          'Propriedade',
          'prop',
          'qd.propriedade_id = prop.id AND prop.ativo = 1',
        )
        .innerJoin('safra_propriedade', 'sp', 'prop.id = sp.propriedade_id')
        .innerJoin(
          'Pessoa',
          'produtor',
          'prop.produtor_id = produtor.id AND produtor.ativo = 1',
        );

      consulta.setParameter('questionario_id', questionario_id);

      if (tema_id) {
        consulta.innerJoin(
          'QueResposta',
          'resposta',
          'resposta.diagnostico_id = qd.id AND resposta.tema_id = :tema_id',
        );

        consulta.setParameter('tema_id', tema_id);
      }

      if (safra_id) {
        consulta.andWhere('sp.safra_id = :safra_id', {
          safra_id: +safra_id,
        });
      }
    }

    return consulta.getRawMany();
  }
}
