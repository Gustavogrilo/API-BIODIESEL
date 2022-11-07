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
import { InsumoService } from './insumo.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InsumoDto } from './insumo.dto';

@Controller('insumo')
export class InsumoController extends CoreController<InsumoService> {
  constructor(protected service: InsumoService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: InsumoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: InsumoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: InsumoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Get('mais-utilizados')
  insumosMaisUtilizados(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .insumosMaisUtilizados(params)
      .then((res) => response.status(200).send(res))
      .catch((e) => response.status(500).send(e.message));
  }
}
