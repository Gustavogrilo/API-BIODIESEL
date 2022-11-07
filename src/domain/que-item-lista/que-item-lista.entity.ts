import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { CoreEntity } from 'src/core';

@Entity()
export class QueItemLista extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  valor: string;

  @Column()
  cliente_id: number;

  @Column()
  ordem: number;

  @Column()
  ref: string;

  @ManyToMany(type => QueItemLista)
  @JoinTable({
    name: 'que_lista_item_lista',
    joinColumn: {
      name: 'item_lista_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'lista_id',
      referencedColumnName: 'id',
    },
  })
  listas: QueItemLista[];
}
