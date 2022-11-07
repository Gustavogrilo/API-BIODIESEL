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
import { ApiQuery } from '@nestjs/swagger';

import { CoreController } from 'src/core';
import { PessoaService } from './pessoa.service';
import { PessoaDto } from './pessoa.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('pessoa')
export class PessoaController extends CoreController<PessoaService> {
  constructor(protected service: PessoaService) {
    super(service);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  index(@Res() response, @Query() query?) {
    return this.findAll(response, query);
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  count(@Res() response, @Query() query?) {
    return this.service
      .getProdutorContagem(query)
      .then(res =>
        response.status(200).send({ contagem: Object.values(res)[0] }),
      )
      .catch(e => response.status(500).send(e.message));
  }

  // contagem dos indicadores
  @Get('count-indicador')
  @UseGuards(JwtAuthGuard)
  countIndicador(@Res() response, @Query() query?) {
    return this.service
      .getProdutorContagemIndicador(query)
      .then(res =>
        response.status(200).send({ contagem: Object.values(res)[0] }),
      )
      .catch(e => response.status(500).send(e.message));
  }

  @Get('produtor-por-estado')
  @UseGuards(JwtAuthGuard)
  getProdutorPorEstado(@Res() response, @Query() query?) {
    return this.service
      .getProdutorPorEstado(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get('ranking-municipio-com-mais-produtores-atendidos')
  @UseGuards(JwtAuthGuard)
  getRankingMunicipioComMaisProdutoresAtendidos(
    @Res() response,
    @Query() query?,
  ) {
    return this.service
      .getRankingMunicipioComMaisProdutoresAtendidos(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: PessoaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: PessoaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: PessoaDto, @Res() response) {
    return this.save(dto, response);
  }
}
