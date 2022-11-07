import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CoreService } from 'src/core';
import { UsuarioProdutor } from 'src/domain/usuario-produtor/usuario-produtor.entity';

@Injectable()
export class UsuarioProdutorService extends CoreService<UsuarioProdutor> {
  protected relacoesLista: string[] = ['usuario', 'produtor'];
  protected relacoesUnico: string[];
  @InjectRepository(UsuarioProdutor)
  protected repositorio: Repository<UsuarioProdutor>;

  deletarRelacao(
    usuario_id: number,
    produtor_id: number,
  ): Promise<DeleteResult> {
    return this.repositorio.delete({ usuario_id, produtor_id });
  }
}
