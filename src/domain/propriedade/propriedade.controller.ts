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
import { PropriedadeService } from 'src/domain/propriedade/propriedade.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PropriedadeDto } from './propriedade.dto';

@Controller('propriedade')
export class PropriedadeController extends CoreController<PropriedadeService> {
  constructor(protected service: PropriedadeService) {
    super(service);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'filial_id', type: 'number', required: false })
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  index(@Res() response, @Query() query?) {
    return this.findAll(response, query);
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  count(@Res() response, @Query() query?) {
    return this.service
      .getContagem(query)
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

  @Get('media-hectare-por-estado')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  getMediaHectarePorEstado(@Res() response, @Query() query?) {
    return this.service
      .getMediaHectarePorEstado(query)
      .then(res => {
        for (let i = 0; i < res.length; i++) {
          if (!res[i].value) {
            res[i].value = 0;
          }
        }
        response.status(200).send(res);
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Get('propriedade-area-contratada-por-estado')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  getPropriedadeAreaContadaPorEstado(@Res() response, @Query() query?) {
    return this.service
      .getPropriedadeAreaContadaPorEstadoPlotted(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get('comparativo-insumo-com-quantidade-de-produtores')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  getComparativoDeInsumoComQuantidadeDeProdutores(
    @Res() response,
    @Query() query?,
  ) {
    return this.service
      .getComparativoDeInsumoComQuantidadeDeProdutoresPlotted(query)
      .then(res => {
        for (let i = 0; i < res.length; i++) {
          if (!res[i].value) {
            res[i].value = 0;
          }
        }
        response.status(200).send(res);
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Get('mapa')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'cliente_id', type: 'number', required: false })
  listaMapa(@Res() response, @Query() query?) {
    return this.service
      .listaMapa(query)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: PropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: PropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: PropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }
}
