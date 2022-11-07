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
import { ImagensSafraService } from './imagens-safra.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ImagensSafraQueryDto } from 'src/relatorio/imagens-safra/imagens-safra-query.dto';

@Controller('relatorio/resumo-imagens')
export class ImagensSafraController extends BaseReportController<
  ImagensSafraService
> {
  constructor(protected service: ImagensSafraService) {
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
  @ApiQuery({ name: 'modo', type: 'pdf | zip' })
  @ApiQuery({ name: 'questionario_id', type: 'number' })
  @ApiQuery({ name: 'safra_id', type: 'number' })
  @ApiQuery({ name: 'filial_id', type: 'number', required: false })
  @ApiQuery({ name: 'cliente_id', type: 'number' })
  protected show(@Res() response, @Query() query?: ImagensSafraQueryDto) {
    const parametros = JSON.parse(JSON.stringify(query));

    return this.service.get(parametros, response);
  }
}
