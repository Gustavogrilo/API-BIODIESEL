import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QueTema } from 'src/domain/que-tema/que-tema.entity';

@Injectable()
export class QueTemaService extends CoreService<QueTema> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[] = ['subtemas'];
  @InjectRepository(QueTema)
  protected repositorio: Repository<QueTema>;
}
