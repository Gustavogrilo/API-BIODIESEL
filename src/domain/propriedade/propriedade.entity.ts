import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  In,
  JoinColumn,
  JoinTable,
  Like,
  ManyToMany,
  ManyToOne,
  Not,
  OneToMany,
} from 'typeorm';

import { CoreEntity } from 'src/core';
import { Pessoa } from 'src/domain/pessoa/pessoa.entity';
import { Municipio } from 'src/domain/municipio/municipio.entity';
import { Filial } from 'src/domain/filial/filial.entity';
import { Dap } from 'src/domain/dap/dap.entity';
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { CroquiPropriedade } from 'src/domain/croqui-propriedade/croqui-propriedade.entity';
import { PerfilResposta } from '../perfil-resposta/perfil-resposta.entity';
import { Safra } from '../safra/safra.entity';
import { ConflictException } from '@nestjs/common';

@Entity()
export class Propriedade extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  telefone: string;

  @Column()
  logradouro: string;

  @Column()
  bairro: string;

  @Column()
  cep: string;

  @Column()
  atividade: string;

  @Column()
  area_total: number;

  @Column()
  area_contratada: number;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  produtor_id: number;

  @Column()
  municipio_id: number;

  @Column()
  ref: string;

  @ManyToOne((type) => Pessoa)
  @JoinColumn({ name: 'produtor_id' })
  produtor: Pessoa;

  @ManyToOne((type) => Municipio)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @OneToMany((type) => Dap, (dap) => dap.propriedade, {
    cascade: ['insert', 'remove'],
  })
  daps: Dap[];

  @ManyToMany((type) => Cliente)
  @JoinTable({
    name: 'cliente_propriedade',
    joinColumn: {
      name: 'propriedade_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'cliente_id',
      referencedColumnName: 'id',
    },
  })
  clientes: Cliente[];

  @ManyToMany((type) => Filial)
  @JoinTable({
    name: 'cliente_propriedade',
    joinColumn: {
      name: 'propriedade_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'filial_id',
      referencedColumnName: 'id',
    },
  })
  filiais: Filial[];

  @OneToMany((type) => CroquiPropriedade, (croqui) => croqui.propriedade, {
    cascade: ['insert', 'update'],
  })
  croquis: CroquiPropriedade[];

  @OneToMany(
    () => PerfilResposta,
    (perfilResposta) => perfilResposta.propriedade,
  )
  perfilRespostas: PerfilResposta[];

  @ManyToMany(() => Safra, (safra) => safra.propriedades, {
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  safras: Safra[];

  /* @BeforeInsert()
   @BeforeUpdate()
   async checkDap(): Promise<void> {
     if (this.daps?.length > 0) {
       const dapCount = await getRepository(Dap)
         .createQueryBuilder()
         .where({
           id: In(this.daps.map((dap) => dap.id)),
           propriedade_id: Not(Like(this.id)),
         })
         .getCount();
 
       if (dapCount > 0) {
         throw new ConflictException({
           message:
             'Alguma das DAPs informadas já está cadastrada em outra propriedade',
         });
       }
     }
   }*/
}
