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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QuePerguntaVariavelService } from './que-pergunta-variavel.service';
import { QuePerguntaVariavelDto } from './que-pergunta-variavel.dto';

@Controller('que-pergunta-variavel')
export class QuePerguntaVariavelController extends CoreController<
  QuePerguntaVariavelService
> {
  constructor(protected service: QuePerguntaVariavelService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QuePerguntaVariavelDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QuePerguntaVariavelDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QuePerguntaVariavelDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete(
    'que-pergunta/:pergunta_id/pergunta-referenciada/:pergunta_referenciada_id',
  )
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: QuePerguntaVariavelDto, @Res() response) {
    return this.service
      .deletarRelacao(params.pergunta_id, params.pergunta_referenciada_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
