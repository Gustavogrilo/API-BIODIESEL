import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { QuePergunta } from 'src/domain/que-pergunta/que-pergunta.entity';

@Entity()
export class QuePerguntaVariavel {
  @PrimaryColumn()
  pergunta_id: number;

  @PrimaryColumn()
  pergunta_referenciada_id: number;

  @Column()
  nome_variavel: number;

  @ManyToOne(type => QuePergunta)
  @JoinColumn({ name: 'pergunta_id' })
  pergunta: QuePergunta;

  @ManyToOne(type => QuePergunta)
  @JoinColumn({ name: 'pergunta_referenciada_id' })
  pergunta_referenciada: QuePergunta;
}
