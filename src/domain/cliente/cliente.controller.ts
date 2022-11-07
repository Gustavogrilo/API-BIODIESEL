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
import { ClienteService } from 'src/domain/cliente/cliente.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ClienteDto } from 'src/domain/cliente/cliente.dto';

@Controller('cliente')
export class ClienteController extends CoreController<ClienteService> {
  constructor(protected service: ClienteService) {
    super(service);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  insert(@Body() dto: ClienteDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Body() dto: ClienteDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: ClienteDto, @Res() response) {
    return this.save(dto, response);
  }
}
