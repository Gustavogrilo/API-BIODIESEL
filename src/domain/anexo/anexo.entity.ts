import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CroquiPropriedade } from 'src/domain/croqui-propriedade/croqui-propriedade.entity';

@Entity()
export class Anexo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  tipo: string;

  @Column()
  tamanho: number;

  @Column({ type: 'blob' })
  arquivo;

  @Column()
  criado_em: Date;

  @Column()
  atualizado_em: Date;

  @Column()
  ref_url: string;

  @OneToOne(
    type => CroquiPropriedade,
    croqui => croqui.anexo,
    { cascade: ['insert', 'update'] },
  )
  croquiPropriedade: CroquiPropriedade;
}
