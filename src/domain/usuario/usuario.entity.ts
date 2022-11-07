import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Pessoa } from 'src/domain/pessoa/pessoa.entity';
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { Anexo } from 'src/domain/anexo/anexo.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column({ select: false })
  senha: string;

  @Column()
  permissao: 'ADMINISTRADOR' | 'CONSULTOR' | 'MASTER';

  @Column()
  ativo: boolean;

  @Column()
  criado_em: Date;

  @Column()
  atualizado_em: Date;

  @Column()
  pessoa_id: number;

  @Column()
  avatar_id: number;

  @Column()
  assinatura_id: number;

  @Column()
  ref: string;

  @OneToOne((type) => Pessoa)
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoa;

  @OneToOne((type) => Anexo)
  @JoinColumn({ name: 'avatar_id' })
  avatar: Anexo;

  @ManyToMany((type) => Pessoa, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'usuario_produtor',
    joinColumn: {
      name: 'usuario_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'produtor_id',
      referencedColumnName: 'id',
    },
  })
  produtores: Pessoa[];

  @ManyToMany((type) => Cliente, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'usuario_cliente',
    joinColumn: {
      name: 'usuario_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'cliente_id',
      referencedColumnName: 'id',
    },
  })
  clientes: Cliente[];

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashToken(): Promise<void> {
    if (this.senha) {
      const hash = await bcrypt.hash(this.senha, 10);

      this.senha = hash;
    }
  }

  async validatePassword(plaintextPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(
      plaintextPassword,
      this.senha.toString(),
    );

    return match;
  }
}
