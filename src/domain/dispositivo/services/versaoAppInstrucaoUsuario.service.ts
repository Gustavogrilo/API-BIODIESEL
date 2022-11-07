import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CoreService } from 'src/core';
import { VersaoAppInstrucaoUsuario } from '../entities/VersaoAppInstrucaoUsuario.entity';

@Injectable()
export class VersaoAppInstrucaoUsuarioService extends CoreService<
  VersaoAppInstrucaoUsuario
> {
  protected relacoesLista: string[] = [];
  protected relacoesUnico: string[] = [];
  @InjectRepository(VersaoAppInstrucaoUsuario)
  protected repositorio: Repository<VersaoAppInstrucaoUsuario>;

  salvarExecucao(versao_app_instrucao_id, usuario_id): Promise<UpdateResult> {
    return this.repositorio.update(
      { versao_app_instrucao_id, usuario_id, executado_em: null },
      { executado_em: new Date() }
    );
  }

  deletarRelacao(
    versao_app_instrucao_id: number,
    usuario_id: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({ usuario_id, versao_app_instrucao_id });
  }
}
