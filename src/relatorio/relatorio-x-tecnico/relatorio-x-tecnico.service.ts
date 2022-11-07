import { Injectable, Scope } from '@nestjs/common';
import { BaseReportService, DefinicoesDoDocumento } from '../../core';
import { Cliente } from '../../domain/cliente/cliente.entity';
import { Safra } from '../../domain/safra/safra.entity';
import { Questionario } from '../../domain/questionario/questionario.entity';
import { Cores, dataFormatada } from '../../util';
import { Filial } from '../../domain/filial/filial.entity';
import { QueTema } from '../../domain/que-tema/que-tema.entity';
import { Propriedade } from '../../domain/propriedade/propriedade.entity';


@Injectable({ scope: Scope.REQUEST })
export class RelatorioXTecnicoService extends BaseReportService {
  protected definicoesDoDocumento: Partial<DefinicoesDoDocumento> = {
    info: {
      title: 'Relatório de atendimento x técnico',
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
  private consultorAtendimento: { atendimento: number, nome?: string, crea?: string, local?: string }[];
  private totalAtendimentos: number;

  constructor() {
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
        default:
          this.emitirErro({ message: 'Selecione um modo' });
      }
    } catch (e) {
      this.emitirErro(e);
    }
  }

  // Métodos para carregamento de conteúdos
  protected async carregarConteudo(): Promise<void> {

    await Promise.all([
      this.carregarCliente(),
      this.carregarFilial(),
      this.carregarQuestionario(),
      this.carregarTema(),
      this.carregarSafraSelecionada(),
    ]);

    await Promise.all([
      this.carregarRelatorioConsultorAtendimento(this.parametros),
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

  getConsultorAtendimentoRelatorio(query?, countTotal?: boolean): Promise<{ atendimento: number, nome?: string, crea?: string, local?: string }[]> {

    const consulta = this.connection.createQueryBuilder().from('pessoa', 'ps');

    consulta.select(
      countTotal 
        ? 'COUNT(DISTINCT (p.produtor_id)) AS atendimento'
        : 'DISTINCT(CONCAT(ps.nome, \' \', ps.sobrenome )) as nome, ps.crea  as crea, GROUP_CONCAT(DISTINCT (CONCAT(m.nome, \'(\', e.nome, \') \'))) as local, COUNT(DISTINCT (p.produtor_id)) as atendimento')
      .innerJoin('que_diagnostico', 'qd', 'ps.id = qd.consultor_id')
      .innerJoin('que_resposta', 'qr', 'qd.id = qr.diagnostico_id')
      .innerJoin('questionario', 'qst', 'qst.id = qd.questionario_id')
      .innerJoin('propriedade', 'p', 'qd.propriedade_id = p.id AND p.ativo IS TRUE')
      .innerJoin('pessoa', 'produtor', 'p.produtor_id = produtor.id AND produtor.ativo IS TRUE')
      .leftJoin('municipio', 'm', 'p.municipio_id = m.id')
      .leftJoin('estado', 'e', 'm.estado_id = e.id')
      .innerJoin('cliente_propriedade', 'cpr', 'p.id = cpr.propriedade_id')
      .where('1 = 1');

    if (query.ativo) {
      consulta.andWhere('ps.ativo = 1');
    }

    if (query.safra_id) {
      consulta.andWhere('qst.safra_id = :safra_id', { safra_id: query.safra_id });
    }

    if (query.cliente_id) {
      consulta.innerJoin('cliente_pessoa', 'cp', 'ps.id = cp.pessoa_id')
        .andWhere('cp.cliente_id = :cliente_id', { cliente_id: query.cliente_id });
    }

    if (query.propriedade_id) {
      consulta.andWhere('qd.propriedade_id IN (:...propriedades)', { propriedades: JSON.parse(query.propriedade_id) });
    }

    if (query.tema_id) {
      consulta.andWhere('qr.tema_id = :tema_id', { tema_id: query.tema_id });
    }

    if (query.filial_id) {
      consulta.andWhere('cpr.filial_id = :filial_id', { filial_id: query.filial_id });
    }

    if (query.questionario_id) {
      consulta.andWhere('qst.id = :questionario_id', { questionario_id: query.questionario_id });
    }


    if (!countTotal) {
      consulta.groupBy('nome, crea');
    } 

    return consulta.getRawMany() as Promise<{ atendimento: number, nome?: string, crea?: string, local?: string}[]>;
  }


  private async carregarRelatorioConsultorAtendimento(parametro): Promise<void> {
    this.consultorAtendimento = await this.getConsultorAtendimentoRelatorio(parametro, false);
    this.totalAtendimentos = await this.getConsultorAtendimentoRelatorio(parametro, true).then(res => +res[0]?.atendimento ?? 0);;
  }

  private adicionarTotalTabelaPdf(): any {
    return {
      table: {
        widths: ['100%'],
        body: [
          // Linha 1
          [
            {
              text: this.totalAtendimentos ?? 0,
              bold: true,
              fontSize: 10,
              color: 'black',
              alignment: 'center',
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

  private adicionarTotalTabelaHeaderPdf(): any {
    return {
      table: {
        widths: ['100%'],
        body: [
          // Linha 1
          [
            {
              text: 'Produtores atendidos',
              bold: true,
              fillColor: Cores.DarkSeaGreen,
              fontSize: 10,
              color: 'black',
              alignment: 'center',

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

  // Métodos para PDF
  private adicionarTabelaPdf(): any {
    const alignment = 'center';
    const header = [
      [
        {
          text: 'Técnico',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 5, 0, 0],
          alignment,
        },
        {
          text: 'CREA',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 5, 0, 0],
          alignment,
        },
        {
          text: 'Produtores atendidos',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 5, 0, 0],
          alignment,
        },
        {
          text: 'Área de Atuacão',
          bold: true,
          fillColor: Cores.DarkSeaGreen,
          margin: [0, 5, 0, 0],
          alignment,
        },
      ],
    ];
    const body = this.adicionarBodyTabelaPdf();

    return {
      table: {
        headerRows: 1,
        dontBreakRows: false,
        widths: ['20%', '10%', '15%', '55%'],
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
    for (const index of this.consultorAtendimento ?? []) {
      body.push(this.adicionarLinhaConsultor(index));
    }
    return body;
  }


  private adicionarLinhaConsultor(
    consultor: { atendimento: number, nome?: string, crea?: string, local?: string },
  ): any[] {
    const alignment = 'center';

    return [
      { text: consultor.nome },
      { text: consultor.crea, alignment },
      { text: consultor.atendimento, alignment },
      { text: consultor.local, alignment },
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
            { text: 'Relatório de Atendimentos X Técnicos', alignment: 'center' },
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
      body.push([{ text: 'Safra', bold, fillColor }, this.safraSelecionada?.nome]);
    }

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
    const total = this.adicionarTotalTabelaPdf();
    const totalHeader = this.adicionarTotalTabelaHeaderPdf();


      this.conteudo.push([
      headerPagina,
      tabelaHeader,
      tabelaFiltrosDescricao,
      totalHeader,
      total,
      tabela,
    ]);
  }
}
