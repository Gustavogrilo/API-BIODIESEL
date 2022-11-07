import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Dispositivo } from './Dispositivo.entity';
import { VersaoAppInstrucao } from './VersaoAppInstrucao.entity';
import { Usuario } from '../../usuario/usuario.entity';

@Entity('versao_app')
export class VersaoApp {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id?: number;

  @Column('varchar', { name: 'nome', unique: true, length: 90 })
  nome?: string;

  @Column('text', { name: 'descricao', nullable: true })
  descricao?: string | null;

  @Column('text', { name: 'link_apk' })
  link_apk?: string;

  @Column('date', { name: 'data_lancamento' })
  data_lancamento?: Date;

  @Column('tinyint', { name: 'ativo', width: 1, default: () => "'1'" })
  ativo?: boolean;

  @CreateDateColumn()
  criado_em?: Date;

  @UpdateDateColumn()
  atualizado_em?: Date;

  @Column('int', { name: 'criado_por', nullable: true, unsigned: true })
  criado_por?: number | null;

  @Column('int', { name: 'atualizado_por', nullable: true, unsigned: true })
  atualizado_por?: number | null;

  @OneToMany(
    () => Dispositivo,
    dispositivo => dispositivo.versao_app,
  )
  dispositivos?: Dispositivo[];

  @ManyToOne(() => Usuario, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'criado_por', referencedColumnName: 'id' }])
  criado_por_usuario?: Usuario;

  @ManyToOne(() => Usuario, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'atualizado_por', referencedColumnName: 'id' }])
  atualizado_por_usuario?: Usuario;

  @OneToOne(
    () => VersaoAppInstrucao,
    versaoAppInstrucao => versaoAppInstrucao.versao_app,
  )
  instrucoes_sql?: VersaoAppInstrucao;

  constructor(init?: Partial<VersaoApp>) {
    Object.assign(this, init);
  }
}
