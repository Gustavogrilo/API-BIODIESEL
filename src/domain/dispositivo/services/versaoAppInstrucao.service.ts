import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { VersaoAppInstrucao } from '../entities/VersaoAppInstrucao.entity';

@Injectable()
export class VersaoAppInstrucaoService extends CoreService<VersaoAppInstrucao> {
  protected relacoesLista: string[] = ['versao_app'];
  protected relacoesUnico: string[] = [
    'usuarios',
    'usuarios.usuario',
    'usuarios.usuario.pessoa',
    'versao_app',
  ];
  @InjectRepository(VersaoAppInstrucao)
  protected repositorio: Repository<VersaoAppInstrucao>;

  findAll(query?): Promise<VersaoAppInstrucao[]> {
    const { usuario_id } = query;
    delete query.usuario_id;

    const qtdParams = Object.keys(query).length;

    return this.repositorio.find({
      join: {
        alias: 'instrucao',
        leftJoin: {
          usuarios: 'instrucao.usuarios',
        },
      },
      where: qb => {
        usuario_id
          ? qb
              .where(
                'usuarios.usuario_id = :usuario_id AND usuarios.executado_em IS NULL',
                {
                  usuario_id,
                },
              )
              .andWhere('instrucao.ativo IS TRUE')
              .andWhere(qtdParams > 0 ? query : '1=1')
          : qb
              .where(qtdParams > 0 ? query : '1=1')
              .andWhere('instrucao.ativo IS TRUE');
      },
      relations: this.relacoesLista || [],
    });
  }
}
