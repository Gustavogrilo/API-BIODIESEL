import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { QuePergunta } from 'src/domain/que-pergunta/que-pergunta.entity';
import { QueItemLista } from 'src/domain/que-item-lista/que-item-lista.entity';

@Entity()
export class QuePerguntaItemLista {
  @PrimaryColumn()
  pergunta_id: number;

  @PrimaryColumn()
  item_lista_id: number;

  @Column()
  pergunta_referenciada_id: number;

  @ManyToOne(type => QuePergunta)
  @JoinColumn({ name: 'pergunta_id' })
  pergunta: QuePergunta;

  @ManyToOne(type => QueItemLista)
  @JoinColumn({ name: 'item_lista_id' })
  item_lista: QueItemLista;

  @ManyToOne(type => QuePergunta)
  @JoinColumn({ name: 'pergunta_referenciada_id' })
  pergunta_referenciada: QuePergunta;
}
