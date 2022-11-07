import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { CoreEntity } from 'src/core';
import { Safra } from 'src/domain/safra/safra.entity';
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { QueTema } from 'src/domain/que-tema/que-tema.entity';
import { QuestionarioTema } from 'src/domain/questionario-tema/questionario-tema.entity';

@Entity()
export class Questionario extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  safra_id: number;

  @Column()
  cliente_id: number;

  @Column()
  ref: string;

  @ManyToOne(type => Safra)
  @JoinColumn({ name: 'safra_id' })
  safra: Safra;

  @ManyToOne(type => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToMany(
    type => QuestionarioTema,
    quetionarioTema => quetionarioTema.questionario,
  )
  temas: QuestionarioTema[];
}
