import { Injectable, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CoreService } from 'src/core';
import { Pais } from './pais.entity';

@Injectable({ scope: Scope.REQUEST })
export class PaisService extends CoreService<Pais> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(Pais)
  protected repositorio: Repository<Pais>;
}
