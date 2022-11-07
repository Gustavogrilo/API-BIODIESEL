import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { CoreEntity } from 'src/core';
import { QueSubtema } from 'src/domain/que-subtema/que-subtema.entity';
import { QuestionarioTema } from 'src/domain/questionario-tema/questionario-tema.entity';
import { QueTemaSubtema } from 'src/domain/que-tema-subtema/que-tema-subtema.entity';

@Entity()
export class QueTema extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  cliente_id: number;

  @Column()
  ref: string;

  @OneToMany(
    type => QueTemaSubtema,
    queTemaSubtema => queTemaSubtema.tema,
  )
  subtemas: QueTemaSubtema[];
}
