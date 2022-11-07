import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { CoreEntity } from 'src/core';
import { QueItemLista } from 'src/domain/que-item-lista/que-item-lista.entity';

@Entity()
export class QueLista extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  cliente_id: number;

  @Column()
  ref: string;

  @ManyToMany(type => QueItemLista, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'que_lista_item_lista',
    joinColumn: {
      name: 'lista_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'item_lista_id',
      referencedColumnName: 'id',
    },
  })
  itens: QueItemLista[];
}
