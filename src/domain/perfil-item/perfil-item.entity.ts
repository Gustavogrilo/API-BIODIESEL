import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CoreEntity } from '../../core';
import { PerfilSubtema } from '../perfil-subtema/perfil-subtema.entity';
import { PerfilResposta } from '../perfil-resposta/perfil-resposta.entity';

@Entity('perfil_item')
export class PerfilItem extends CoreEntity {
  @Column('varchar', { name: 'valor', length: 150 })
  valor: string;

  @Column('int', { name: 'perfil_subtema_id', unsigned: true })
  perfil_subtema_id: number;

  @ManyToOne(() => PerfilSubtema, (perfilSubtema) => perfilSubtema.perfil_itens)
  @JoinColumn([{ name: 'perfil_subtema_id', referencedColumnName: 'id' }])
  perfil_subtema?: PerfilSubtema;

  @OneToMany(
    () => PerfilResposta,
    (perfilResposta) => perfilResposta.perfil_item,
  )
  perfil_respostas?: PerfilResposta[];
}
