import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { CoreService } from 'src/core';
import { Questionario } from './questionario.entity';
import { QuestionarioTema } from 'src/domain/questionario-tema/questionario-tema.entity';
import { QueTemaSubtema } from 'src/domain/que-tema-subtema/que-tema-subtema.entity';
import { QueSubtemaPergunta } from 'src/domain/que-subtema-pergunta/que-subtema-pergunta.entity';

interface PlottedInterface {
  name: string,
  value: number
}

interface PlottedInterface2D {
  name: string;
  series: PlottedInterface[];
}

@Injectable()
export class QuestionarioService extends CoreService<Questionario> {
  protected relacoesLista: string[] = ['safra'];
  protected relacoesUnico: string[] = [];
  @InjectRepository(Questionario)
  protected repositorio: Repository<Questionario>;

  private logger = new Logger('Questionario Service');

  async salvar(dto, response): Promise<void> {
    let status: number;
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
      let questionario: Questionario = Object.assign(new Questionario(), dto);
      const temas: QuestionarioTema[] = Object.assign([], questionario.temas);

      const salvarQuestionario = async () => {
        delete questionario.temas;

        questionario = await queryRunner.manager.save(
          Questionario,
          questionario,
        );
      };

      const salvarRelacionamentos = async () => {
        for (const tema of temas) {
          const subtemas: QueTemaSubtema[] = Object.assign(
            [],
            tema.tema.subtemas,
          );

          for (const subtema of subtemas) {
            const perguntas: QueSubtemaPergunta[] = subtema.subtema.perguntas;

            for (const pergunta of perguntas) {
              await queryRunner.manager.save(
                Object.assign(new QueSubtemaPergunta(), {
                  questionario_id: questionario.id,
                  tema_id: tema.tema_id,
                  subtema_id: subtema.subtema_id,
                  pergunta_id: pergunta.pergunta_id,
                  item: pergunta.item,
                }),
              );
            }

            delete subtema.subtema;

            await queryRunner.manager.save(
              Object.assign(new QueTemaSubtema(), {
                questionario_id: questionario.id,
                tema_id: tema.tema_id,
                subtema_id: subtema.subtema_id,
                item: subtema.item,
              }),
            );
          }

          await queryRunner.manager.save(
            Object.assign(new QuestionarioTema(), {
              questionario_id: questionario.id,
              tema_id: tema.tema_id,
              item: tema.item,
            }),
          );
        }
      };

      await salvarQuestionario();
      await salvarRelacionamentos();

      await commit();
    } catch (e) {
      this.logger.error(e);

      await rollback();
    } finally {
      await queryRunner.release();

      response.status(status).send();
    }
  }

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
      const questionario: Questionario = Object.assign(new Questionario(), dto);
      const temas: QuestionarioTema[] = Object.assign([], questionario.temas);

      const atualizarQuestionario = async () => {
        delete questionario.temas;

        await queryRunner.manager.update(
          Questionario,
          questionario.id,
          questionario,
        );

        result = questionario;
      };

      const deletarRelacionamentos = async () => {
        await queryRunner.manager.delete(QuestionarioTema, {
          questionario_id: questionario.id,
        });

        await queryRunner.manager.delete(QueTemaSubtema, {
          questionario_id: questionario.id,
        });

        await queryRunner.manager.delete(QueSubtemaPergunta, {
          questionario_id: questionario.id,
        });
      };

      const salvarRelacionamentos = async () => {
        for (const tema of temas) {
          const subtemas: QueTemaSubtema[] = Object.assign(
            [],
            tema.tema.subtemas,
          );

          for (const subtema of subtemas) {
            const perguntas: QueSubtemaPergunta[] = subtema.subtema.perguntas;

            for (const pergunta of perguntas) {
              delete pergunta.pergunta;

              await queryRunner.manager.save(
                Object.assign(new QueSubtemaPergunta(), {
                  questionario_id: questionario.id,
                  tema_id: tema.tema_id,
                  subtema_id: subtema.subtema_id,
                  pergunta_id: pergunta.pergunta_id,
                  item: pergunta.item,
                }),
              );
            }

            delete subtema.subtema;

            await queryRunner.manager.save(
              Object.assign(new QueTemaSubtema(), {
                questionario_id: questionario.id,
                tema_id: tema.tema_id,
                subtema_id: subtema.subtema_id,
                item: subtema.item,
              }),
            );
          }

          delete tema.tema;

          await queryRunner.manager.save(
            Object.assign(new QuestionarioTema(), {
              questionario_id: questionario.id,
              tema_id: tema.tema_id,
              item: tema.item,
            }),
          );
        }
      };

      await atualizarQuestionario();
      await deletarRelacionamentos();
      await salvarRelacionamentos();

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

  findById(id: number): Promise<Questionario> {
    return getRepository(Questionario)
      .createQueryBuilder('questionario')
      .leftJoinAndSelect('questionario.safra', 'safra')
      .leftJoinAndSelect('questionario.temas', 'temas')
      .leftJoinAndSelect('temas.tema', 'tema')
      .leftJoinAndSelect(
        'tema.subtemas',
        'subtemas',
        'subtemas.questionario_id = questionario.id AND subtemas.tema_id = tema.id',
      )
      .leftJoinAndSelect('subtemas.subtema', 'subtema')
      .leftJoinAndSelect(
        'subtema.perguntas',
        'perguntas',
        'perguntas.questionario_id = questionario.id AND perguntas.tema_id = tema.id AND perguntas.subtema_id = subtema.id',
      )
      .leftJoinAndSelect('perguntas.pergunta', 'pergunta')
      .leftJoinAndSelect('pergunta.lista', 'lista')
      .leftJoinAndSelect('pergunta.itens_lista', 'itens_lista')
      .leftJoinAndSelect('pergunta.pergunta_referencia', 'pergunta_referencia')
      .leftJoinAndSelect('itens_lista.item_lista', 'item_lista')
      .leftJoinAndSelect(
        'itens_lista.pergunta_referenciada',
        'pergunta_referenciada',
      )
      .leftJoinAndSelect('pergunta.tipo_insumo', 'tipo_insumo')
      .leftJoinAndSelect('tipo_insumo.insumos', 'insumos')
      .where('questionario.id = :id', { id })
      .orderBy('temas.item', 'ASC')
      .addOrderBy('subtemas.item', 'ASC')
      .addOrderBy('perguntas.item', 'ASC')
      .getOne();
  }

  // SelectQueryBuilder should select as { value : number, name : string }
  handleQueryResultToPlotterSerialization(queryA: SelectQueryBuilder<any>, queryB: SelectQueryBuilder<any>, seriesAName: string, seriesBName: string): Promise<PlottedInterface2D[]> {
    return new Promise<PlottedInterface2D[]>((resolve, reject) => {
      queryA.getRawMany().then((plottedA: PlottedInterface[]) => {
        queryB.getRawMany().then((plottedB: PlottedInterface[]) => {

          const plotted2d: PlottedInterface2D[] = [];
          const respostas = [];

          plottedA.forEach((pA) => {
            if (!pA.name) {
              pA.name = 'N/A';
            }
            respostas.push(pA.name);
            plotted2d.push({ name: pA.name, series: [] });
          });

          try {

            respostas.forEach((resposta) => {

              const selectPA = plottedA.filter(pa => pa.name === resposta);
              const selectPB = plottedB.filter(pb => pb.name === resposta);
              const series = [];
              series.push({ name: seriesBName, value: selectPB[0] ? selectPB[0].value : 0 });
              series.push({ name: seriesAName, value: selectPA[0] ? selectPA[0].value : 0 });
              plotted2d.push({ name: resposta, series });

            });

            resolve(plotted2d);

          } catch (e) { reject(e) }
        });
      });
    });
  }

  getRespostaEPerguntaInoculacaoDeSementesPlotted(query?): Promise<PlottedInterface[]> {

    const consulta = getConnection().createQueryBuilder().from('que_resposta', 'qr');

    consulta.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 62')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    if (query.ativo == '1') consulta.where('qr.ativo = 1');
    if (query.safra_id) {
      consulta.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    return consulta.getRawMany() as Promise<PlottedInterface[]>;

  }


  getRespostaEPerguntaAdubacaoPlotted(query?): Promise<PlottedInterface2D[]> {

    const consultaFoliar = getConnection().createQueryBuilder().from('que_resposta', 'qr');
    const consultaAdjuvante = getConnection().createQueryBuilder().from('que_resposta', 'qr');

    consultaFoliar.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 9')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    consultaAdjuvante.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 7')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    if (query.ativo == '1') {
      consultaFoliar.where('qr.ativo = 1');
      consultaAdjuvante.where('qr.ativo = 1');
    }
    if (query.safra_id) {
      consultaFoliar.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
      consultaAdjuvante.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });

    }

    return this.handleQueryResultToPlotterSerialization(consultaFoliar, consultaAdjuvante, 'Foliar', 'Adjuvante');

  }


  getRespostaEPerguntaUsodeHerbicidaPlotted(query?): Promise<PlottedInterface2D[]> {

    const consultaPrePlantio = getConnection().createQueryBuilder().from('que_resposta', 'qr');
    const consultaPosPlantio = getConnection().createQueryBuilder().from('que_resposta', 'qr');

    consultaPrePlantio.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 121')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    consultaPosPlantio.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 4')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    if (query.ativo == '1') {
      consultaPrePlantio.where('qr.ativo = 1');
      consultaPosPlantio.where('qr.ativo = 1');
    }
    if (query.safra_id) {
      consultaPrePlantio.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
      consultaPosPlantio.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    return this.handleQueryResultToPlotterSerialization(consultaPrePlantio, consultaPosPlantio, 'Pre-Plantio', 'Pos-Plantio');

  }


  getRespostaEPerguntaLavouraPlotted(query?): Promise<PlottedInterface2D[]> {

    const consultaDaninha = getConnection().createQueryBuilder().from('que_resposta', 'qr');
    const consultaPraga = getConnection().createQueryBuilder().from('que_resposta', 'qr');

    consultaDaninha.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 57')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    consultaPraga.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 56')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    if (query.ativo == '1') {
      consultaPraga.where('qr.ativo = 1');
      consultaDaninha.where('qr.ativo = 1');
    }
    if (query.safra_id) {
      consultaDaninha.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
      consultaPraga.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    return this.handleQueryResultToPlotterSerialization(consultaDaninha, consultaPraga, 'Daninha', 'Praga');

  }

  getRespostaEPerguntaControleDeDoencasPlotted2D(query?): Promise<PlottedInterface2D[]> {

    const consultaFungicida = getConnection().createQueryBuilder().from('que_resposta', 'qr');
    const consultaInseticida = getConnection().createQueryBuilder().from('que_resposta', 'qr');

    consultaFungicida.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 143')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    consultaInseticida.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 89')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');1

    if (query.ativo == '1') {
      consultaFungicida.where('qr.ativo = 1');
      consultaInseticida.where('qr.ativo = 1');
    }
    if (query.safra_id) {
      consultaFungicida.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
      consultaInseticida.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    return this.handleQueryResultToPlotterSerialization(consultaFungicida, consultaInseticida, 'Fungicida', 'Inseticida');

  }

  getRespostaEPerguntaCARPlotted(query?): Promise<PlottedInterface[]> {

    const consulta = getConnection().createQueryBuilder().from('que_resposta', 'qr');

    consulta.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 58')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    if (query.ativo == '1') consulta.where('qr.ativo = 1');
    if (query.safra_id) {
      consulta.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }
    return consulta.getRawMany() as Promise<PlottedInterface[]>;

  }

  getRespostaEPerguntaAmostraDeSoloPlotted(query?): Promise<PlottedInterface[]> {

    const consulta = getConnection().createQueryBuilder().from('que_resposta', 'qr');

    consulta.select('COUNT(DISTINCT(qr.id)) as value, qr.resultado as name')
      .innerJoin('que_pergunta', 'qp', 'qr.pergunta_id = qp.id AND qp.id = 30')
      .innerJoin('que_diagnostico', 'qd', 'qr.diagnostico_id = qd.id')
      .groupBy('name');

    if (query.ativo == '1') consulta.where('qr.ativo = 1');
    if (query.safra_id) {
      consulta.innerJoin('questionario', 'q', 'qd.questionario_id = q.id')
        .andWhere('q.safra_id = :safra_id', { safra_id: query.safra_id });
    }
    return consulta.getRawMany() as Promise<PlottedInterface[]>;

  }
}
