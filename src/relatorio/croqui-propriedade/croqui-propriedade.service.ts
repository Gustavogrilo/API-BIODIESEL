import { Injectable, Scope } from '@nestjs/common';

import * as JSZip from 'jszip';

import {
  CroquiPropriedadeService as CroquiPropriedadeEntityService,
  GetCroquisProcedureResponse,
} from '../../domain/croqui-propriedade/croqui-propriedade.service';

@Injectable({ scope: Scope.REQUEST })
export class RelatorioCroquiPropriedadeService {
  protected parametros: Record<string, number> = {};
  protected croquis: GetCroquisProcedureResponse = [];

  constructor(
    private croquiPropriedadeService: CroquiPropriedadeEntityService,
  ) {}

  async get(parametros: Record<string, number>, response: any) {
    Object.assign(this.parametros, parametros);

    await this.carregarConteudo();

    this.enviarZip(response);
  }

  async carregarConteudo(): Promise<void> {
    this.croquis = await this.croquiPropriedadeService.callGetCroquisProcedure(
      this.parametros,
    );
  }

  enviarZip(response: any) {
    try {
      const zip = new JSZip();

      for (const croqui of this.croquis) {
        zip.file(croqui.imagem_nome, croqui.imagem_arquivo.toString('base64'), {
          base64: true,
        });
      }

      zip.generateAsync({ type: 'nodebuffer' }).then(file => {
        response.set('Content-Type', 'application/zip');
        response.set('Content-Disposition', 'attachment; filename=croquis.zip');
        response.send(file);
      });
    } catch (error) {
      response
        .status(500)
        .send({ status: 500, message: 'Erro ao zipar imagens', error });
    }
  }
}
