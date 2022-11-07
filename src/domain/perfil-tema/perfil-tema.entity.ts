import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { PerfilSubtema } from '../perfil-subtema/perfil-subtema.entity';
import { Perfil } from '../perfil/perfil.entity';
import { CoreEntity } from '../../core';

@Entity('perfil_tema')
export class PerfilTema extends CoreEntity {
  @Column('varchar', { name: 'nome', length: 250 })
  nome: string;

  @Column('tinyint', { name: 'ordem' })
  ordem?: number;

  @Column('int', { name: 'perfil_id', unsigned: true })
  perfil_id: number;

  @OneToMany(() => PerfilSubtema, (perfilSubtema) => perfilSubtema.perfil_tema)
  perfil_subtemas?: PerfilSubtema[];

  @ManyToOne(() => Perfil, (perfil) => perfil.perfil_temas)
  @JoinColumn([{ name: 'perfil_id', referencedColumnName: 'id' }])
  perfil?: Perfil;
}
