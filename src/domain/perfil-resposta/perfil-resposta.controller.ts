import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PerfilRespostaService } from './perfil-resposta.service';
import { PerfilRespostaDto } from './perfil-resposta.dto';

@Controller('perfil-resposta')
export class PerfilRespostaController extends CoreController<
  PerfilRespostaService
> {
  constructor(protected service: PerfilRespostaService) {
    super(service);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: PerfilRespostaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: PerfilRespostaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: PerfilRespostaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Get('view')
  @UseGuards(JwtAuthGuard)
  indexView(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .findAllView(params)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }
}
