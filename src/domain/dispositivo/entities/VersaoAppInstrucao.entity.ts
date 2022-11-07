import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { VersaoApp } from './VersaoApp.entity';
import { VersaoAppInstrucaoUsuario } from './VersaoAppInstrucaoUsuario.entity';
import { Usuario } from '../../usuario/usuario.entity';

@Entity('versao_app_instrucao')
export class VersaoAppInstrucao {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id?: number;

  @Column('int', { name: 'versao_app_id', unique: true, unsigned: true })
  versao_app_id?: number;

  @Column('text', { name: 'instrucao' })
  instrucao?: string;

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
    () => VersaoApp,
    versaoApp => versaoApp.instrucoes_sql,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'versao_app_id', referencedColumnName: 'id' }])
  versao_app?: VersaoApp;

  @OneToMany(
    () => VersaoAppInstrucaoUsuario,
    versaoAppInstrucaoUsuario => versaoAppInstrucaoUsuario.instrucao,
    { cascade: ['insert'] },
  )
  usuarios?: VersaoAppInstrucaoUsuario[];

  constructor(init?: Partial<VersaoAppInstrucao>) {
    Object.assign(this, init);
  }
}
