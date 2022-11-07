import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiQuery } from '@nestjs/swagger';

import { BaseReportController } from 'src/core';
import { AcompanhamentoService } from './acompanhamento.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AcompanhamentoQueryDto } from './acompanhamento-query.dto';

@Controller('relatorio/acompanhamento')
export class AcompanhamentoController extends BaseReportController<
  AcompanhamentoService
> {
  constructor(protected service: AcompanhamentoService) {
    super(service);
  }

  // @UseGuards(JwtAuthGuard) Desabilitado para permitir o envio de emails
  @UsePipes(new ValidationPipe())
  @Get()
  @ApiQuery({
    name: 'propriedade_id',
    type: 'number | number[]',
    required: false,
  })
  @ApiQuery({ name: 'questionario_id', type: 'number', required: false })
  @ApiQuery({ name: 'safra_id', type: 'number', required: false })
  @ApiQuery({ name: 'filial_id', type: 'number', required: false })
  @ApiQuery({ name: 'modo', type: 'pdf | xls' })
  @ApiQuery({ name: 'cliente_id', type: 'number' })
  protected show(@Res() response, @Query() query?: AcompanhamentoQueryDto) {
    const parametros = JSON.parse(JSON.stringify(query));

    return this.service.get(parametros, response);
  }
}
