import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CoreService } from 'src/core';
import { UsuarioCliente } from 'src/domain/usuario-cliente/usuario-cliente.entity';

@Injectable()
export class UsuarioClienteService extends CoreService<UsuarioCliente> {
  protected relacoesLista: string[] = ['cliente', 'usuario'];
  protected relacoesUnico: string[];
  @InjectRepository(UsuarioCliente)
  protected repositorio: Repository<UsuarioCliente>;

  deletarRelacao(
    usuario_id: number,
    cliente_id: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({ usuario_id, cliente_id });
  }
}
