import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { InsumoTipo } from './insumo-tipo.entity';

@Injectable()
export class InsumoTipoService extends CoreService<InsumoTipo> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(InsumoTipo)
  protected repositorio: Repository<InsumoTipo>;
}
