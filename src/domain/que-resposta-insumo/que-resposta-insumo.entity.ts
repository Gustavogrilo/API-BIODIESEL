import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { QueResposta } from 'src/domain/que-resposta/que-respostas.entity';
import { Insumo } from 'src/domain/insumo/insumo.entity';

@Entity('que_resposta_insumo')
export class QueRespostaInsumo {
  @Column({ type: 'int', primary: true })
  resposta_id: number;

  @Column({ type: 'int', primary: true })
  insumo_id: number;

  @Column('decimal')
  quantidade: string;

  @ManyToOne(
    () => QueResposta,
    queResposta => queResposta.insumos,
    { orphanedRowAction: 'delete' },
  )
  @JoinColumn([{ name: 'resposta_id', referencedColumnName: 'id' }])
  resposta?: QueResposta;

  @ManyToOne(
    () => Insumo,
    insumo => insumo.respostas,
  )
  @JoinColumn([{ name: 'insumo_id', referencedColumnName: 'id' }])
  insumo?: Insumo;
}
