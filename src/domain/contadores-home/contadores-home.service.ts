import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

@Injectable()
export class ContadoresHomeService {
  async findAll(response, query?) {
    const consultaPropriedades = getConnection()
      .createQueryBuilder()
      .select([
        'clientes.id AS cliente_id',
        'COUNT(propriedade.id) AS propriedades',
        'COUNT(CASE WHEN LENGTH(CAST(propriedade.latitude AS CHAR)) > 0 AND LENGTH(CAST(propriedade.longitude AS CHAR)) > 0 THEN 1 ELSE NULL END) AS georreferencias',
      ])
      .from('propriedade', 'propriedade')
      .leftJoin('propriedade.clientes', 'clientes')
      .leftJoin('propriedade.municipio', 'municipio')
      .leftJoin('municipio.estado', 'estado')
      .where('propriedade.ativo = 1')
      .andWhere(`clientes.id = ${query.cliente_id}`)
      .groupBy('clientes.id');

    const consultaProdutores = getConnection()
      .createQueryBuilder()
      .select([
        'clientes.id AS cliente_id',
        'COUNT(DISTINCT pessoa.id) AS produtores',
      ])
      .from('pessoa', 'pessoa')
      .leftJoin('pessoa.clientes', 'clientes')
      .leftJoin('clientes.propriedades', 'propriedades')
      .leftJoin('pessoa.municipio', 'municipio')
      .leftJoin('municipio.estado', 'estado')
      .where('pessoa.ativo = 1 AND pessoa.produtor = 1')
      .andWhere(`clientes.id = ${query.cliente_id}`)
      .groupBy('clientes.id');

    const produtores = consultaProdutores.getRawMany();
    const propriedades = consultaPropriedades.getRawMany();

    return Promise.all([produtores, propriedades]).then((res) => {
      return res[1].map((element) => {
        element.produtores = res[0].find(
          (value) => +value.cliente_id === +element.cliente_id,
        ).produtores;

        return element;
      });
    });
  }
}
