import { NotFoundException } from '@nestjs/common';
import {
  Connection,
  DeleteResult,
  getConnection,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

export type QueryParams = {
  cliente_id: string;
  filial_id: string;
  safra_id: string;
  consultor_id: string;
  produtor_id: string;
  propriedade_id: string;
  estado_id: string;
  municipio_id: string;
  [p: string]: string;
};

export type Constructor<T> = new (...args: any[]) => T;

export abstract class CoreService<T> {
  protected abstract repositorio: Repository<T>;
  protected abstract relacoesLista: string[];
  protected abstract relacoesUnico: string[];
  protected ModelConstructor: Constructor<T> | undefined;

  save(data): Promise<T> {
    if (this.ModelConstructor) {
      data = Object.assign(new this.ModelConstructor(), data);
    }

    return this.repositorio.save(data);
  }

  findAll(query?): Promise<T[]> {
    return this.repositorio.find({
      where: query,
      relations: this.relacoesLista || [],
    });
  }

  findById(id: number): Promise<T> {
    return this.repositorio.findOne(id, {
      relations: this.relacoesUnico || [],
    });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repositorio.delete(id);
  }

  protected get connection(): Connection {
    return getConnection();
  }

  protected get queryBuilder(): SelectQueryBuilder<any> {
    return getConnection().createQueryBuilder();
  }

  getSelectItem(query?): Promise<{ label: string; value: number }[]> {
    throw new NotFoundException();
  }
}
