import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService extends CoreService<Usuario> {
  @InjectRepository(Usuario)
  protected repositorio: Repository<Usuario>;
  protected relacoesLista: string[] = ['pessoa'];
  protected relacoesUnico: string[] = ['pessoa', 'produtores', 'clientes'];

  save(data): Promise<Usuario> {
    const usuario = Object.assign(new Usuario(), data);

    return this.repositorio.save(usuario);
  }

  findByLogin(login: string): Promise<Usuario> {
    return this.repositorio
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.login', 'usuario.senha'])
      .where({ login })
      .getOne();
  }

  findAll(query?): Promise<Usuario[]> {
    const { cliente_id } = query;

    delete query.cliente_id;

    const quandidadeDeParametros = Object.keys(query).length;

    return this.repositorio.find({
      join: {
        alias: 'usuario',
        innerJoin: cliente_id
          ? {
            cliente: 'usuario.clientes',
          }
          : {},
      },
      where: qb => {
        cliente_id
          ? qb
            .where('cliente.id = :cliente_id', { cliente_id })
            .andWhere(quandidadeDeParametros > 0 ? query : '1=1')
          : qb.where(quandidadeDeParametros > 0 ? query : '1=1');
      },
      relations: this.relacoesLista || [],
    });
  }
}
