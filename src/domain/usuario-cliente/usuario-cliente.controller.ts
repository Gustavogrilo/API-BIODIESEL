import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { UsuarioClienteService } from 'src/domain/usuario-cliente/usuario-cliente.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsuarioClienteDto } from 'src/domain/usuario-cliente/usuario-cliente.dto';

@Controller('usuario-cliente')
export class UsuarioClienteController extends CoreController<
  UsuarioClienteService
> {
  constructor(protected service: UsuarioClienteService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: UsuarioClienteDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UsuarioClienteDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: UsuarioClienteDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete('usuario/:usuario_id/cliente/:cliente_id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: UsuarioClienteDto, @Res() response) {
    return this.service
      .deletarRelacao(params.usuario_id, params.cliente_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
