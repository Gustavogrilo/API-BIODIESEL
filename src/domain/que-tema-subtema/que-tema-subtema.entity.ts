import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { QueTema } from 'src/domain/que-tema/que-tema.entity';
import { QueSubtema } from 'src/domain/que-subtema/que-subtema.entity';
import { Questionario } from 'src/domain/questionario/questionario.entity';

@Entity()
export class QueTemaSubtema {
  @PrimaryColumn()
  questionario_id: number;

  @PrimaryColumn()
  tema_id: number;

  @PrimaryColumn()
  subtema_id: number;

  @Column()
  item: number;

  @ManyToOne(type => Questionario)
  @JoinColumn({ name: 'questionario_id' })
  questionario: Questionario;

  @ManyToOne(type => QueTema)
  @JoinColumn({ name: 'tema_id' })
  tema: QueTema;

  @ManyToOne(type => QueSubtema)
  @JoinColumn({ name: 'subtema_id' })
  subtema: QueSubtema;
}
