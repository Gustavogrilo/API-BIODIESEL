import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from 'src/core';
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { Municipio } from 'src/domain/municipio/municipio.entity';

@Entity()
export class Filial extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  cliente_id: number;

  @Column()
  municipio_id: number;

  @Column()
  ref: string;

  @ManyToOne(type => Cliente, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(type => Municipio)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;
}
