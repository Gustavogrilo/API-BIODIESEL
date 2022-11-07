import {
  Body,
  Controller,
  Patch,
  Post,
  Put,
  Res, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { PaisDto } from './pais.dto';
import { PaisService } from 'src/domain/pais/pais.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('pais')
export class PaisController extends CoreController<PaisService> {
  constructor(protected service: PaisService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: PaisDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: PaisDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: PaisDto, @Res() response) {
    return this.save(dto, response);
  }
}
