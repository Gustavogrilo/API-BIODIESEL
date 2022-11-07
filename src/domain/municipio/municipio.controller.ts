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

import { MunicipioService } from './municipio.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MunicipioDto } from './municipio.dto';

@Controller('municipio')
export class MunicipioController extends CoreController<MunicipioService> {
  constructor(protected service: MunicipioService) {
    super(service);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  insert(@Body() dto: MunicipioDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Body() dto: MunicipioDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  patch(@Body() dto: MunicipioDto, @Res() response) {
    return this.save(dto, response);
  }
}
