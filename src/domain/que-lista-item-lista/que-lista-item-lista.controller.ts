import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { QueListaItemListaService } from './que-lista-item-lista.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueListaItemListaDto } from './que-lista-item-lista.dto';

@Controller('que-lista-item-lista')
export class QueListaItemListaController extends CoreController<
  QueListaItemListaService
> {
  constructor(protected service: QueListaItemListaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueListaItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueListaItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueListaItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete('que-lista/:lista_id/que-item-lista/:item_lista_id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: QueListaItemListaDto, @Res() response) {
    return this.service
      .deletarRelacao(params.lista_id, params.item_lista_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
