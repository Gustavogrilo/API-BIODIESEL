import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ativo: boolean;

  @Column()
  criado_em: Date;

  @Column()
  atualizado_em: Date;
}
