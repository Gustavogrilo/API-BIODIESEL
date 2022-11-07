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
import { ClientePropriedadeService } from './cliente-propriedade.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ClientePropriedadeDto } from './cliente-propriedade.dto';

@Controller('cliente-propriedade')
export class ClientePropriedadeController extends CoreController<
  ClientePropriedadeService
> {
  constructor(protected service: ClientePropriedadeService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: ClientePropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: ClientePropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: ClientePropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete('cliente/:cliente_id/filial/:filial_id/propriedade/:propriedade_id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: ClientePropriedadeDto, @Res() response) {
    return this.service
      .deletarRelacao(
        params.cliente_id,
        params.filial_id,
        params.propriedade_id,
      )
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
