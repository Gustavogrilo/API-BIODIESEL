import {
  Body,
  Controller,
  Get,
  Param,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CroquiPropriedadeService } from './croqui-propriedade.service';
import { CroquiPropriedadeDto } from './croqui-propriedade.dto';

@Controller('croqui-propriedade')
export class CroquiPropriedadeController extends CoreController<
  CroquiPropriedadeService
> {
  constructor(protected service: CroquiPropriedadeService) {
    super(service);
  }

  @Get('geoJson')
  @UseGuards(JwtAuthGuard)  
  findAllGeoJson(@Res() response, @Query() query?) {
    return this.service.findAllGeoJson(query)
    .then(res => response.status(200).send(res))
    .catch(e => response.status(500).send(e.message));

  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: CroquiPropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: CroquiPropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: CroquiPropriedadeDto, @Res() response) {
    return this.save(dto, response);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  show(@Param() params, @Res() response) {
    return this.service
      .findById(params.id)
      .then(res => {
        delete res.anexo?.arquivo;

        response.status(200).send(res);
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Get(':id/download')
  download(@Param() params, @Res() response) {
    return this.service
      .findById(params.id)
      .then(croqui => {
        console.log(croqui.anexo?.tipo);
        response.header('content-type', croqui.anexo?.tipo);
        response.header(
          'content-length',
          Buffer.byteLength(croqui.anexo?.arquivo),
        );
        response.header(
          'Content-Disposiion',
          `attachment; filename="${croqui.anexo?.nome}"`,
        );

        return response.status(200).send(croqui.anexo?.arquivo);
      })
      .catch(e => response.status(500).send(e.message));
  }
}
