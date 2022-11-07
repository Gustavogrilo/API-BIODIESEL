import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { CoreEntity } from 'src/core';
import { Propriedade } from 'src/domain/propriedade/propriedade.entity';
import { Safra } from 'src/domain/safra/safra.entity';
import { Anexo } from 'src/domain/anexo/anexo.entity';
import { CroquiCoordenada } from '../croqui-coordenada/croqui-coordenada.entity';
import { IsIn } from 'class-validator';

@Entity()
export class CroquiPropriedade extends CoreEntity {
  @Column()
  propriedade_id: number;

  @Column()
  safra_id: number;

  @Column()
  anexo_id: number;

  @ManyToOne(type => Propriedade, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'propriedade_id' })
  propriedade: Propriedade;

  @ManyToOne(type => Safra, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'safra_id' })
  safra: Safra;

  @OneToOne(type => Anexo, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'anexo_id' })
  anexo: Anexo;
  
  @Column('float', { name: 'area_total', unsigned: true })
  areaTotal: number;  

  @Column('enum', {
    name: 'tipo',
    enum: ['propriedade', 'talhao', 'car', 'dap'],
  })
  @IsIn(['propriedade', 'talhao', 'car', 'dap'])
  tipo: 'propriedade' | 'talhao' | 'car' | 'dap';

  @OneToMany(
    () => CroquiCoordenada,
    (croquiCoordenada) => croquiCoordenada.croqui,
    {
      cascade: true,
    },
  )
  @JoinColumn([{ name: 'id', referencedColumnName: 'croqui_id' }])
  coordenadas: CroquiCoordenada[];  
}
