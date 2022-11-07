import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CoreEntity } from 'src/core';

@Entity()
export class Pais extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  sigla: string;
}
