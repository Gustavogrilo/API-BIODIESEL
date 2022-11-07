import { Injectable, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CoreService } from 'src/core';
import { CroquiCoordenada } from './croqui-coordenada.entity';

@Injectable({ scope: Scope.REQUEST })
export class CroquiCoordenadaService extends CoreService<CroquiCoordenada> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(CroquiCoordenada)
  protected repositorio: Repository<CroquiCoordenada>;
}
