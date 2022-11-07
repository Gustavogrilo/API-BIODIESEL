import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Propriedade } from 'src/domain/propriedade/propriedade.entity';

@Entity()
export class Dap {
  @PrimaryColumn()
  id: string;

  @PrimaryColumn()
  propriedade_id: number;

  @ManyToOne(type => Propriedade, { orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'propriedade_id' })
  propriedade: Propriedade;
}
