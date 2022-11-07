import {
  Body,
  Controller, Get, Patch,
  Post,
  Put, Query,
  Res, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from 'src/domain/usuario/usuario.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('usuario')
export class UsuarioController extends CoreController<UsuarioService> {
  constructor(protected service: UsuarioService) {
    super(service);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  index(@Res() response, @Query() query?) {
    return this.findAll(response, query);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: UsuarioDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UsuarioDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: UsuarioDto, @Res() response) {
    return this.save(dto, response);
  }
}
