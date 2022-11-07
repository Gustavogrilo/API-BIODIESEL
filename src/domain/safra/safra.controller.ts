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
import { SafraService } from 'src/domain/safra/safra.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SafraDto } from './safra.dto';

@Controller('safra')
export class SafraController extends CoreController<SafraService> {
  constructor(protected service: SafraService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: SafraDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: SafraDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: SafraDto, @Res() response) {
    return this.save(dto, response);
  }
}
