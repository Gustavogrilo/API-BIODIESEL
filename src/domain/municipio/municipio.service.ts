import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CoreService } from 'src/core';
import { Municipio } from 'src/domain/municipio/municipio.entity';

@Injectable()
export class MunicipioService extends CoreService<Municipio> {
  protected relacoesLista: string[] = ['estado'];
  protected relacoesUnico: string[] = ['estado', 'estado.pais'];
  @InjectRepository(Municipio)
  protected repositorio: Repository<Municipio>;
}
