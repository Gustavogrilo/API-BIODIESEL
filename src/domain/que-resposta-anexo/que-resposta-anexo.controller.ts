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
import { QueRespostaAnexoService } from './que-resposta-anexo.service';
import { QueRespostaAnexoDto } from './que-resposta-anexo.dto';

@Controller('que-resposta-anexo')
export class QueRespostaAnexoController extends CoreController<
  QueRespostaAnexoService
> {
  constructor(protected service: QueRespostaAnexoService) {
    super(service);
  }
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueRespostaAnexoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueRespostaAnexoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueRespostaAnexoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete('que-resposta/:resposta_id/anexo/:anexo_id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: QueRespostaAnexoDto, @Res() response) {
    return this.service
      .deletarRelacao(params.resposta_id, params.anexo_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
