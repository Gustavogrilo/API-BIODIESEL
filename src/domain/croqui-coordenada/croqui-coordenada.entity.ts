import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/core';
import { CroquiPropriedade } from '../croqui-propriedade/croqui-propriedade.entity';

@Entity()
export class CroquiCoordenada extends CoreEntity {
  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  ordem: number;

  @Column('int', { name: 'croqui_id', unsigned: true })
  croquiId: number;

  @ManyToOne(
    () => CroquiPropriedade,
    (croquiPropriedade) => croquiPropriedade.coordenadas,
    {
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn([{ name: 'croqui_id', referencedColumnName: 'id' }])
  croqui: CroquiPropriedade;

}
