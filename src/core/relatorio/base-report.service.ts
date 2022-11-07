import { HttpException, HttpStatus } from '@nestjs/common';
import { Connection, getConnection, SelectQueryBuilder } from 'typeorm';

import * as fs from 'fs';
import * as PdfMake from 'pdfmake';

import { fontesPdfMake } from 'src/util';
import { Safra } from '../../domain/safra/safra.entity';

export abstract class BaseReportService {
  protected abstract definicoesDoDocumento: Partial<DefinicoesDoDocumento>;

  protected parametros: Partial<Parametros>;
  protected conteudo: any[] = [];
  protected incluirConteudo: boolean;
  protected incluirAnexos: boolean;
  protected safra: Safra;

  protected readonly printer = new PdfMake(fontesPdfMake);

  constructor() {
    if (!fs.existsSync('tmp')) {
      fs.mkdirSync('tmp');
    }
  }

  async get(parametros: Partial<Parametros>, response: any) {
    this.getParametros(parametros);

    try {
      await this.carregarConteudo().then(() => this.imprimirConteudo());

      return this.enviarPdf(response);
    } catch (e) {
      this.emitirErro(e);
    }
  }

  protected getParametros(parametros: Partial<Parametros>) {
    this.parametros = parametros;

    this.incluirConteudo = parametros?.hasOwnProperty('incluir_conteudo');
    this.incluirAnexos = parametros?.hasOwnProperty('incluir_anexos');
  }

  protected abstract async carregarConteudo(): Promise<void>;

  protected abstract imprimirConteudo();

  protected enviarPdf(response): void {
    const chunks = [];

    const documento = this.printer.createPdfKitDocument({
      ...this.definicoesDoDocumento,
      content: this.conteudo,
    });

    documento.on('data', (chunk) => chunks.push(chunk));

    documento.on('end', async () => {
      const result = Buffer.concat(chunks);

      response.header('content-type', 'application/pdf');

      return response.send(result);
    });

    documento.end();
  }

  protected emitirErro(e): void {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e.message || e,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  protected async carregarAnexo(id: number): Promise<string> {
    const anexo: any = await this.connection
      .createQueryBuilder()
      .from('Anexo', 'anexo')
      .where({ id })
      .getOne();

    if (anexo) {
      const buffer = Buffer.from(anexo.arquivo).toString('base64');

      return `data:${anexo.tipo};base64,${buffer}`;
    } else {
      return null;
    }
  }

  protected carregarImagemLocal(parametros: {
    arquivo: string;
    identificacao: string;
    caminho?: string;
    tipo?: string;
  }): void {
    const caminho = parametros.caminho || 'assets/img/';

    const tipo =
      parametros.tipo ||
      parametros.arquivo
        .substr(parametros.arquivo.lastIndexOf('.'))
        .substring(1);

    const imagem = fs.readFileSync(caminho + parametros.arquivo);

    const buffer = Buffer.from(imagem);

    this.definicoesDoDocumento.images[parametros.identificacao] =
      'data:image/' + tipo + ';base64,' + buffer.toString('base64');
  }

  protected async carregarSafra() {
    this.safra = await this.connection.manager.findOneOrFail(Safra, {
      where: { id: this.parametros.safra_id },
    });
  }

  protected get connection(): Connection {
    return getConnection();
  }

  protected get queryBuilder(): SelectQueryBuilder<any> {
    return getConnection().createQueryBuilder();
  }
}

type Style =
  | 'fontSize'
  | 'lineHeight'
  | 'margin'
  | 'alignment'
  | 'bold'
  | 'color';
type Info = 'title' | 'author' | 'subject' | 'keywords';

interface Parametros {
  cliente_id: number;
  filial_id: number;
  safra_id: number;
  questionario_id: number;
  tema_id: number;
  estado_id: number;
  municipio_id: number;
  propriedade_id: number[] | number;
  modo: string;
}

export interface DefinicoesDoDocumento {
  info: {
    [key in Info]?: string;
  };
  pageSize:
    | 'A0'
    | 'A1'
    | 'A2'
    | 'A3'
    | 'A4'
    | 'A5'
    | 'A6'
    | 'A7'
    | 'A8'
    | 'A9'
    | 'A10';
  pageMargins: number[];
  pageOrientation: 'landscape' | 'portrait';
  defaultStyle: {
    font?: 'Helvetica';
    fontSize?: number;
  };
  styles: {
    [key: string]: { [key in Style]?: string | number | number[] | boolean };
  };
  background: Function;
  header: Function;
  footer: Function;
  images: { [key: string]: string };
}
