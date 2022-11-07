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
import { PerfilSubtemaService } from './perfil-subtema.service';
import { PerfilSubtemaDto } from './perfil-subtema.dto';

@Controller('perfil-subtema')
export class PerfilSubtemaController extends CoreController<
  PerfilSubtemaService
> {
  constructor(protected service: PerfilSubtemaService) {
    super(service);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  insert(@Body() dto: PerfilSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Body() dto: PerfilSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  patch(@Body() dto: PerfilSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }
}
