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
import { QueItemListaService } from './que-item-lista.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueItemListaDto } from './que-item-lista.dto';

@Controller('que-item-lista')
export class QueItemListaController extends CoreController<
  QueItemListaService
> {
  constructor(protected service: QueItemListaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueItemListaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Get('pragas')
  GetInsumos(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));
    return this.service
      .getPragas(params)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }
}
