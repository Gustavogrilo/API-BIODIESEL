import {
  Body,
  Controller,
  Get,
  Param,
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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PerfilService } from './perfil.service';
import { PerfilDto } from './perfil.dto';
import { PerfilRespostaDto } from '../perfil-resposta/perfil-resposta.dto';

@Controller('perfil')
export class PerfilController extends CoreController<PerfilService> {
  constructor(protected service: PerfilService) {
    super(service);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  insert(@Body() dto: PerfilDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Body() dto: PerfilDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  patch(@Body() dto: PerfilDto, @Res() response) {
    return this.save(dto, response);
  }

  @Get(':id/respostas')
  @UseGuards(JwtAuthGuard)
  respostasDoPerfil(
    @Body() dto: PerfilRespostaDto,
    @Res() response,
    @Param() params,
    @Query() query?,
  ) {
    return this.service
      .respostasDoPerfil(params.id, query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }
}
