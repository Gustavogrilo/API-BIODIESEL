import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CoreService } from 'src/core';
import { PerfilTema } from './perfil-tema.entity';

@Injectable()
export class PerfilTemaService extends CoreService<PerfilTema> {
  protected relacoesLista: string[] = [];
  protected relacoesUnico: string[] = [];

  @InjectRepository(PerfilTema)
  protected repositorio: Repository<PerfilTema>;
}
