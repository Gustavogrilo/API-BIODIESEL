import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { QueTema } from 'src/domain/que-tema/que-tema.entity';
import { Questionario } from 'src/domain/questionario/questionario.entity';

@Entity()
export class QuestionarioTema {
  @PrimaryColumn()
  questionario_id: number;

  @PrimaryColumn()
  tema_id: number;

  @Column()
  item: number;

  @ManyToOne(type => Questionario)
  @JoinColumn({ name: 'questionario_id' })
  questionario: Questionario;

  @ManyToOne(type => QueTema)
  @JoinColumn({ name: 'tema_id' })
  tema: QueTema;
}
