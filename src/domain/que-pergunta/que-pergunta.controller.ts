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
import { QuePerguntaService } from 'src/domain/que-pergunta/que-pergunta.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QuePerguntaDto } from './que-pergunta.dto';

@Controller('que-pergunta')
export class QuePerguntaController extends CoreController<QuePerguntaService> {
  constructor(protected service: QuePerguntaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QuePerguntaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QuePerguntaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QuePerguntaDto, @Res() response) {
    return this.service.atualizar(dto, response);
  }
}
