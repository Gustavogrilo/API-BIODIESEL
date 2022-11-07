import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Cliente } from 'src/domain/cliente/cliente.entity';

@Injectable()
export class ClienteService extends CoreService<Cliente> {
  protected relacoesLista: string[] = ['municipio'];
  protected relacoesUnico: string[] = [
    'municipio',
    'filiais',
    'safras',
    'usuarios',
    //'pessoas',
    //'propriedades',
  ];
  @InjectRepository(Cliente)
  protected repositorio: Repository<Cliente>;
}
