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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DispositivoService } from '../services/dispositivo.service';
import { DispositivoDto } from '../interfaces/Dispositivo.dto';

@Controller('dispositivo')
export class DispositivoController extends CoreController<DispositivoService> {
  constructor(protected service: DispositivoService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: DispositivoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: DispositivoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: DispositivoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Get('ultimas-sincronizacoes')
  protected ultimasSincronizacoes(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .getUltimasSincronizacoes(params)
      .then((res) => response.status(200).send(res))
      .catch((e) => response.status(500).send(e.message));
  }
}
