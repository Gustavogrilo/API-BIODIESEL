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
import { QuestionarioTemaService } from './questionario-tema.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QuestionarioTemaDto } from './questionario-tema.dto';

@Controller('questionario-tema')
export class QuestionarioTemaController extends CoreController<
  QuestionarioTemaService
> {
  constructor(protected service: QuestionarioTemaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QuestionarioTemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QuestionarioTemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QuestionarioTemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete('questionario/:tema_id/que-tema/:subtema_id/item/:item')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: QuestionarioTemaDto, @Res() response) {
    return this.service
      .deletarRelacao(params.questionario_id, params.tema_id, params.item)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
