import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QueLista } from './que-lista.entity';

@Injectable()
export class QueListaService extends CoreService<QueLista> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[] = ['itens'];
  @InjectRepository(QueLista)
  protected repositorio: Repository<QueLista>;
}
