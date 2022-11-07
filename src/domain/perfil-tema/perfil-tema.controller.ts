import {
  Body,
  Controller,
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
import { PerfilTemaService } from './perfil-tema.service';
import { PerfilTemaDto } from './perfil-tema.dto';

@Controller('perfil-tema')
export class PerfilTemaController extends CoreController<PerfilTemaService> {
  constructor(protected service: PerfilTemaService) {
    super(service);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  insert(@Body() dto: PerfilTemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Body() dto: PerfilTemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  patch(@Body() dto: PerfilTemaDto, @Res() response) {
    return this.save(dto, response);
  }
}
