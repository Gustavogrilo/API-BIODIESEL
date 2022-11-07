import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QueSubtema } from './que-subtema.entity';

@Injectable()
export class QueSubtemaService extends CoreService<QueSubtema> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[] = ['perguntas'];
  @InjectRepository(QueSubtema)
  protected repositorio: Repository<QueSubtema>;
}
