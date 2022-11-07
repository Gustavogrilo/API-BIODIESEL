import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { PerfilItem } from '../perfil-item/perfil-item.entity';
import { Cliente } from '../cliente/cliente.entity';
import { Pessoa } from '../pessoa/pessoa.entity';
import { PerfilSubtema } from '../perfil-subtema/perfil-subtema.entity';
import { Propriedade } from '../propriedade/propriedade.entity';
import { Safra } from '../safra/safra.entity';
import { CoreEntity } from '../../core';

@Entity('perfil_resposta')
export class PerfilResposta extends CoreEntity {
  @Column('int', {
    name: 'resultado_qualitativo',
    nullable: true,
    unsigned: true,
  })
  resultado_qualitativo: number | null;

  @Column('decimal', {
    name: 'resultado_quantitativo',
    nullable: true,
    precision: 10,
    scale: 0,
  })
  resultado_quantitativo: string | null;

  @Column('int', { name: 'perfil_subtema_id', unsigned: true })
  perfil_subtema_id: number;

  @Column('int', { name: 'cliente_id', unsigned: true })
  cliente_id: number;

  @Column('int', { name: 'safra_id', unsigned: true })
  safra_id: number;

  @Column('int', { name: 'consultor_id', unsigned: true })
  consultor_id: number;

  @Column('int', { name: 'propriedade_id', unsigned: true })
  propriedade_id: number;

  @ManyToOne(() => PerfilItem, (perfilItem) => perfilItem.perfil_respostas)
  @JoinColumn([
    {
      name: 'resultado_qualitativo',
      referencedColumnName: 'perfil_subtema_id',
    },
  ])
  perfil_item?: PerfilItem;

  @ManyToOne(() => Cliente, (cliente) => cliente.perfilRespostas)
  @JoinColumn([{ name: 'cliente_id', referencedColumnName: 'id' }])
  cliente?: Cliente;

  @ManyToOne(() => Pessoa, (pessoa) => pessoa.perfilRespostas)
  @JoinColumn([{ name: 'consultor_id', referencedColumnName: 'id' }])
  consultor?: Pessoa;

  @ManyToOne(
    () => PerfilSubtema,
    (perfilSubtema) => perfilSubtema.perfil_respostas,
  )
  @JoinColumn([{ name: 'perfil_subtema_id', referencedColumnName: 'id' }])
  perfil_subtema?: PerfilSubtema;

  @ManyToOne(() => Propriedade, (propriedade) => propriedade.perfilRespostas)
  @JoinColumn([{ name: 'propriedade_id', referencedColumnName: 'id' }])
  propriedade?: Propriedade;

  @ManyToOne(() => Safra, (safra) => safra.perfilRespostas)
  @JoinColumn([{ name: 'safra_id', referencedColumnName: 'id' }])
  safra?: Safra;
}
