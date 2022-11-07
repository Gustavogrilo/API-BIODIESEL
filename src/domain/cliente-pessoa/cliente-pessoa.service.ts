import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { ClientePessoa } from './cliente-pessoa.entity';

@Injectable()
export class ClientePessoaService extends CoreService<ClientePessoa> {
  protected relacoesLista: string[] = ['cliente', 'produtor']
  protected relacoesUnico: string[];
  @InjectRepository(ClientePessoa)
  protected repositorio: Repository<ClientePessoa>;

  deletarRelacao(
    cliente_id: number,
    pessoa_id: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({ cliente_id, pessoa_id });
  }
}
