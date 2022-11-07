import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CoreEntity } from 'src/core';
import { InsumoTipo } from 'src/domain/insumo-tipo/insumo-tipo.entity';
import { QueRespostaInsumo } from 'src/domain/que-resposta-insumo/que-resposta-insumo.entity';

@Entity()
export class Insumo extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  unidade_medida: 'KG' | 'LT';

  @Column()
  tipo_id: number;

  @Column()
  ref: string;

  @ManyToOne(type => InsumoTipo)
  @JoinColumn({ name: 'tipo_id' })
  tipo: InsumoTipo;

  @OneToMany(
    () => QueRespostaInsumo,
    queRespostaInsumo => queRespostaInsumo.insumo,
  )
  respostas: QueRespostaInsumo[];
}
