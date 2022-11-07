import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { CoreEntity } from '../../core';
import { PerfilTema } from '../perfil-tema/perfil-tema.entity';
import { Cliente } from '../cliente/cliente.entity';

@Entity('perfil')
export class Perfil extends CoreEntity {
  @Column('varchar', { name: 'nome', length: 150 })
  nome: string;

  @Column('varchar', { name: 'icone_web', length: 90 })
  icone_web: string;

  @Column('varchar', { name: 'icone_mobile', length: 90 })
  icone_mobile: string;

  @Column('varchar', { name: 'cor_hex', length: 10 })
  cor_hex: string;

  @Column('boolean', { name: 'exibir_na_home', default: true })
  exibir_na_home: boolean;

  @OneToMany(() => PerfilTema, (perfilTema) => perfilTema.perfil)
  perfil_temas: PerfilTema[];

  @ManyToMany((type) => Cliente)
  @JoinTable({
    name: 'perfil_cliente',
    joinColumn: {
      name: 'perfil_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'cliente_id',
      referencedColumnName: 'id',
    },
  })
  clientes: Cliente[];
}
