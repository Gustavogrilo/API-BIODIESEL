import { Injectable, Scope } from '@nestjs/common';

import { Cell, Row, Workbook, Worksheet } from 'exceljs';

import { BaseReportService, DefinicoesDoDocumento } from '../../core';
import {
  PayloadConsultaLaudo3,
  QueDiagnosticoService,
} from '../../domain/que-diagnostico/que-diagnostico.service';
import { dataFormatada } from '../../util';
import { DispositivoService } from '../../domain/dispositivo/services/dispositivo.service';

@Injectable({ scope: Scope.REQUEST })
export class AcompanhamentoLaudo3Service extends BaseReportService {
  protected definicoesDoDocumento: Partial<DefinicoesDoDocumento> = {
    info: {
      title: 'acompanhamento',
    },
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [30, 25],
    defaultStyle: {
      font: 'Helvetica',
      fontSize: 12,
    },
    styles: {
      header: {
        lineHeight: 1.7,
        fontSize: 18,
      },
    },
    images: {
      logoBiodiesel: 'assets/img/logo_biodiesel_grande.png',
      logoIbs: 'assets/img/logo_ibs.png',
    },
    footer: (currentPage, pageCount, pageSize) => ({
      text: currentPage,
      alignment: 'right',
      margin: [0, 3, 37, 0],
    }),
  };

  private dados: PayloadConsultaLaudo3[] = [];
  private sincronizacoes: {
    consultor: string;
    ultima_sincronizacao: string;
  }[] = [];

  constructor(
    private queDiagnosticoService: QueDiagnosticoService,
    private dispositivoService: DispositivoService,
  ) {
    super();
  }

  async get(parametros, response: any) {
    this.getParametros(parametros);

    await this.carregarConteudo();

    try {
      switch (this.parametros.modo) {
        case 'pdf':
          this.imprimirConteudo();
          this.enviarPdf(response);
          break;
        case 'xlsx':
          await this.enviarXls(response);
          break;
        case 'xls':
          await this.enviarXls(response);
          break;
        default:
          this.emitirErro({ message: 'Selecione um modo' });
      }
    } catch (e) {
      this.emitirErro(e);
    }
  }

  async enviarXls(response) {
    try {
      const workbook = new Workbook();
      workbook.creator = 'Biodiesel';
      workbook.lastModifiedBy = 'Biodiesel';
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();

      let acompanhametoSheet = workbook.addWorksheet(
        'Relatório de acompanhamento - Laudo 03',
        { properties: { defaultColWidth: 23 } },
      );
      acompanhametoSheet = this.adicionarHeaderXls(acompanhametoSheet);

      acompanhametoSheet.views = [{ state: 'frozen', ySplit: 5 }];

      const colunas = ['A', 'C', 'D', 'E', 'F', 'G'];

      this.dados.forEach((resultado, index) => {
        acompanhametoSheet.addRow([
          resultado.estado,
          '',
          resultado.produtores_contratados,
          resultado.produtores_atendidos,
          resultado.atendimentos_realizados + '%',
          '',
          '',
        ]);

        const linhaAtual = acompanhametoSheet.lastRow.number;

        acompanhametoSheet.mergeCells(`A${linhaAtual}:B${linhaAtual}`);
        acompanhametoSheet.mergeCells(`F${linhaAtual}:G${linhaAtual}`);

        for (const coluna of colunas) {
          acompanhametoSheet.getCell(`${coluna}${linhaAtual}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };

          acompanhametoSheet.getCell(`${coluna}${linhaAtual}`).font = {
            name: 'Calibri',
            size: 11,
            bold: true,
          };

          this.adicionarBordaCelula(
            acompanhametoSheet.getCell(`${coluna}${linhaAtual}`),
          );
        }

        this.adicionarCorCelula(
          acompanhametoSheet.getCell(`A${linhaAtual}`),
          'C5E0B4',
        );
        this.adicionarCorCelula(
          acompanhametoSheet.getCell(`C${linhaAtual}`),
          'A9D18E',
        );
        this.adicionarCorCelula(
          acompanhametoSheet.getCell(`D${linhaAtual}`),
          'A9D18E',
        );
        this.adicionarCorCelula(
          acompanhametoSheet.getCell(`E${linhaAtual}`),
          'A9D18E',
        );
        this.adicionarCorCelula(
          acompanhametoSheet.getCell(`F${linhaAtual}`),
          'C5E0B4',
        );
        this.adicionarCorCelula(
          acompanhametoSheet.getCell(`G${linhaAtual}`),
          'C5E0B4',
        );

        resultado.filiais?.forEach((resultadoFilial, index) => {
          const linhaAtualFilial = linhaAtual + index + 1;

          acompanhametoSheet.addRow([
            resultadoFilial.filial,
            resultadoFilial.consultores,
            resultadoFilial.produtores_contratados,
            resultadoFilial.produtores_atendidos,
            resultadoFilial.atendimentos_realizados + '%',
            resultadoFilial.previsao_produtividade_media,
            resultadoFilial.diferenca_dias_atendimento_plantio_media,
          ]);

          acompanhametoSheet.lastRow.height = 20;

          for (const coluna of colunas) {
            acompanhametoSheet.getCell(
              `${coluna}${linhaAtualFilial}`,
            ).alignment = {
              vertical: 'middle',
              horizontal: coluna === 'A' ? 'left' : 'center',
              wrapText: true,
            };

            acompanhametoSheet.getCell(`${coluna}${linhaAtualFilial}`).font = {
              name: 'Calibri',
              size: 9,
            };

            this.adicionarBordaCelula(
              acompanhametoSheet.getCell(`${coluna}${linhaAtualFilial}`),
            );
          }

          acompanhametoSheet.getCell(`B${linhaAtualFilial}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          };

          acompanhametoSheet.getCell(`B${linhaAtualFilial}`).font = {
            name: 'Calibri',
            size: 9,
          };

          this.adicionarBordaCelula(
            acompanhametoSheet.getCell(`B${linhaAtualFilial}`),
          );

          this.adicionarCorCelula(
            acompanhametoSheet.getCell(`C${linhaAtualFilial}`),
            'A9D18E',
          );

          this.adicionarCorCelula(
            acompanhametoSheet.getCell(`D${linhaAtualFilial}`),
            'A9D18E',
          );
        });
      });

      acompanhametoSheet = this.adicionarSincronizacoes(acompanhametoSheet);

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
    } catch (e) {
      response.status(500).send(e);
    }
  }

  protected async carregarConteudo(): Promise<void> {
    await Promise.all([
      this.carregarDados(),
      this.carregarSafra(),
      this.carregarSincronizacoes(),
    ]);
  }

  protected imprimirConteudo() {}

  async carregarDados() {
    this.dados = await this.queDiagnosticoService.getRelatorioLaudo03(
      this.parametros,
    );
  }

  async carregarSincronizacoes() {
    this.sincronizacoes = await this.dispositivoService.getUltimasSincronizacoes(
      this.parametros,
    );
  }

  private adicionarHeaderXls(sheet: Worksheet): Worksheet {
    // Primeira linha
    sheet.addRow(['Programa Biodisel - Safra ' + this.safra?.nome]);
    sheet.lastRow.height = 25;
    sheet.mergeCells('A1:G1');
    sheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    sheet.getCell('A1').font = {
      name: 'Calibri',
      size: 18,
      color: {
        argb: 'FFFFFF',
      },
      bold: true,
    };
    this.adicionarBordaCelula(sheet.getCell('A1'));
    this.adicionarCorCelula(sheet.getCell('A1'), '00B050');

    // Segunda linha
    sheet.addRow(['Relatório de Atendimentos - Laudo 03']);
    sheet.lastRow.height = 18;
    sheet.mergeCells('A2:G2');
    sheet.getCell('A2').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    sheet.getCell('A2').font = {
      name: 'Calibri',
      size: 11,
    };
    this.adicionarBordaCelula(sheet.getCell('A2'));
    this.adicionarCorCelula(sheet.getCell('A2'), 'E2F0D9');

    // Terceira linha
    const data = dataFormatada();
    sheet.addRow(['', '', '', '', '', 'Data:', data]);
    sheet.mergeCells('A3:E3');
    this.adicionarBordaCelula(sheet.getCell('A3'));
    this.adicionarBordaCelula(sheet.getCell('F3'));
    this.adicionarBordaCelula(sheet.getCell('G3'));

    // Quarta linha
    sheet.addRow([
      'ESTADO /FILIAL',
      'CONSULTOR',
      'PRODUTORES CONTRATADOS',
      'PRODUTORES ATENDIDOS',
      'ATENDIMENTOS REALIZADOS (%)',
      'PREVISÃO DE PRODUTIVIDADE MÉDIA',
      'MÉDIA DE DIAS DO ATENDIMETNO APÓS O PLANTIO',
    ]);

    sheet.lastRow.height = 35;

    for (const coluna of ['A', 'B', 'C', 'D', 'E', 'F', 'G']) {
      this.adicionarCorCelula(sheet.getCell(coluna + '4'), 'C5E0B4');
      this.adicionarBordaCelula(sheet.getCell(coluna + '4'));

      sheet.getCell(coluna + '4').font = {
        name: 'Calibri',
        size: 8,
        bold: true,
      };

      sheet.getCell(coluna + '4').alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    }

    return sheet;
  }

  private adicionarSincronizacoes(sheet: Worksheet): Worksheet {
    const linhaAtual = sheet.lastRow.number + 1;

    sheet.addRow(['Sincronismos Realizados']);

    sheet.mergeCells(`A${linhaAtual}:G${linhaAtual}`);

    sheet.getCell(`A${linhaAtual}`).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    sheet.getCell(`A${linhaAtual}`).font = {
      name: 'Calibri',
      size: 11,
      bold: true,
    };

    this.adicionarBordaCelula(sheet.getCell(`A${linhaAtual}`), {
      top: { style: 'thin', color: { argb: '#000000' } },
      left: { style: 'thin', color: { argb: '#000000' } },
      right: { style: 'thin', color: { argb: '#000000' } },
    });

    for (const sincronizacao of this.sincronizacoes) {
      const linhaAtual = sheet.lastRow.number + 1;

      sheet.addRow([
        sincronizacao.ultima_sincronizacao,
        sincronizacao.consultor,
      ]);

      sheet.mergeCells(`B${linhaAtual}:G${linhaAtual}`);

      sheet.getCell(`A${linhaAtual}`).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      this.adicionarBordaCelula(sheet.getCell(`A${linhaAtual}`), {
        left: { style: 'thin', color: { argb: '#000000' } },
      });

      this.adicionarBordaCelula(sheet.getCell(`B${linhaAtual}`), {
        right: { style: 'thin', color: { argb: '#000000' } },
      });
    }

    this.adicionarBordaCelula(sheet.getCell(`A${sheet.lastRow.number}`), {
      left: { style: 'thin', color: { argb: '#000000' } },
      bottom: { style: 'thin', color: { argb: '#000000' } },
    });

    this.adicionarBordaCelula(sheet.getCell(`B${sheet.lastRow.number}`), {
      right: { style: 'thin', color: { argb: '#000000' } },
      bottom: { style: 'thin', color: { argb: '#000000' } },
    });

    return sheet;
  }

  private adicionarBordaCelula(cell: Cell, borda?): Cell {
    cell.border = borda ?? {
      top: { style: 'thin', color: { argb: '#000000' } },
      left: { style: 'thin', color: { argb: '#000000' } },
      bottom: { style: 'thin', color: { argb: '#000000' } },
      right: { style: 'thin', color: { argb: '#000000' } },
    };

    return cell;
  }

  private adicionarCorCelula(cell: Cell, cor: string): Cell {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: cor,
      },
    };

    return cell;
  }
}
