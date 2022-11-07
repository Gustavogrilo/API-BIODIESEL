import { Column, PrimaryColumn, ViewEntity } from 'typeorm';

@ViewEntity('view_atendimento')
export class Atendimento {
  @PrimaryColumn()
  id: number;

  @Column()
  diagnostico_id: number;

  @Column()
  safra_id: number;

  @Column()
  consultor_id: number;

  @Column()
  questionario_id: number;

  @Column()
  tema_id: number;

  @Column()
  propriedade_id: number;

  @Column()
  produtor_id: number;

  @Column()
  municipio_id: number;

  @Column()
  estado_id: number;

  @Column()
  questionario: string;

  @Column()
  laudo: string;

  @Column()
  propriedade: string;

  @Column()
  produtor: string;

  @Column()
  data_atendimento: string;

  @Column()
  perguntas: number;

  @Column()
  respostas: number;

  @Column()
  concluido: number;

  @Column()
  consultor: string;
}
