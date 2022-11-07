import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class QueListaItemLista {
  @PrimaryColumn()
  lista_id: number;

  @PrimaryColumn()
  item_lista_id: number;
}
