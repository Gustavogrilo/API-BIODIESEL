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
import { EstadoService } from './estado.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EstadoDto } from './estado.dto';

@Controller('estado')
export class EstadoController extends CoreController<EstadoService> {
  constructor(protected service: EstadoService) {
    super(service);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  insert(@Body() dto: EstadoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Body() dto: EstadoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  patch(@Body() dto: EstadoDto, @Res() response) {
    return this.save(dto, response);
  }
}
