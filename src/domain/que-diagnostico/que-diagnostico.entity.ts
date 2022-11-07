import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CoreEntity } from 'src/core';
import { QueResposta } from 'src/domain/que-resposta/que-respostas.entity';
import { Questionario } from 'src/domain/questionario/questionario.entity';
import { Propriedade } from 'src/domain/propriedade/propriedade.entity';
import { Pessoa } from 'src/domain/pessoa/pessoa.entity';

@Entity()
export class QueDiagnostico extends CoreEntity {
  @Column()
  propriedade_id: number;

  @Column()
  consultor_id: number;

  @Column()
  questionario_id: number;

  @Column()
  data_atendimento: Date;

  @ManyToOne(type => Propriedade)
  @JoinColumn({ name: 'propriedade_id' })
  propriedade: Propriedade;

  @ManyToOne(type => Pessoa)
  @JoinColumn({ name: 'consultor_id' })
  consultor: Pessoa;

  @ManyToOne(type => Questionario)
  @JoinColumn({ name: 'questionario_id' })
  questionario: Questionario;

  @OneToMany(
    type => QueResposta,
    resposta => resposta.diagnostico,
    { cascade: ['insert', 'update'] }
  )
  respostas: QueResposta[];
}
