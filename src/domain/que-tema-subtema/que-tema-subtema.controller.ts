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
import { QueTemaSubtemaService } from 'src/domain/que-tema-subtema/que-tema-subtema.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueTemaSubtemaDto } from './que-tema-subtema.dto';

@Controller('que-tema-subtema')
export class QueTemaSubtemaController extends CoreController<
  QueTemaSubtemaService
> {
  constructor(protected service: QueTemaSubtemaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueTemaSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueTemaSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueTemaSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete(
    'questionario/:questionario_id/que-tema/:tema_id/que-subtema/:subtema_id/item/:item',
  )
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: QueTemaSubtemaDto, @Res() response) {
    return this.service
      .deletarRelacao(
        params.questionario_id,
        params.tema_id,
        params.subtema_id,
        params.item,
      )
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
