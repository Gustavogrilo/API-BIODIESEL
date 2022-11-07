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
import { QuePerguntaItemListaService } from './que-pergunta-item-lista.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QuePerguntaItemListaDto } from './que-pergunta-item-lista.dto';

@Controller('que-pergunta-item-lista')
export class QuePerguntaItemListaController extends CoreController<
  QuePerguntaItemListaService
> {
  constructor(protected service: QuePerguntaItemListaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QuePerguntaItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QuePerguntaItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QuePerguntaItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete('que-pergunta/:pergunta_id/que-item-lista/:item_lista_id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: QuePerguntaItemListaDto, @Res() response) {
    return this.service
      .deletarRelacao(params.pergunta_id, params.item_lista_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Delete('que-pergunta/:pergunta_id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  destroyAll(@Param() params: QuePerguntaItemListaDto, @Res() response) {
    return this.service
      .deletarRelacao(params.pergunta_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
