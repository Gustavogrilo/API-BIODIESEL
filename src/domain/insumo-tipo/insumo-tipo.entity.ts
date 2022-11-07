import { Column, Entity, OneToMany } from 'typeorm';

import { CoreEntity } from 'src/core';
import { Insumo } from 'src/domain/insumo/insumo.entity';

@Entity()
export class InsumoTipo extends CoreEntity {
  @Column()
  nome: string;

  @OneToMany(
    type => Insumo,
    insumo => insumo.tipo,
  )
  insumos: Insumo[];
}
