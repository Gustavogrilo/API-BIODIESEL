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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PerfilItemService } from './perfil-item.service';
import { PerfilItemDto } from './perfil-item.dto';

@Controller('perfil-item')
export class PerfilItemController extends CoreController<PerfilItemService> {
  constructor(protected service: PerfilItemService) {
    super(service);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  insert(@Body() dto: PerfilItemDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Body() dto: PerfilItemDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  patch(@Body() dto: PerfilItemDto, @Res() response) {
    return this.save(dto, response);
  }
}
