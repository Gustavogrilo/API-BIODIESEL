import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class QueRespostaAnexo {
  @PrimaryColumn()
  resposta_id: number;

  @PrimaryColumn()
  anexo_id: number;
}
