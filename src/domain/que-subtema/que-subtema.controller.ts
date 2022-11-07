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
import { QueSubtemaService } from './que-subtema.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueSubtemaDto } from './que-subtema.dto';

@Controller('que-subtema')
export class QueSubtemaController extends CoreController<QueSubtemaService> {
  constructor(protected service: QueSubtemaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueSubtemaDto, @Res() response) {
    return this.save(dto, response);
  }
}
