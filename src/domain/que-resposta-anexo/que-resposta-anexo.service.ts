import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QueRespostaAnexo } from './que-resposta-anexo.entity';

@Injectable()
export class QueRespostaAnexoService extends CoreService<QueRespostaAnexo> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(QueRespostaAnexo)
  protected repositorio: Repository<QueRespostaAnexo>;

  deletarRelacao(resposta_id: number, anexo_id: number): Promise<DeleteResult> {
    return this.repositorio.delete({
      resposta_id,
      anexo_id,
    });
  }
}
