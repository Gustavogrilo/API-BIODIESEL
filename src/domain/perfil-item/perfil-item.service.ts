import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CoreService } from 'src/core';
import { PerfilItem } from './perfil-item.entity';

@Injectable()
export class PerfilItemService extends CoreService<PerfilItem> {
  protected relacoesLista: string[] = [];
  protected relacoesUnico: string[] = [];

  @InjectRepository(PerfilItem)
  protected repositorio: Repository<PerfilItem>;
}
