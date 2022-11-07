import { Injectable, Scope } from '@nestjs/common';

import { Cell, Row, Workbook, Worksheet } from 'exceljs';

import { BaseReportService, DefinicoesDoDocumento } from 'src/core';
import { DispositivoService } from '../../domain/dispositivo/services/dispositivo.service';

import {
  AcompanhamentoEstado,
  AcompanhamentoEstadoItem,
  EstadoService,
} from 'src/domain/estado/estado.service';
import {
  AcompanhamentoFilial,
  AcompanhamentoFilialItem,
  FilialService,
} from 'src/domain/filial/filial.service';
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { Cores, dataFormatada } from 'src/util';
import { Filial } from '../../domain/filial/filial.entity';
import { Questionario } from '../../domain/questionario/questionario.entity';
import { Safra } from '../../domain/safra/safra.entity';
import { Propriedade } from '../../domain/propriedade/propriedade.entity';
import { QueTema } from '../../domain/que-tema/que-tema.entity';

@Injectable({ scope: Scope.REQUEST })
export class AcompanhamentoService extends BaseReportService {
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

  private cliente: Cliente;
  private filial: Filial;
  private safraSelecionada: Safra;
  private questionario: Questionario;
  private tema: QueTema;
  private propriedades: Propriedade[];
  private acompanhamentoEstado: AcompanhamentoEstado;
  private acompanhamentoFilial: AcompanhamentoFilial;
  private acompanhamentoTotal: {
    qtd_produtores_contratados: number;
    qtd_produtores_atendidos: number;
    porcentagem_atendimentos: number;
    previsao_produtividade_media: number;
  };
  private sincronizacoes: {
    consultor: string;
    ultima_sincronizacao: string;
    concluido: number;
    em_andamento: number;
  }[] = [];

  constructor(
    private estadoService: EstadoService,
    private filialService: FilialService,
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

  // Métodos para Xlsx
  private async enviarXls(response): Promise<void> {
    try {
      const workbook = new Workbook();
      workbook.creator = 'Biodiesel';
      workbook.lastModifiedBy = 'Biodiesel';
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();

      let acompanhametoSheet = workbook.addWorksheet(
        'Relatório de acompanhamento',
        { properties: { defaultColWidth: 23 } },
      );
      acompanhametoSheet = this.adicionarHeaderXls(acompanhametoSheet);

      acompanhametoSheet.views = [{ state: 'frozen', ySplit: 5 }];

      acompanhametoSheet = this.adicionarLinhaTotalXls(acompanhametoSheet);

      for (const indexEstado of Object.keys(this.acompanhamentoEstado)) {
        acompanhametoSheet = this.adicionarLinhaEstadoXls(
          acompanhametoSheet,
          indexEstado,
        );
        for (const acompanhamentoFilial of this.acompanhamentoFilial[
          indexEstado
        ]) {
          acompanhametoSheet = this.adicionarLinhaFilialXls(
            acompanhametoSheet,
            acompanhamentoFilial,
          );
        }
      }

      acompanhametoSheet = this.adicionarSincronizacoes(acompanhametoSheet);

      const buffer = await workbook.xlsx.writeBuffer();
      if (!buffer) {
        response
          .status(500)
          .send({ status: 500, message: 'Erro ao exportar arquivo. Erro:' });
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
    } catch (error) {
      response
        .status(500)
        .send({ status: 500, message: 'Erro ao exportar arquivo' });
    }
  }

  private adicionarHeaderXls(sheet: Worksheet): Worksheet {
    // Primeira linha
    sheet.addRow(['Programa Biodisel - Safra ' + this.safraSelecionada?.nome]);
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
    sheet.addRow([
      'Relatório de Atendimentos - Questionário ' +
      (this.tema
        ? `${this.questionario?.nome} - ${this.tema?.nome}`
        : this.questionario?.nome),
    ]);
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
    let tituloMedia = 'MÉDIA DE DIAS DO ATENDIMENTO APÓS O PLANTIO (Média de dias)';
    if (this.tema) {
      if (this.tema.id == 1)
        tituloMedia = 'MÉDIA DE DIAS DO ATENDIMENTO ANTES DO PLANTIO (Média de dias)'
    }

    sheet.addRow([
      'ESTADO /FILIAL',
      'CONSULTOR',
      'PRODUTORES CONTRATADOS',
      'PRODUTORES ATENDIDOS',
      'ATENDIMENTOS REALIZADOS (%)',
      'PREVISÃO DE PRODUTIVIDADE MÉDIA (Sc/ha)',
      tituloMedia,
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

  private adicionarLinhaTotalXls(sheet: Worksheet): Worksheet {
    let linha = sheet.addRow([
      'Total',
      'Total',
      this.acompanhamentoTotal.qtd_produtores_contratados,
      this.acompanhamentoTotal.qtd_produtores_atendidos,
      this.acompanhamentoTotal.porcentagem_atendimentos,
      this.acompanhamentoTotal.previsao_produtividade_media,
      '',
    ]);
    linha = this.adicionarCorLinha(linha, 'E2EFDA');
    linha = this.adicionarBordaLinha(linha);
    linha.font = {
      bold: true,
      size: 12,
    };
    linha.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };

    linha.getCell(2).merge(linha.getCell(1));

    return sheet;
  }

  private adicionarLinhaFiltroXls(
    sheet: Worksheet,
    descricao: string,
    valor: string,
  ): Worksheet {
    let linha = sheet.addRow([
      descricao,
      descricao,
      valor,
      valor,
      valor,
      valor,
      valor,
    ]);
    linha = this.adicionarBordaLinha(linha);

    const cellDescricao = linha.getCell(2);
    cellDescricao.merge(linha.getCell(1));
    cellDescricao.font = { bold: true };
    this.adicionarCorCelula(cellDescricao, 'C6E0B4');

    const cellValor = linha.getCell(7);
    cellValor.merge(linha.getCell(6));
    cellValor.merge(linha.getCell(5));
    cellValor.merge(linha.getCell(4));
    cellValor.merge(linha.getCell(3));

    linha = this.adicionarBordaLinha(linha);

    return sheet;
  }

  private adicionarLinhaEstadoXls(
    sheet: Worksheet,
    estado_id: string,
  ): Worksheet {
    const acompanhamentoEstado = this.acompanhamentoEstado[estado_id];

    let linha = sheet.addRow([
      acompanhamentoEstado.estado,
      acompanhamentoEstado.estado,
      acompanhamentoEstado.qtd_produtores_contratados,
      acompanhamentoEstado.qtd_produtores_atendidos,
      acompanhamentoEstado.porcentagem_atendimentos,
      acompanhamentoEstado.previsao_produtividade_media,
      '',
    ]);
    linha = this.adicionarCorLinha(linha, 'C6E0B4');
    linha = this.adicionarBordaLinha(linha);
    linha.font = {
      bold: true,
      size: 12,
    };
    linha.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    const cell1 = linha.getCell(2);
    cell1.merge(linha.getCell(1));

    return sheet;
  }

  private adicionarLinhaFilialXls(
    sheet: Worksheet,
    acompanhamentoFilial: AcompanhamentoFilialItem,
  ): Worksheet {
    let linha = sheet.addRow([
      acompanhamentoFilial.filial,
      acompanhamentoFilial.consultores,
      acompanhamentoFilial.qtd_produtores_contratados,
      acompanhamentoFilial.qtd_produtores_atendidos,
      acompanhamentoFilial.porcentagem_atendimentos,
      acompanhamentoFilial.previsao_produtividade_media,
      acompanhamentoFilial.media_dias_atendimento_antes_plantio,
    ]);
    linha = this.adicionarBordaLinha(linha);
    linha.alignment = { wrapText: true };
    linha.eachCell((cell, colNumber) => {
      if (colNumber > 2) {
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
      }
    });

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

    const linha = sheet.addRow(['Data', 'Consultor', '', 'Concluídos', 'Em andamento', '% Concluído', '']);
    this.adicionarCorLinha(linha, 'C6E0B4');

    sheet.mergeCells(`B${linhaAtual + 1}:C${linhaAtual + 1}`);

    sheet.getCell(`E${linhaAtual}`).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    sheet.getCell(`A${linhaAtual}`).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };


    this.adicionarBordaCelula(sheet.getCell(`A${linhaAtual + 1}`), {
      left: { style: 'thin', color: { argb: '#000000' } },
    });

    this.adicionarBordaCelula(sheet.getCell(`G${linhaAtual + 1}`), {
      right: { style: 'thin', color: { argb: '#000000' } },
    });

    for (const sincronizacao of this.sincronizacoes) {
      const linhaAtual = sheet.lastRow.number + 1;

      sheet.addRow([
        sincronizacao.ultima_sincronizacao,
        sincronizacao.consultor, '',
        +sincronizacao.concluido,
        +sincronizacao.em_andamento,
        +sincronizacao.concluido / (+sincronizacao.concluido + +sincronizacao.em_andamento)
      ]);

      sheet.mergeCells(`B${linhaAtual}:C${linhaAtual}`);

      sheet.getCell(`A${linhaAtual}`).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      sheet.getCell(`D${linhaAtual}`).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      sheet.getCell(`E${linhaAtual}`).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      sheet.getCell(`F${linhaAtual}`).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      sheet.getCell(`F${linhaAtual}`).numFmt = '0.00%';

      this.adicionarBordaCelula(sheet.getCell(`A${linhaAtual}`), {
        left: { style: 'thin', color: { argb: '#000000' } },
      });

      this.adicionarBordaCelula(sheet.getCell(`G${linhaAtual}`), {
        right: { style: 'thin', color: { argb: '#000000' } },
      });
    }


    this.adicionarBordaCelula(sheet.getCell(`A${sheet.lastRow.number}`), {
      left: { style: 'thin', color: { argb: '#000000' } },
      bottom: { style: 'thin', color: { argb: '#000000' } },
    });

    this.adicionarBordaCelula(sheet.getCell(`B${sheet.lastRow.number}`), {
      bottom: { style: 'thin', color: { argb: '#000000' } },
    });

    this.adicionarBordaCelula(sheet.getCell(`C${sheet.lastRow.number}`), {
      bottom: { style: 'thin', color: { argb: '#000000' } },
    });

    this.adicionarBordaCelula(sheet.getCell(`D${sheet.lastRow.number}`), {
      bottom: { style: 'thin', color: { argb: '#000000' } },
    });

    this.adicionarBordaCelula(sheet.getCell(`E${sheet.lastRow.number}`), {
      bottom: { style: 'thin', color: { argb: '#000000' } },
    });

    this.adicionarBordaCelula(sheet.getCell(`F${sheet.lastRow.number}`), {
      bottom: { style: 'thin', color: { argb: '#000000' } },
    });

    this.adicionarBordaCelula(sheet.getCell(`G${sheet.lastRow.number}`), {
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

  private adicionarBordaLinha(linha: Row, borda?): Row {
    linha.eachCell(cell => {
      this.adicionarBordaCelula(cell, borda);
    });
    return linha;
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

  private adicionarCorLinha(linha: Row, cor: string): Row {
    linha.eachCell(cell => {
      this.adicionarCorCelula(cell, cor);
    });
    return linha;
  }

  // Métodos para carregamento de conteúdos
  protected async carregarConteudo(): Promise<void> {
    await Promise.all([
      this.carregarCliente(),
      this.carregarFilial(),
      this.carregarQuestionario(),
      this.carregarTema(),
      this.carregarSafraSelecionada(),
      this.carregarPropriedades(),
      this.carregarAcompanhamentosPorEstado(),
      this.carregarAcompanhamentosPorFilial(),
      this.carregarAcompanhamentosTotal(),
      this.carregarSincronizacoes()
    ]);
  }

  private async carregarCliente(): Promise<void> {
    const cliente: Cliente = await this.queryBuilder
      .from('Cliente', 'cliente')
      .where('cliente.id = :cliente_id', {
        cliente_id: this.parametros.cliente_id,
      })
      .getRawOne();

    this.cliente = JSON.parse(JSON.stringify(cliente));
  }

  private async carregarFilial(): Promise<void> {
    this.filial = null;

    if (!!this.parametros.filial_id) {
      const filial: Filial = await this.queryBuilder
        .from('Filial', 'filial')
        .where('filial.id = :filial_id', {
          filial_id: this.parametros.filial_id,
        })
        .getRawOne();
      this.filial = JSON.parse(JSON.stringify(filial));
    }
  }

  private async carregarQuestionario(): Promise<void> {
    this.questionario = null;

    if (!!this.parametros.questionario_id) {
      const questionario: Questionario = await this.queryBuilder
        .from('Questionario', 'questionario')
        .where('questionario.id = :questionario_id', {
          questionario_id: this.parametros.questionario_id,
        })
        .getRawOne();
      this.questionario = JSON.parse(JSON.stringify(questionario));
    }
  }

  private async carregarTema(): Promise<void> {
    this.tema = null;

    if (!!this.parametros.tema_id) {
      const tema: QueTema = await this.queryBuilder
        .from('QueTema', 'tema')
        .where('tema.id = :tema_id', {
          tema_id: this.parametros.tema_id,
        })
        .getRawOne();

      this.tema = JSON.parse(JSON.stringify(tema));
    }
  }

  private async carregarSafraSelecionada(): Promise<void> {
    this.safraSelecionada = null;

    if (!!this.parametros.safra_id) {
      const safra: Safra = await this.queryBuilder
        .from('Safra', 'safra')
        .where('safra.id = :safra_id', {
          safra_id: this.parametros.safra_id,
        })
        .getRawOne();
      this.safraSelecionada = JSON.parse(JSON.stringify(safra));
    }
  }

  private async carregarPropriedades(): Promise<void> {
    this.propriedades = [];

    if (!!this.parametros.propriedade_id) {
      const propriedade_id: any = this.parametros.propriedade_id;
      const propriedades_ids = JSON.parse(propriedade_id);

      const propriedades: Propriedade[] = await this.queryBuilder
        .from('Propriedade', 'propriedade')
        .leftJoin(
          'ClientePropriedade',
          'cp',
          'propriedade.id = cp.propriedade_id',
        )
        .where('propriedade.id IN (:...propriedades_ids)', {
          propriedades_ids,
        })
        .andWhere('cp.cliente_id = :cliente_id', {
          cliente_id: this.parametros.cliente_id,
        })
        .getRawMany();
      this.propriedades = JSON.parse(JSON.stringify(propriedades));
    }
  }

  private async carregarAcompanhamentosPorFilial(): Promise<void> {
    this.acompanhamentoFilial = await this.filialService.acompanhamentoPorFilial(
      this.parametros,
    );
  }

  private async carregarAcompanhamentosPorEstado(): Promise<void> {
    this.acompanhamentoEstado = await this.estadoService.acompanhamentoPorEstado(
      this.parametros,
    );
  }

  private async carregarAcompanhamentosTotal(): Promise<void> {
    const getIdPerguntaEstimativaProducao = (): number => {
      switch (Number(this.parametros.tema_id)) {
        case 4:
          return 12;
        case 3:
          return 52;
        default:
          return 74;
      }
    };

    const consulta = this.queryBuilder
      .select([
        'COUNT(DISTINCT produtor.id) qtd_produtores_contratados',
        'COUNT(DISTINCT resposta_estimativa_producao.id) qtd_produtores_atendidos',
        "CONCAT(ROUND((COUNT(DISTINCT resposta_estimativa_producao.id) / COUNT(DISTINCT produtor.id) * 100), 0),'%') AS porcentagem_atendimentos",
        "IFNULL(ROUND(AVG(`resposta_estimativa_producao`.`resultado`), 2), '-') previsao_produtividade_media",
      ])
      .from('Filial', 'f')
      .leftJoin('ClientePropriedade', 'cp', 'f.id = cp.filial_id')
      .innerJoin(
        'Propriedade',
        'prop',
        'cp.propriedade_id = prop.id AND prop.ativo = 1',
      )
      .innerJoin(
        'Pessoa',
        'produtor',
        'prop.produtor_id = produtor.id AND produtor.ativo = 1',
      )
      .innerJoin('safra_propriedade', 'sp', 'prop.id = sp.propriedade_id')
      .leftJoin(
        'QueDiagnostico',
        'qd',
        'prop.id = qd.propriedade_id AND (qd.ativo = 1 OR qd.ativo IS NULL)' +
        (!!this.parametros.questionario_id
          ? ` AND qd.questionario_id = ${this.parametros.questionario_id}`
          : ''),
      )
      .leftJoin(
        'QueResposta',
        'resposta',
        'resposta.diagnostico_id = qd.id' +
        (!!this.parametros.tema_id
          ? ` AND resposta.tema_id = ${this.parametros.tema_id}`
          : ''),
      )
      .leftJoin(
        'QueResposta',
        'resposta_estimativa_producao',
        `resposta_estimativa_producao.pergunta_id = ${getIdPerguntaEstimativaProducao()} AND resposta_estimativa_producao.diagnostico_id = qd.id` +
        (!!this.parametros.tema_id
          ? ` AND resposta_estimativa_producao.tema_id = ${this.parametros.tema_id}`
          : ''),
      )
      .leftJoin(
        'Propriedade',
        'propriedades_atendimento',
        'propriedades_atendimento.id = qd.propriedade_id AND resposta.id IS NOT NULL AND propriedades_atendimento.ativo = 1',
      )
      .leftJoin(
        'Pessoa',
        'produtores_atendimento',
        'produtores_atendimento.id = propriedades_atendimento.produtor_id AND produtores_atendimento.ativo = 1',
      )
      .where('f.ativo = 1');

    if (!!this.parametros.cliente_id) {
      consulta.andWhere('cp.cliente_id = :cliente_id', {
        cliente_id: this.parametros.cliente_id,
      });
    }

    if (!!this.parametros.safra_id) {
      consulta.andWhere('sp.safra_id = :safra_id', {
        safra_id: +this.parametros.safra_id,
      });
    }

    if (!!this.parametros.filial_id) {
      consulta.andWhere('f.id = :filial_id', {
        filial_id: this.parametros.filial_id,
      });
    }

    if (!!this.parametros.propriedade_id) {
      const propriedade_id: any = this.parametros.propriedade_id;
      const propriedades = JSON.parse(propriedade_id);

      consulta.andWhere('prop.id IN (:...propriedades)', { propriedades });
    }

    this.acompanhamentoTotal = JSON.parse(
      JSON.stringify(await consulta.getRawOne()),
    );
  }

  private async carregarSincronizacoes() {
    this.sincronizacoes = await this.dispositivoService.getUltimasSincronizacoes(
      this.parametros,
    );
  }



  // Métodos para PDF
  private adicionarTabelaPdf(): any {
    const alignment = 'center';
    const header = [
      [
        {
          text: 'Estado/Filial',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 25, 0, 0],
          alignment,
        },
        {
          text: 'Consultor(es)',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 25, 0, 0],
          alignment,
        },
        {
          text: 'Quantidade de produtores contratados',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 20, 0, 0],
          alignment,
        },
        {
          text: 'Quantidade de produtores atendidos',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 20, 0, 0],
          alignment,
        },
        {
          text: '% de atendimentos realizados',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 20, 0, 0],
          alignment,
        },
        {
          text: 'Previsão de produtividade média',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 20, 0, 0],
          alignment,
        },
        {
          text: 'Média de dias do atendimento antes do plantio',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 15, 0, 0],
          alignment,
        },
      ],
    ];
    const body = this.adicionarBodyTabelaPdf();

    return {
      table: {
        headerRows: 1,
        dontBreakRows: false,
        widths: ['25%', '20%', '15%', '10%', '10%', '10%', '10%'],
        body: [...header, ...body],
      },
      style: {
        fontSize: 10,
        width: '100%',
      },
      layout: {
        vLineWidth: () => 1,
        hLineWidth: () => 1,
        paddingTop: () => 5,
        paddingBottom: () => 5,
      },
    };
  }

  private adicionarHeaderTabelaPdf(): any {
    const alignment = 'center';

    return {
      table: {
        widths: ['100%'],
        body: [
          // Linha 1
          [
            {
              text: 'Programa Biodiesel',
              bold: true,
              fillColor: Cores.ForestGreen,
              color: 'white',
              fontSize: 16,
              alignment,
            },
          ],
          // Linha 2
          [
            {
              text: 'Relatório de Atendimentos',
              fillColor: Cores.DarkSeaGreen,
              alignment,
            },
          ],
        ],
      },
      style: {
        fontSize: 10,
      },
      layout: {
        vLineWidth: () => 1,
        hLineWidth: () => 1,
        paddingTop: () => 5,
        paddingBottom: () => 5,
      },
    };
  }

  private adicionarBodyTabelaPdf(): any[] {
    const body: any[] = [];

    body.push(this.adicionarLinhaTotalPdf());
    for (const indexEstado of Object.keys(this.acompanhamentoEstado)) {
      body.push(
        this.adicionarLinhaEstadoPdf(this.acompanhamentoEstado[indexEstado]),
      );

      if (this.acompanhamentoFilial[indexEstado]) {
        for (const acompanhamentoFilial of this.acompanhamentoFilial[
          indexEstado
        ]) {
          body.push(this.adicionarLinhaFilialPdf(acompanhamentoFilial));
        }
      }
    }

    return body;
  }

  private adicionarLinhaTotalPdf(): any[] {
    const fillColor = Cores.LightGreen;
    const bold = true;
    const alignment = 'center';

    return [
      { text: 'TOTAL', colSpan: 2, bold, fillColor, alignment },
      '',
      {
        text: this.acompanhamentoTotal.qtd_produtores_contratados,
        bold,
        fillColor,
        alignment,
      },
      {
        text: this.acompanhamentoTotal.qtd_produtores_atendidos,
        bold,
        fillColor,
        alignment,
      },
      {
        text: this.acompanhamentoTotal.porcentagem_atendimentos,
        bold,
        fillColor,
        alignment,
      },
      { text: '', bold, fillColor, alignment },
      { text: '', bold, fillColor, alignment },
    ];
  }

  private adicionarLinhaEstadoPdf(
    acompanhamentoEstado: AcompanhamentoEstadoItem,
  ): any[] {
    const alignment = 'center';

    return [
      {
        text: acompanhamentoEstado.estado,
        colSpan: 2,
        bold: true,
        fillColor: Cores.DarkSeaGreen,
        alignment,
      },
      '',
      {
        text: acompanhamentoEstado.qtd_produtores_contratados,
        bold: true,
        fillColor: Cores.DarkSeaGreen,
        alignment,
      },
      {
        text: acompanhamentoEstado.qtd_produtores_atendidos,
        bold: true,
        fillColor: Cores.DarkSeaGreen,
        alignment,
      },
      {
        text: acompanhamentoEstado.porcentagem_atendimentos,
        bold: true,
        fillColor: Cores.DarkSeaGreen,
        alignment,
      },
      { text: '', bold: true, fillColor: Cores.DarkSeaGreen, alignment },
      { text: '', bold: true, fillColor: Cores.DarkSeaGreen, alignment },
    ];
  }

  private adicionarLinhaFilialPdf(
    acompanhamentoFilial: AcompanhamentoFilialItem,
  ): any[] {
    const alignment = 'center';

    return [
      { text: acompanhamentoFilial.filial },
      { text: acompanhamentoFilial.consultores, alignment },
      { text: acompanhamentoFilial.qtd_produtores_contratados, alignment },
      { text: acompanhamentoFilial.qtd_produtores_atendidos, alignment },
      { text: acompanhamentoFilial.porcentagem_atendimentos, alignment },
      { text: acompanhamentoFilial.previsao_produtividade_media, alignment },
      {
        text: acompanhamentoFilial.media_dias_atendimento_antes_plantio,
        alignment,
      },
    ];
  }

  private adicionarHeaderPdf(): any {
    return {
      columns: [
        {
          width: '30%',
          alignment: 'left',
          image: this.definicoesDoDocumento.images.logoBiodiesel,
          fit: [180, 35],
        },
        {
          stack: [
            { text: this.cliente?.nome, alignment: 'center' },
            { text: 'Relatório de Atendimentos', alignment: 'center' },
          ],
          style: 'header',
        },
        {
          width: '30%',
          alignment: 'right',
          image: this.definicoesDoDocumento.images.logoIbs,
          fit: [180, 35],
        },
      ],
    };
  }

  private adicionarDescricaoFiltrosPdf(): any {
    const bold = true;
    const fillColor = Cores.DarkSeaGreen;

    const body = [];
    body.push([{ text: 'Data', bold, fillColor }, { text: dataFormatada() }]);
    // Cliente
    if (this.cliente) {
      body.push([{ text: 'Cliente', bold, fillColor }, this.cliente?.nome]);
    }
    // Filial
    if (this.filial) {
      body.push([{ text: 'Filial', bold, fillColor }, this.filial?.nome]);
    }
    // Questionario
    if (this.questionario) {
      const nome = this.tema
        ? `${this.questionario?.nome} - ${this.tema?.nome}`
        : this.questionario?.nome;

      body.push([{ text: 'Questionário', bold, fillColor }, nome]);
    }
    // Safra
    if (this.safraSelecionada) {
      body.push([
        { text: 'Safra', bold, fillColor },
        this.safraSelecionada?.nome,
      ]);
    }
    // Propriedades
    if (this.propriedades && this.propriedades.length > 0) {
      const propriedades: string[] = [];
      this.propriedades.map(p => propriedades.push(p.nome));

      body.push([
        {
          text: 'Propriedade(s)',
          bold,
          fillColor,
        },
        propriedades.join(', '),
      ]);
    }

    return {
      table: {
        widths: ['25%', '75%'],
        body: [...body],
      },
      style: {
        fontSize: 10,
      },
      layout: {
        vLineWidth: () => 1,
        hLineWidth: () => 1,
        paddingTop: () => 5,
        paddingBottom: () => 5,
      },
    };
  }

  protected imprimirConteudo() {
    const headerPagina = this.adicionarHeaderPdf();
    const tabelaFiltrosDescricao = this.adicionarDescricaoFiltrosPdf();
    const tabelaHeader = this.adicionarHeaderTabelaPdf();
    const tabela = this.adicionarTabelaPdf();

    this.conteudo.push([
      headerPagina,
      tabelaHeader,
      tabelaFiltrosDescricao,
      tabela,
    ]);
  }
}
