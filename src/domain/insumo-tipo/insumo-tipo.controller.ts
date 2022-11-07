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
import { InsumoTipoService } from './insumo-tipo.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InsumoTipoDto } from './insumo-tipo.dto';

@Controller('insumo-tipo')
export class InsumoTipoController extends CoreController<InsumoTipoService> {
  constructor(protected service: InsumoTipoService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: InsumoTipoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: InsumoTipoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: InsumoTipoDto, @Res() response) {
    return this.save(dto, response);
  }
}
