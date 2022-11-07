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

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AcompanhamentoLaudo3Service } from './acompanhamento-laudo-3.service';
import { AcompanhamentoQueryDto } from '../acompanhamento/acompanhamento-query.dto';

@Controller('relatorio/acompanhamento-laudo-3')
export class AcompanhamentoLaudo3Controller {
  constructor(private readonly service: AcompanhamentoLaudo3Service) {}

  // @UseGuards(JwtAuthGuard) Desabilitado para permitir o envio de emails
  @UsePipes(new ValidationPipe())
  @Get()
  @ApiQuery({
    name: 'propriedade_id',
    type: 'number | number[]',
    required: false,
  })
  @ApiQuery({ name: 'filial_id', type: 'number', required: false })
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  @ApiQuery({ name: 'safra_id', type: 'number', required: false })
  @ApiQuery({ name: 'questionario_id', type: 'number', required: false })
  @ApiQuery({ name: 'modo', type: 'pdf | xls' })
  protected show(@Res() response, @Query() query?: AcompanhamentoQueryDto) {
    const parametros = JSON.parse(JSON.stringify(query));

    return this.service.get(parametros, response);
  }
}
