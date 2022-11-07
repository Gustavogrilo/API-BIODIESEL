import { Controller, Get, Query, Res, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
import { BaseReportController } from '../../core';
import { ApiQuery } from '@nestjs/swagger';
import { AcompanhamentoQueryDto } from '../acompanhamento/acompanhamento-query.dto';
import { RelatorioXTecnicoService } from './relatorio-x-tecnico.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('relatorio/relatorio-x-tecnico')
export class RelatorioXTecnicoController extends BaseReportController<RelatorioXTecnicoService> {
  constructor(protected service: RelatorioXTecnicoService) {
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
