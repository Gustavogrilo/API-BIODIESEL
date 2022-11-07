import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CoreService } from 'src/core';
import { PerfilSubtema } from './perfil-subtema.entity';

@Injectable()
export class PerfilSubtemaService extends CoreService<PerfilSubtema> {
  protected relacoesLista: string[] = [];
  protected relacoesUnico: string[] = [];

  @InjectRepository(PerfilSubtema)
  protected repositorio: Repository<PerfilSubtema>;
}
