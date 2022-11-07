import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CoreController } from 'src/core';
import { AtendimentoService } from './atendimento.service';

@Controller('atendimento')
export class AtendimentoController extends CoreController<AtendimentoService> {
  constructor(protected service: AtendimentoService) {
    super(service);
  }

  @Get('perguntas')
  @UseGuards(JwtAuthGuard)
  respostas(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .findAllAnswers(params)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }
}
