import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Cell, Row, Workbook, Worksheet } from 'exceljs';

interface ParametrosPlanilhaLaudos {
  questionario_id: number;
  tema_id: number;
}

@Injectable()
export class PlanilhaLaudosService {
  private logger: Logger = new Logger('PlanilhaLaudosService');
  private parametros: ParametrosPlanilhaLaudos;
  private dados;
  private keysInumos: any = {};

  async get(parametros: ParametrosPlanilhaLaudos, response: any) {
    this.getParametros(parametros);

    await this.carregarConteudo();

    try {
      await this.enviarXls(response);
    } catch (e) {
      this.emitirErro(e, response);
    }
  }

  private getParametros(parametros: ParametrosPlanilhaLaudos) {
    this.parametros = parametros;
  }

  private async carregarConteudo() {
    const { questionario_id, tema_id } = this.parametros;
    const nomeProcedure = 'respostas_do_laudo';

    const res: {
      CONSULTOR: string;
      PRODUTOR: string;
      [p: string]: string;
    }[] = await getConnection()
      .query(`CALL ${nomeProcedure}(${questionario_id}, ${tema_id})`)
      .then((res) => JSON.parse(JSON.stringify(res[0])));

    const keysNaoUtilizadas = Object.keys(res[0]).filter((string) =>
      string.includes('COMPLEMENTO'),
    );

    const carregarKeysNaoUtilizadas = () => {
      for (const resElement of res) {
        for (const [key, value] of Object.entries(resElement)) {
          if (value != null && key.includes('COMPLEMENTO')) {
            const index = keysNaoUtilizadas.indexOf(key);

            if (index > -1) keysNaoUtilizadas.splice(index, 1);
          }
        }
      }
    };

    const carregarElementosAjustados = () => {
      const resAjustado: any[] = [];
      const keysInumos: any = {};

      for (const resElement of res) {
        const resElementKeys = Object.keys(resElement);
        const elementoAjustado: any = {};

        const adicionarElemento = (keyName: string) => {
          const key = resElementKeys.find((k) => k.includes(keyName));

          if (key) {
            const item = key.split(' - ')[0];
            const keyComplemento = item + ' - COMPLEMENTO';

            if (keyName === 'PROPRIEDADE') {
              elementoAjustado[key] = resElement[key]?.substring(
                resElement[key]?.indexOf('-') + 2,
              );

              delete resElement[key];
            } else {
              elementoAjustado[key] = resElement[key];
              delete resElement[key];

              if (
                resElementKeys.indexOf(keyComplemento) > -1 &&
                keysNaoUtilizadas.indexOf(keyComplemento) === -1
              ) {
                elementoAjustado[keyComplemento] = resElement[keyComplemento];
                delete resElement[keyComplemento];
              }
            }
          }
        };

        adicionarElemento('NOME DO PRODUTOR');
        adicionarElemento('PROPRIEDADE');
        adicionarElemento('DAP');
        adicionarElemento('DATA DO ATENDIMENTO');
        adicionarElemento('ÁREA CONTRATADA');
        adicionarElemento('PRODUTOR POSSUI CAR');

        for (const [key, value] of Object.entries(resElement)) {
          if (keysNaoUtilizadas.indexOf(key) === -1) {
            elementoAjustado[key] = resElement[key];
            if (value?.includes('INSUMOS:')) {
              const insumos = resElement[key].replace('INSUMOS:', '');
              const length = insumos.split(',').length;

              if (!keysInumos[key]) {
                keysInumos[key] = length;
              } else {
                if (keysInumos[key] < length) {
                  keysInumos[key] = length;
                }
              }
            }
          } else {
            delete resElement[key];
          }
        }

        resAjustado.push(elementoAjustado);
      }

      this.keysInumos = keysInumos;

      this.dados = resAjustado;
    };

    carregarKeysNaoUtilizadas();
    carregarElementosAjustados();
  }

  private async enviarXls(response: any) {
    try {
      const workbook = new Workbook();
      const laudoSheet = workbook.addWorksheet('Respostas');

      workbook.creator = 'Biodiesel';
      workbook.lastModifiedBy = 'Biodiesel';
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();

      const adicionarHeader = () => {
        for (const dado of [this.dados[0]]) {
          const keys = Object.keys(dado);
          const colunas: { header: string; key: string; width: number }[] = [];

          const formatarHeader = () => {
            laudoSheet.lastRow.height = 25;

            laudoSheet.lastRow.font = {
              name: 'Calibri',
              size: 14,
              bold: true,
              color: { argb: 'FFFFFF' },
            };

            laudoSheet.lastRow.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };

            laudoSheet.lastRow.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: '000000',
              },
            };
          };

          for (let i = 0; i < keys.length; i++) {
            let coluna = keys[i];
            const isInsumo = !!this.keysInumos[coluna];

            if (isInsumo) {
              const quantidadeDeInsumos = this.keysInumos[coluna];

              for (let j = 0; j < quantidadeDeInsumos; j++) {
                colunas.push({
                  header: 'INSUMO 0' + (j + 1) + ' - NOME',
                  key: coluna + i + j,
                  width: coluna.length + 25,
                });

                colunas.push({
                  header: 'INSUMO 0' + (j + 1) + ' - QUANTIDADE',
                  key: coluna + i + j,
                  width: coluna.length + 25,
                });

                colunas.push({
                  header: 'INSUMO 0' + (j + 1) + ' - UNIDADE DE MEDIDA',
                  key: coluna + i + j,
                  width: coluna.length + 25,
                });
              }
            } else {
              const isComplemento = coluna.indexOf('-') > -1;

              if (isComplemento) {
                coluna = coluna.substring(coluna.indexOf('-') + 2);
              }

              colunas.push({
                header: coluna,
                key: coluna + i,
                width: coluna.length + 25,
              });
            }
          }

          laudoSheet.columns = colunas;

          formatarHeader();
        }

        laudoSheet.views = [{ state: 'frozen', xSplit: 2, ySplit: 1 }];
      };

      const adicionarDados = () => {
        for (const dado of this.dados) {
          const dadoFormatado = {};

          for (const [key, value] of Object.entries(dado)) {
            if (this.keysInumos[key]) {
              const length = this.keysInumos[key];
              const insumos = value as string;
              const insumosArray = insumos?.replace('INSUMOS:', '').split(';');

              for (let i = 0; i < length; i++) {
                if (insumosArray) {
                  const qtdPalavras = insumosArray[i]?.split(' ')?.length;

                  const nome = () => {
                    if (qtdPalavras === 3) {
                      return insumosArray[i]?.split(' ')[0]?.slice(0, -1);
                    } else if (qtdPalavras === 4) {
                      return (
                        insumosArray[i]?.split(' ')[0] +
                        ' ' +
                        insumosArray[i]?.split(' ')[1]?.slice(0, -1)
                      );
                    }
                  };

                  const quantidade = () => {
                    if (qtdPalavras === 3) {
                      return insumosArray[i]?.split(' ')[1];
                    } else if (qtdPalavras === 4) {
                      return insumosArray[i]?.split(' ')[2];
                    }
                  };

                  const unidadeMedida = () => {
                    if (qtdPalavras === 3) {
                      return insumosArray[i]?.split(' ')[2];
                    } else if (qtdPalavras === 4) {
                      return insumosArray[i]?.split(' ')[3];
                    }
                  };

                  dadoFormatado[
                    key + ' - INSUMO 0' + (i + 1) + ' - NOME'
                  ] = nome();

                  dadoFormatado[
                    key + ' - INSUMO 0' + (i + 1) + ' - QUANTIDADE'
                  ] = quantidade();

                  dadoFormatado[
                    key + ' - INSUMO 0' + (i + 1) + ' - UNIDADE DE MEDIA'
                  ] = unidadeMedida();
                } else {
                  dadoFormatado[key + ' - INSUMO 0' + (i + 1) + ' - NOME'] = '';
                  dadoFormatado[
                    key + ' - INSUMO 0' + (i + 1) + ' - QUANTIDADE'
                  ] = '';
                  dadoFormatado[
                    key + ' - INSUMO 0' + (i + 1) + ' - UNIDADE DE MEDIA'
                  ] = '';
                }
              }
            } else {
              dadoFormatado[key] = value;
            }
          }

          const values = Object.values(dadoFormatado);

          laudoSheet.addRow(values);

          laudoSheet.lastRow.height = 20;

          laudoSheet.lastRow.alignment = {
            vertical: 'middle',
          };

          laudoSheet.lastRow.border = {
            top: { style: 'thin', color: { argb: '#000000' } },
            left: { style: 'thin', color: { argb: '#000000' } },
            bottom: { style: 'thin', color: { argb: '#000000' } },
            right: { style: 'thin', color: { argb: '#000000' } },
          };
        }
      };

      const enviar = async () => {
        const buffer = await workbook.xlsx.writeBuffer();

        if (!buffer) {
          response
            .status(500)
            .send({ status: 500, message: 'Erro ao exportar arquivo' });
          return;
        }

        response
          .header(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          )
          .header('content-length', Buffer.byteLength(buffer))
          .header(
            'Content-Disposition',
            'attachment;filename=acompanhamento' + Date.now() + '.xlsx',
          )
          .status(200)
          .send(buffer);
      };

      adicionarHeader();
      adicionarDados();

      await enviar();
    } catch (e) {
      this.emitirErro(e, response);
    }
  }

  private emitirErro(e, response) {
    this.logger.error(e.message ?? e);

    delete e.response;

    response.status(e.status ?? 500).send(e);
  }
}
