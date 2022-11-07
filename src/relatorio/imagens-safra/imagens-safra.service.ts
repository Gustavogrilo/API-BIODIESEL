import { Injectable, Scope } from '@nestjs/common';

import * as JSZip from 'jszip';

import { BaseReportService, DefinicoesDoDocumento } from 'src/core';
import { Cores } from 'src/util';

import {
  ImagensPropriedade,
  QueRespostaService,
} from 'src/domain/que-resposta/que-resposta.service';
import { Safra } from 'src/domain/safra/safra.entity';
import { Questionario } from 'src/domain/questionario/questionario.entity';
import { Cliente } from 'src/domain/cliente/cliente.entity';
import { CroquiPropriedadeService } from '../../domain/croqui-propriedade/croqui-propriedade.service';

@Injectable({ scope: Scope.REQUEST })
export class ImagensSafraService extends BaseReportService {
  protected definicoesDoDocumento: Partial<DefinicoesDoDocumento> = {
    info: {
      title: 'imagens-safra',
    },
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 30],
    defaultStyle: {
      font: 'Helvetica',
      fontSize: 12,
    },
    styles: {
      header: {
        alignment: 'center',
        lineHeight: 1.6,
        fontSize: 15,
      },
    },
    images: {},
    background: (currentPage, pageSize) => ({
      image: 'assets/img/background_borda_paisagem.jpg',
      width: pageSize.width,
      height: pageSize.height,
    }),
    footer: (currentPage, pageCount, pageSize) => ({
      text: currentPage,
      alignment: 'right',
      margin: [0, -3, 37, 0],
    }),
  };

  private cliente: Cliente;
  private safraSelecionada: Safra;
  private questionario: Questionario;
  private imagensPorPropriedade: ImagensPropriedade = {};

  constructor(
    private respostaService: QueRespostaService,
    private croquiPropriedadeService: CroquiPropriedadeService,
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
        case 'zip':
          this.enviarZip(response);
          break;
      }
    } catch (e) {
      this.emitirErro(e);
    }
  }

  protected getParametros(parametros) {
    super.getParametros(parametros);

    if (this.parametros.propriedade_id) {
      this.parametros.propriedade_id = JSON.parse(
        (this.parametros.propriedade_id as unknown) as string,
      );
    }
  }

  private enviarZip(response): void {
    try {
      const zip = new JSZip();

      for (const propriedade_id of Object.keys(this.imagensPorPropriedade)) {
        let index = 1;

        for (const imagem of this.imagensPorPropriedade[propriedade_id]) {
          if (!!imagem.anexo_arquivo) {
            const tipo = imagem.anexo_tipo.split('/')[1];
            const path = imagem.croqui
              ? `${imagem.produtor} - ${imagem.propriedade}_CROQUI.${tipo}`
              : `${imagem.produtor} - ${imagem.propriedade}_${index++}.${tipo}`;

            zip.file(
              path,
              Buffer.from(imagem.anexo_arquivo).toString('base64'),
              { base64: true },
            );
          }
        }
      }

      zip.generateAsync({ type: 'nodebuffer' }).then(file => {
        response.set('Content-Type', 'application/zip');
        response.set('Content-Disposition', 'attachment; filename=file.zip');
        response.send(file);
      });
    } catch (error) {
      response
        .status(500)
        .send({ status: 500, message: 'Erro ao zipar imagens', error });
    }
  }

  protected async carregarConteudo(): Promise<void> {
    const imagens = [
      {
        arquivo: 'logo_biodiesel_grande.png',
        identificacao: 'logo_biodiesel',
      },
      {
        arquivo: 'logo_ibsagro.png',
        identificacao: 'logo_ibs',
      },
    ];

    for (const imagem of imagens) {
      this.carregarImagemLocal(imagem);
    }

    await Promise.all([
      this.carregarCliente(),
      this.carregarSafraSelecionada(),
      this.carregarQuestionario(),
      this.carregarCroquis(),
    ]);

    await this.carregarImagens();
  }

  protected imprimirConteudo(): void {
    let cont = 0;

    for (const propriedade_id of Object.keys(this.imagensPorPropriedade)) {
      const header = () => {
        const conteudo: any = this.header(
          this.imagensPorPropriedade[propriedade_id][0],
        );

        return cont++ > 0
          ? [{ pageBreak: 'before', text: '' }, ...conteudo]
          : conteudo;
      };

      const imagens = () => {
        const getImagem = (index: 0 | 1 | 2 | 3) => {
          const arquivo = this.imagensPorPropriedade[propriedade_id][index]
            ?.anexo_arquivo;

          return arquivo
            ? {
                width: '50%',
                alignment: 'center',
                image: arquivo,
                fit: [350, 215],
              }
            : {
                width: '50%',
                alignment: 'center',
                text: '',
              };
        };

        const conteudo = [
          {
            margin: [0, 5, 0, 0],
            columns: [getImagem(0), getImagem(1)],
          },
          {
            margin: [0, 10, 0, 0],
            columns: [getImagem(2), getImagem(3)],
          },
        ];

        return conteudo;
      };

      this.conteudo.push([header(), imagens()]);
    }
  }

  private async carregarImagens(): Promise<void> {
    const imagensPorPropriedade = await this.respostaService.imagensPorPropriedade(
      this.parametros,
    );

    for (const propriedade_id of Object.keys(imagensPorPropriedade)) {
      if (!this.imagensPorPropriedade[propriedade_id]) {
        this.imagensPorPropriedade[propriedade_id] = [];
      }

      this.imagensPorPropriedade[propriedade_id].push(
        ...imagensPorPropriedade[propriedade_id],
      );
    }
  }

  private async carregarCroquis(): Promise<void> {
    const croquiPorPropriedade = await this.croquiPropriedadeService.croquiPorPropriedade(
      this.parametros,
    );

    for (const propriedade_id of Object.keys(croquiPorPropriedade)) {
      if (!this.imagensPorPropriedade[propriedade_id]) {
        this.imagensPorPropriedade[propriedade_id] = [];
      }

      this.imagensPorPropriedade[propriedade_id].push(
        ...croquiPorPropriedade[propriedade_id],
      );
    }
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

  private async carregarSafraSelecionada(): Promise<void> {
    const safra: Safra = await this.queryBuilder
      .from('Safra', 'safra')
      .where('safra.id = :safra_id', { safra_id: this.parametros.safra_id })
      .getRawOne();

    this.safraSelecionada = JSON.parse(JSON.stringify(safra));
  }

  private async carregarQuestionario(): Promise<void> {
    const questionario: Questionario = await this.queryBuilder
      .from('Questionario', 'questionario')
      .where('questionario.id = :questionario_id', {
        questionario_id: this.parametros.questionario_id,
      })
      .getRawOne();

    this.questionario = JSON.parse(JSON.stringify(questionario));
  }

  private header(propriedade: any) {
    const fillColor = Cores.DarkSeaGreen;
    const fillColor2 = '#EEE';
    const color = 'white';
    const bold = true;

    const header = {
      columns: [
        {
          width: '25%',
          alignment: 'left',
          image: 'logo_biodiesel',
          fit: [180, 35],
        },
        {
          stack: [{ text: this.cliente?.nome }, { text: 'Resumo de imagens' }],
          style: 'header',
        },
        {
          width: '25%',
          alignment: 'right',
          image: 'logo_ibs',
          fit: [180, 35],
        },
      ],
    };

    const tabela = {
      margin: [0, -5, 0, 5],
      table: {
        widths: ['10%', '40%', '10%', '40%'],
        body: [
          [
            { text: 'Safra: ', color, fillColor, bold },
            { text: this.safraSelecionada?.nome, fillColor: fillColor2 },
            { text: 'Questionário: ', color, fillColor, bold },
            { text: this.questionario?.nome, fillColor: fillColor2 },
          ],
          ['', '', '', ''],
          [
            { text: 'Produtor: ', color, fillColor, bold },
            { text: propriedade.produtor, fillColor: fillColor2 },
            { text: 'Propriedade: ', color, fillColor, bold },
            { text: propriedade.propriedade, fillColor: fillColor2 },
          ],
        ],
      },
      style: {
        fontSize: 9,
      },
      layout: {
        vLineWidth: () => 0,
        hLineWidth: () => 0,
        paddingTop: () => 5,
        paddingBottom: () => 3,
      },
    };

    return [header, tabela];
  }
}
