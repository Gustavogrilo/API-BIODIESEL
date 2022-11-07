import {
  Body,
  Controller, Get, Param,
  Patch,
  Post,
  Put, Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { QuestionarioService } from 'src/domain/questionario/questionario.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QuestionarioDto } from './questionario.dto';

@Controller('questionario')
export class QuestionarioController extends CoreController<QuestionarioService> {
  constructor(protected service: QuestionarioService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: QuestionarioDto, @Res() response) {
    return this.service.salvar(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: QuestionarioDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: QuestionarioDto, @Res() response) {
    return this.service.atualizar(dto, response);
  }

  @Get('resposta-e-pergunta-amostra-de-solo')
  @UseGuards(JwtAuthGuard)
  getRespostaEPerguntaAmostraDeSolo(@Res() response, @Query() query) {
    return this.service.getRespostaEPerguntaAmostraDeSoloPlotted(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get('resposta-e-pergunta-inoculacao-de-sementes')
  @UseGuards(JwtAuthGuard)
  getRespostaEPerguntaInoculacaoDeSementes(@Res() response, @Query() query) {
    return this.service.getRespostaEPerguntaInoculacaoDeSementesPlotted(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get('resposta-e-pergunta-adubacao')
  @UseGuards(JwtAuthGuard)
  getRespostaEPerguntaAdubacaoFoliar(@Res() response, @Query() query) {
    return this.service.getRespostaEPerguntaAdubacaoPlotted(query)
      .then(res => {
        response.status(200).send(res);
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Get('resposta-e-pergunta-uso-de-herbicida')
  @UseGuards(JwtAuthGuard)
  getRespostaEPerguntaUsodeHerbicidaPrePlantio(@Res() response, @Query() query) {
    return this.service.getRespostaEPerguntaUsodeHerbicidaPlotted(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get('resposta-e-pergunta-lavoura')
  @UseGuards(JwtAuthGuard)
  getRespostaEPerguntaLavouraApresentaDaninha(@Res() response, @Query() query) {
    return this.service.getRespostaEPerguntaLavouraPlotted(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get('resposta-e-pergunta-controle-de-doencas')
  @UseGuards(JwtAuthGuard)
  getRespostaEPerguntaControleDeDoencas(@Res() response, @Query() query) {
    return this.service.getRespostaEPerguntaControleDeDoencasPlotted2D(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get('resposta-e-pergunta-car')
  @UseGuards(JwtAuthGuard)
  getRespostaEPerguntaCAR(@Res() response, @Query() query) {
    return this.service.getRespostaEPerguntaCARPlotted(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  show(@Param() params, @Res() response) {
    return this.service
      .findById(params.id)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

}
