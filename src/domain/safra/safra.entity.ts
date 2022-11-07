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
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { PerfilResposta } from '../perfil-resposta/perfil-resposta.entity';
import { Propriedade } from '../propriedade/propriedade.entity';

@Entity()
export class Safra extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column()
  contrato: string;

  @Column()
  data_inicio: Date;

  @Column()
  data_termino: Date;

  @Column()
  cliente_id: number;

  @ManyToOne((type) => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToMany(() => PerfilResposta, (perfilResposta) => perfilResposta.safra)
  perfilRespostas: PerfilResposta[];

  @ManyToMany(() => Propriedade, (propriedade) => propriedade.safras, {
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  @JoinTable({
    name: 'safra_propriedade',
    joinColumns: [{ name: 'safra_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'propriedade_id', referencedColumnName: 'id'}]
  })
  propriedades: Propriedade[];
}
