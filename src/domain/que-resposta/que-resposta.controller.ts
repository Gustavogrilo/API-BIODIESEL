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
import { QueRespostaService } from './que-resposta.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueRespostaDto } from './que-resposta.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('que-resposta')
export class QueRespostaController extends CoreController<QueRespostaService> {
  constructor(protected service: QueRespostaService) {
    super(service);
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'tema_id', type: 'number', required: false })
  count(@Res() response, @Query() query?) {
    return this.service.getContagem(query)
      .then(res => {
        response.status(200).send({ contagem: res });
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QueRespostaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QueRespostaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QueRespostaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Get('indicadores-qualitativos')
  @UseGuards(JwtAuthGuard)
  indicadoresQualitativos(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .getIndicadoresQualitativos(params)
      .then((res) => response.status(200).send(res))
      .catch((e) => response.status(500).send(e.message));
  }

  @Get('maiores-problemas')
  @UseGuards(JwtAuthGuard)
  maioresProblemas(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .getMaioresProblemas(params)
      .then((res) => response.status(200).send(res))
      .catch((e) => response.status(500).send(e.message));
  }
}
