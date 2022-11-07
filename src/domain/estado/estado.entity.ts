import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from 'src/core';
import { Pais } from 'src/domain/pais/pais.entity';

@Entity()
export class Estado extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  sigla: string;

  @Column()
  pais_id: number;

  @ManyToOne(type => Pais)
  @JoinColumn({ name: 'pais_id' })
  pais: Pais;
}
