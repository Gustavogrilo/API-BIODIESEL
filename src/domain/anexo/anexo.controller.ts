import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AnexoService } from './anexo.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AnexoDto } from './anexo.dto';

@Controller('anexo')
export class AnexoController {
  constructor(protected service: AnexoService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  index(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .findAll(params)
      .then(res => response.status(200).send(res))
      .catch(e => response.status(500).send(e.message));
  }

  @Get(':id')
  show(@Param() params, @Res() response) {
    return this.service
      .findById(params.id)
      .then(anexo => {
        anexo.arquivo = Buffer.from(anexo.arquivo).toString('base64');

        return response.status(200).send(anexo);
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Get(':id/download')
  download(@Param() params, @Res() response) {
    return this.service
      .findById(params.id)
      .then(anexo => {
        response.header('content-type', anexo.tipo);
        response.header('content-length', Buffer.byteLength(anexo.arquivo));
        response.header(
          'Content-Disposiion',
          `attachment; filename="${anexo.nome}"`,
        );

        return response.status(200).send(anexo.arquivo);
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  save(@Body() dto: AnexoDto, @Res() response) {
    return this.service
      .save(dto)
      .then(res => {
        delete res.arquivo;

        response.status(201).send(res);
      })
      .catch(e => response.status(500).send(e.message));
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('anexo'))
  upload(@Body() dto, @Res() response, @UploadedFile() file) {
    if (file) {
      return this.service
        .upload(file)
        .then(res => {
          delete res.arquivo;

          response.status(201).send(res);
        })
        .catch(e => response.status(500).send(e.message));
    } else {
      throw new BadRequestException();
    }
  }
}
