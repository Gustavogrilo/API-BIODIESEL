import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Usuario } from 'src/domain/usuario/usuario.entity';
import { Pessoa } from 'src/domain/pessoa/pessoa.entity';

@Entity()
export class UsuarioProdutor {
  @PrimaryColumn()
  usuario_id: number;

  @PrimaryColumn()
  produtor_id: number;

  @OneToOne(type => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToOne(type => Pessoa)
  @JoinColumn({ name: 'produtor_id' })
  produtor: Usuario;
}
