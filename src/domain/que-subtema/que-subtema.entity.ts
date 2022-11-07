import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { CoreEntity } from 'src/core';
import { QuePergunta } from 'src/domain/que-pergunta/que-pergunta.entity';
import { QueTemaSubtema } from 'src/domain/que-tema-subtema/que-tema-subtema.entity';
import { QueSubtemaPergunta } from 'src/domain/que-subtema-pergunta/que-subtema-pergunta.entity';

@Entity('que_subtema')
export class QueSubtema extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  cliente_id: number;

  @Column()
  ref: string;

  @OneToMany(
    type => QueSubtemaPergunta,
    queSubtemaPergunta => queSubtemaPergunta.subtema,
  )
  perguntas: QueSubtemaPergunta[];
}
