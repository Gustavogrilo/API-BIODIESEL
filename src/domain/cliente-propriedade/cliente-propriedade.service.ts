import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { ClientePropriedade } from './cliente-propriedade.entity';

@Injectable()
export class ClientePropriedadeService extends CoreService<ClientePropriedade> {
  protected relacoesLista: string[] = ['cliente', 'filial', 'propriedade'];
  protected relacoesUnico: string[] = ['cliente', 'filial', 'propriedade'];
  @InjectRepository(ClientePropriedade)
  protected repositorio: Repository<ClientePropriedade>;

  deletarRelacao(
    cliente_id: number,
    filial_id: number,
    propriedade_id: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({ cliente_id, filial_id, propriedade_id });
  }
}
