import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { CoreService } from 'src/core';
import { QuePergunta } from 'src/domain/que-pergunta/que-pergunta.entity';
import { QuePerguntaVariavel } from 'src/domain/que-pergunta-variavel';
import { QuePerguntaItemLista } from 'src/domain/que-pergunta-item-lista/que-pergunta-item-lista.entity';

@Injectable()
export class QuePerguntaService extends CoreService<QuePergunta> {
  protected relacoesLista: string[] = [
    'itens_lista',
    'itens_lista.item_lista',
    'itens_lista.pergunta_referenciada',
  ];
  protected relacoesUnico: string[] = [
    'tipo_insumo',
    'pergunta_referencia',
    'lista',
    'itens_lista',
    'itens_lista.item_lista',
    'itens_lista.pergunta_referenciada',
    'variaveis',
    'variaveis.pergunta_referenciada',
  ];
  @InjectRepository(QuePergunta)
  protected repositorio: Repository<QuePergunta>;

  private logger = new Logger('QuePergunta Service');

  async atualizar(dto, response): Promise<any> {
    let status: number;
    let result;
    const queryRunner = getConnection().createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const commit = async () => {
      status = 200;

      return queryRunner.commitTransaction();
    };

    const rollback = async () => {
      status = 500;

      return queryRunner.rollbackTransaction();
    };

    try {
      const pergunta: QuePergunta = Object.assign(new QuePergunta(), dto);
      const variaveis: QuePerguntaVariavel[] = Object.assign(
        [],
        pergunta.variaveis,
      );
      const itensLista: QuePerguntaItemLista[] = Object.assign(
        [],
        pergunta.itens_lista,
      );

      const atualizarVariaveis = pergunta.hasOwnProperty('variaveis');
      const atualizarItensLista = pergunta.hasOwnProperty('itens_lista');

      const atualizarPergunta = async () => {
        delete pergunta.variaveis;
        delete pergunta.itens_lista;

        await queryRunner.manager.update(QuePergunta, pergunta.id, pergunta);

        result = pergunta;
      };

      const salvarVariaveis = async () => {
        if (atualizarVariaveis) {
          await queryRunner.manager.delete(QuePerguntaVariavel, {
            pergunta_id: pergunta.id,
          });

          this.logger.error(variaveis)

          for (const variavel of variaveis) {
            await queryRunner.manager.save(
              Object.assign(new QuePerguntaVariavel(), variavel),
            );
          }
        }
      };

      const salvarItensLista = async () => {
        if (atualizarItensLista) {
          this.logger.log(itensLista);
          await queryRunner.manager.delete(QuePerguntaItemLista, {
            pergunta_id: pergunta.id,
          });

          for (const item of itensLista) {
            await queryRunner.manager.save(
              Object.assign(new QuePerguntaItemLista(), {
                pergunta_id: pergunta.id,
                ...item,
              }),
            );
          }
        }
      };

      await atualizarPergunta();
      await salvarVariaveis();
      await salvarItensLista();

      await commit();
    } catch (e) {
      this.logger.error(e);

      result = { status: 500, message: e.message };

      await rollback();
    } finally {
      await queryRunner.release();

      response.status(status).send(result);
    }
  }
}
