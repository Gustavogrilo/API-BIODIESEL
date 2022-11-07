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
import { PlanilhaLaudosService } from './planilha-laudos.service';

@Controller('relatorio/planilha-laudos')
export class PlanilhaLaudosController {
  constructor(private readonly planilhaLaudosService: PlanilhaLaudosService) {}

  // @UseGuards(JwtAuthGuard) Desabilitado para permitir o envio de emails
  @UsePipes(new ValidationPipe())
  @Get()
  @ApiQuery({ name: 'questionario_id', type: 'number', required: false })
  @ApiQuery({ name: 'tema_id', type: 'number', required: false })
  protected show(@Res() response, @Query() query) {
    const parametros = JSON.parse(JSON.stringify(query));

    return this.planilhaLaudosService.get(parametros, response);
  }
}
