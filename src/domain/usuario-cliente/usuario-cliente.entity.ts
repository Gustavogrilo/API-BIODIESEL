import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Usuario } from 'src/domain/usuario/usuario.entity';
import { Cliente } from 'src/domain/cliente/cliente.entity';

@Entity()
export class UsuarioCliente {
  @PrimaryColumn()
  usuario_id: number;

  @PrimaryColumn()
  cliente_id: number;

  @OneToOne(type => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToOne(type => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;
}
