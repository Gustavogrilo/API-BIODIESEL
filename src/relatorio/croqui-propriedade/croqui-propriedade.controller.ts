import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { RelatorioCroquiPropriedadeService } from './croqui-propriedade.service';

@Controller('relatorio/croqui-propriedade')
export class RelatorioCroquiPropriedadeController {
  constructor(private service: RelatorioCroquiPropriedadeService) {}

  @Get()
  @ApiQuery({ name: 'produtor_id', type: 'number', required: false })
  @ApiQuery({ name: 'propriedade_id', type: 'number', required: false })
  @ApiQuery({ name: 'safra_id', type: 'number', required: false })
  @ApiQuery({ name: 'filial_id', type: 'number', required: false })
  @ApiQuery({ name: 'tecnico_id', type: 'number', required: false })
  @ApiQuery({ name: 'municipio_id', type: 'number', required: false })
  @ApiQuery({ name: 'estado_id', type: 'number', required: false })
  protected show(@Res() response, @Query() query?: Record<string, string>) {
    const parametros = JSON.parse(JSON.stringify(query));

    return this.service.get(parametros, response);
  }
}
