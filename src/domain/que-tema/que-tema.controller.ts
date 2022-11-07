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
import { QueTemaService } from 'src/domain/que-tema/que-tema.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueTemaDto } from './que-tema.dto';

@Controller('que-tema')
export class QueTemaController extends CoreController<QueTemaService> {
  constructor(protected service: QueTemaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueTemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueTemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueTemaDto, @Res() response) {
    return this.save(dto, response);
  }
}
