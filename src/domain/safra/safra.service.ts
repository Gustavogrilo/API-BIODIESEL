import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Safra } from './safra.entity';

@Injectable()
export class SafraService extends CoreService<Safra> {
  protected relacoesLista: string[] = ['cliente'];
  protected relacoesUnico: string[] = ['cliente', 'propriedades'];
  @InjectRepository(Safra)
  protected repositorio: Repository<Safra>;
}
