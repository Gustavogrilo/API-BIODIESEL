import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { Anexo } from './anexo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnexoService extends CoreService<Anexo> {
  protected relacoesLista: string[];
  protected relacoesUnico: string[];
  @InjectRepository(Anexo)
  protected repositorio: Repository<Anexo>;

  findAll(query?): Promise<Anexo[]> {
    return this.repositorio.find({
      select: ['id', 'nome', 'tipo', 'tamanho', 'criado_em', 'atualizado_em'],
      where: query,
      relations: this.relacoesLista || [],
    });
  }

  save(data: Partial<Anexo>): Promise<Anexo> {
    const buffer = Buffer.from(data.arquivo, 'base64');

    data.arquivo = buffer;
    data.tamanho = ((buffer.byteLength / 1024) ^ 2) / 1000;

    return this.repositorio.save(data);
  }

  upload(anexo: any) {
    return this.repositorio.save({
      nome: anexo.originalname,
      tipo: anexo.mimetype,
      tamanho: ((anexo.size / 1024) ^ 2) / 1000,
      arquivo: anexo.buffer,
    });
  }
}
