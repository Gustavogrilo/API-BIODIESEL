import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { VersaoApp } from './VersaoApp.entity';
import { Cliente } from '../../cliente/cliente.entity';
import { Usuario } from '../../usuario/usuario.entity';

@Entity('dispositivo')
export class Dispositivo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id?: number;

  @Column('int', { name: 'versao_app_id', unique: true, unsigned: true })
  versao_app_id?: number;

  @Column('int', { name: 'cliente_id', unsigned: true })
  cliente_id?: number;

  @Column('int', { name: 'usuario_id', unsigned: true })
  usuario_id?: number;

  @Column('enum', { name: 'tipo', enum: ['PHONE', 'TABLET'] })
  tipo?: 'PHONE' | 'TABLET';

  @Column('varchar', { name: 'modelo', length: 90 })
  modelo?: string;

  @Column('varchar', { name: 'imei', length: 20 })
  imei?: string;

  @Column('enum', { name: 'sistema', enum: ['ANDROID', 'IOS'] })
  sistema?: 'ANDROID' | 'IOS';

  @Column('varchar', { name: 'versao_sistema', length: 20 })
  versao_sistema?: string;

  @Column('varchar', { name: 'versao_sdk', length: 20 })
  versao_sdk?: string;

  @Column('varchar', { name: 'resolucao', length: 20 })
  resolucao?: string;

  @Column('varchar', { name: 'escala_resolucao', length: 5 })
  escala_resolucao?: string;

  @Column('tinyint', { name: 'ativo', width: 1, default: () => "'1'" })
  ativo?: boolean;

  @Column('timestamp', { name: 'data_ultima_atualizacao_app', nullable: true })
  data_ultima_atualizacao_app?: Date | null;

  @CreateDateColumn()
  criado_em?: Date;

  @UpdateDateColumn()
  atualizado_em?: Date;

  @ManyToOne(() => Cliente, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'cliente_id', referencedColumnName: 'id' }])
  cliente?: Cliente;

  @ManyToOne(() => Usuario, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'usuario_id', referencedColumnName: 'id' }])
  usuario?: Usuario;

  @ManyToOne(
    () => VersaoApp,
    versaoApp => versaoApp.dispositivos,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'versao_app_id', referencedColumnName: 'id' }])
  versao_app?: VersaoApp;

  constructor(init?: Partial<Dispositivo>) {
    Object.assign(this, init);
  }
}
