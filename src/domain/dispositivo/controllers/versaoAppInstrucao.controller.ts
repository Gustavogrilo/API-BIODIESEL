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
import { VersaoAppInstrucaoService } from '../services/versaoAppInstrucao.service';
import { VersaoAppInstrucaoDto } from '../interfaces/VersaoAppInstrucao.dto';

@Controller('versao-app-instrucao')
export class VersaoAppInstrucaoController extends CoreController<
  VersaoAppInstrucaoService
> {
  constructor(protected service: VersaoAppInstrucaoService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: VersaoAppInstrucaoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: VersaoAppInstrucaoDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: VersaoAppInstrucaoDto, @Res() response) {
    return this.save(dto, response);
  }
}
