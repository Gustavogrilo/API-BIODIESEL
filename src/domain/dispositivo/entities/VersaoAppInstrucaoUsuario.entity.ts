import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { VersaoAppInstrucao } from './VersaoAppInstrucao.entity';
import { Usuario } from '../../usuario/usuario.entity';

@Entity('versao_app_instrucao_usuario')
export class VersaoAppInstrucaoUsuario {
  @Column('int', {
    primary: true,
    name: 'versao_app_instrucao_id',
    unsigned: true,
  })
  versao_app_instrucao_id?: number;

  @Column('int', { primary: true, name: 'usuario_id', unsigned: true })
  usuario_id?: number;

  @Column('timestamp', { name: 'executado_em', nullable: true })
  executado_em?: Date | null;

  @ManyToOne(() => Usuario, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'usuario_id', referencedColumnName: 'id' }])
  usuario?: Usuario;

  @ManyToOne(
    () => VersaoAppInstrucao,
    versaoAppInstrucao => versaoAppInstrucao.usuarios,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'versao_app_instrucao_id', referencedColumnName: 'id' }])
  instrucao?: VersaoAppInstrucao;

  constructor(init?: Partial<VersaoAppInstrucaoUsuario>) {
    Object.assign(this, init);
  }
}
