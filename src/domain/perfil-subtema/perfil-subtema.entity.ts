import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { PerfilItem } from '../perfil-item/perfil-item.entity';
import { PerfilResposta } from '../perfil-resposta/perfil-resposta.entity';
import { PerfilTema } from '../perfil-tema/perfil-tema.entity';
import { CoreEntity } from '../../core';

@Entity('perfil_subtema')
export class PerfilSubtema extends CoreEntity {
  @Column('varchar', { name: 'nome', length: 150 })
  nome: string;

  @Column('enum', { name: 'tipo', enum: ['QUANTITATIVO', 'QUALITATIVO'] })
  tipo: 'QUANTITATIVO' | 'QUALITATIVO';

  @Column('tinyint', { name: 'ordem' })
  ordem?: number;

  @Column('int', { name: 'perfil_tema_id', unsigned: true })
  perfil_tema_id: number;

  @OneToMany(() => PerfilItem, (perfilItem) => perfilItem.perfil_subtema)
  perfil_itens: PerfilItem[];

  @OneToMany(
    () => PerfilResposta,
    (perfilResposta) => perfilResposta.perfil_subtema,
  )
  perfil_respostas: PerfilResposta[];

  @ManyToOne(() => PerfilTema, (perfilTema) => perfilTema.perfil_subtemas)
  @JoinColumn([{ name: 'perfil_tema_id', referencedColumnName: 'id' }])
  perfil_tema: PerfilTema;
}
