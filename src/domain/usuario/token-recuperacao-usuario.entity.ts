import { BaseEntity, BeforeInsert, Column, Entity } from 'typeorm';

import { randomBytes } from 'crypto';

@Entity('token_recuperacao_usuario')
export class TokenRecuperacaoUsuario extends BaseEntity {
  @Column('int', { primary: true, name: 'usuario_id', unsigned: true })
  usuarioId?: number;

  @Column('binary', { name: 'token', nullable: true, length: 60 })
  token?: Buffer | string | null;

  @Column('timestamp', {
    name: 'criado_em',
    default: () => 'CURRENT_TIMESTAMP',
  })
  criadoEm?: Date;

  constructor(init?: Partial<TokenRecuperacaoUsuario>) {
    super();
    Object.assign(this, init);
  }

  @BeforeInsert()
  async generateToken(): Promise<void> {
    this.token = randomBytes(30).toString('hex');
  }
}
