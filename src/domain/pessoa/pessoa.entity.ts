import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Municipio } from 'src/domain/municipio/municipio.entity';
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { PerfilResposta } from '../perfil-resposta/perfil-resposta.entity';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  sobrenome: string;

  nome_completo: string;

  @AfterLoad()
  setNomeCompleto(): void {
    let nome = '';
    if (this.nome) {
      nome += this.nome;
    }
    if (this.sobrenome) {
      nome += ' ' + this.sobrenome;
    }

    this.nome_completo = nome;
  }

  @Column()
  cpf: string;

  @Column()
  crea: string; // TODO - Campo migrou para documento, remover futuramente (mantendo redundante por compatibilidade)

  @Column()
  tipo_documento: 'CREA' | 'CFTA';

  @Column()
  documento: string;

  @Column()
  telefone: string;

  @Column()
  email: string;

  @Column()
  logradouro: string;

  @Column()
  bairro: string;

  @Column()
  cep: string;

  @Column()
  municipio_id: number;

  @Column()
  consultor: boolean;

  @Column()
  produtor: boolean;

  @Column()
  ativo: boolean;

  @Column()
  criado_em: Date;

  @Column()
  atualizado_em: Date;

  @Column()
  ref: string;

  @ManyToOne(type => Municipio)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @ManyToMany(type => Cliente)
  @JoinTable({
    name: 'cliente_pessoa',
    joinColumn: {
      name: 'pessoa_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'cliente_id',
      referencedColumnName: 'id',
    },
  })
  clientes: Cliente[];

  @OneToMany(
    () => PerfilResposta,
    perfilResposta => perfilResposta.consultor,
  )
  perfilRespostas: PerfilResposta[];
}
