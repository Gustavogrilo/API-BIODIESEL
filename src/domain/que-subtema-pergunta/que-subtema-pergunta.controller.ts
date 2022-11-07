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
import { QueSubtemaPerguntaService } from './que-subtema-pergunta.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueSubtemaPerguntaDto } from './que-subtema-pergunta.dto';

@Controller('que-subtema-pergunta')
export class QueSubtemaPerguntaController extends CoreController<
  QueSubtemaPerguntaService
> {
  constructor(protected service: QueSubtemaPerguntaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueSubtemaPerguntaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueSubtemaPerguntaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueSubtemaPerguntaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete(
    'questionario/:questionario_id/que-subtema/:subtema_id/que-pergunta/:pergunta_id/item/:item',
  )
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: QueSubtemaPerguntaDto, @Res() response) {
    return this.service
      .deletarRelacao(
        params.questionario_id,
        params.subtema_id,
        params.pergunta_id,
        params.item,
      )
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
