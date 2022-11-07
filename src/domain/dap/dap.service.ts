import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Dap } from 'src/domain/dap/dap.entity';
import { Propriedade } from '../propriedade/propriedade.entity';

@Injectable()
export class DapService extends CoreService<Dap> {
  protected relacoesLista: string[] = ['propriedade'];
  protected relacoesUnico: string[] = ['propriedade'];
  @InjectRepository(Dap)
  protected repositorio: Repository<Dap>;

  findAll(query?): Promise<Dap[]> {
    return this.repositorio
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.propriedade', 'p')
      .where(query)
      .orderBy('d.id')
      .addOrderBy('d.propriedade_id')
      .getRawMany()
      .then(dtos => {
        const payload: Dap[] = [];

        for (const dto of dtos) {
          const dap = new Dap();
          dap.propriedade = new Propriedade();

          for (const key of Object.keys(dto)) {
            if (key?.substring(0, 2) === 'd_') {
              dap[key.substring(2)] = dto[key];
            } else if (key?.substring(0, 2) === 'p_') {
              dap['propriedade'][key.substring(2)] = dto[key];
            }
          }

          payload.push(dap);
        }

        return payload;
      });
  }
}
