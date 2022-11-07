import {
  Body,
  Controller, Get,
  Patch,
  Post,
  Put, Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { QueDiagnosticoService } from './que-diagnostico.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueDiagnosticoDto } from './que-diagnostico.dto';

@Controller('que-diagnostico')
export class QueDiagnosticoController extends CoreController<
  QueDiagnosticoService
> {
  constructor(protected service: QueDiagnosticoService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueDiagnosticoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueDiagnosticoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueDiagnosticoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Get('relatorio-laudo-3')
  @UseGuards(JwtAuthGuard)
  protected relatorioLaudo3(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .getRelatorioLaudo03(params)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }
}
