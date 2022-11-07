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
import { UsuarioProdutorService } from './usuario-produtor.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsuarioProdutorDto } from 'src/domain/usuario-produtor/usuario-produtor.dto';

@Controller('usuario-produtor')
export class UsuarioProdutorController extends CoreController<
  UsuarioProdutorService
> {
  constructor(protected service: UsuarioProdutorService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: UsuarioProdutorDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UsuarioProdutorDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: UsuarioProdutorDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete('usuario/:usuario_id/produtor/:produtor_id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: UsuarioProdutorDto, @Res() response) {
    return this.service
      .deletarRelacao(params.usuario_id, params.produtor_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
