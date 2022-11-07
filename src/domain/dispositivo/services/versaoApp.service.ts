import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { VersaoApp } from '../entities/VersaoApp.entity';

@Injectable()
export class VersaoAppService extends CoreService<VersaoApp> {
  protected relacoesLista: string[] = [];
  protected relacoesUnico: string[] = ['atualizado_por_usuario', 'dispositivos', 'instrucoes_sql'];
  @InjectRepository(VersaoApp)
  protected repositorio: Repository<VersaoApp>;
}
