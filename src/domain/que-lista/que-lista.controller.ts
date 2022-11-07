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
import { QueListaService } from './que-lista.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueListaDto } from './que-lista.dto';

@Controller('que-lista')
export class QueListaController extends CoreController<QueListaService> {
  constructor(protected service: QueListaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueListaDto, @Res() response) {
    return this.save(dto, response);
  }
}
