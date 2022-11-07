import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Usuario } from 'src/domain/usuario/usuario.entity';
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { Pessoa } from 'src/domain/pessoa/pessoa.entity';

@Entity()
export class ClientePessoa {
  @PrimaryColumn()
  cliente_id: number;

  @PrimaryColumn()
  pessoa_id: number;

  @OneToOne(type => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToOne(type => Pessoa)
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoa;
}
