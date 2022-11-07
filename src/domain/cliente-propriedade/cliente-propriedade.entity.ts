import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Cliente } from 'src/domain/cliente/cliente.entity';
import { Propriedade } from 'src/domain/propriedade/propriedade.entity';
import { Filial } from 'src/domain/filial/filial.entity';

@Entity()
export class ClientePropriedade {
  @PrimaryColumn()
  cliente_id: number;

  @PrimaryColumn()
  filial_id: number;

  @PrimaryColumn()
  propriedade_id: number;

  @ManyToOne(type => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(type => Filial)
  @JoinColumn({ name: 'filial_id' })
  filial: Filial;

  @ManyToOne(type => Propriedade)
  @JoinColumn({ name: 'propriedade_id' })
  propriedade: Propriedade;
}
