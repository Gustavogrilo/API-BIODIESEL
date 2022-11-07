import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from 'src/core';
import { Estado } from 'src/domain/estado/estado.entity';

@Entity()
export class Municipio extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  cep: string;

  @Column()
  estado_id: number;

  @ManyToOne(type => Estado)
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;
}
