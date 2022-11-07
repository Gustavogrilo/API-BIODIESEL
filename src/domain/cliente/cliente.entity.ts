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
import { Pessoa } from 'src/domain/pessoa/pessoa.entity';
import { Filial } from 'src/domain/filial/filial.entity';
import { Municipio } from 'src/domain/municipio/municipio.entity';
import { Anexo } from 'src/domain/anexo/anexo.entity';
import { Safra } from 'src/domain/safra/safra.entity';
import { Usuario } from 'src/domain/usuario/usuario.entity';
import { Propriedade } from 'src/domain/propriedade/propriedade.entity';
import { PerfilResposta } from '../perfil-resposta/perfil-resposta.entity';

@Entity()
export class Cliente extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  cnpj: string;

  @Column()
  telefone: string;

  @Column()
  email: string;

  @Column()
  atividade: 'LEITE' | 'SOJA' | 'CORTE';

  @Column()
  logradouro: string;

  @Column()
  bairro: string;

  @Column()
  municipio_id: number;

  @Column()
  logo_id: number;

  @Column()
  ref: string;

  @ManyToOne((type) => Municipio)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @ManyToOne((type) => Anexo)
  @JoinColumn({ name: 'logo_id' })
  logo: Anexo;

  @ManyToMany((type) => Pessoa, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'cliente_pessoa',
    joinColumn: {
      name: 'cliente_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'pessoa_id',
      referencedColumnName: 'id',
    },
  })
  pessoas: Pessoa[];

  @ManyToMany((type) => Propriedade)
  @JoinTable({
    name: 'cliente_propriedade',
    joinColumn: {
      name: 'cliente_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'propriedade_id',
      referencedColumnName: 'id',
    },
  })
  propriedades: Propriedade[];

  @OneToMany((type) => Filial, (filial) => filial.cliente, {
    cascade: ['insert', 'update'],
  })
  filiais: Filial[];

  @OneToMany((type) => Safra, (safra) => safra.cliente)
  safras: Safra[];

  @ManyToMany((type) => Usuario, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'usuario_cliente',
    joinColumn: {
      name: 'cliente_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'usuario_id',
      referencedColumnName: 'id',
    },
  })
  usuarios: Usuario[];

  @OneToMany(() => PerfilResposta, (perfilResposta) => perfilResposta.cliente)
  perfilRespostas: PerfilResposta[];
}
