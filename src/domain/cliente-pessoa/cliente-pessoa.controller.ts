import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { ClientePessoaService } from 'src/domain/cliente-pessoa/cliente-pessoa.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ClientePessoaDto } from 'src/domain/cliente-pessoa/cliente-pessoa.dto';

@Controller('cliente-pessoa')
export class ClientePessoaController extends CoreController<
  ClientePessoaService
> {
  constructor(protected service: ClientePessoaService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: ClientePessoaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: ClientePessoaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: ClientePessoaDto, @Res() response) {
    return this.save(dto, response);
  }

  @Delete('cliente/:cliente_id/produtor/:pessoa_id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: ClientePessoaDto, @Res() response) {
    return this.service
      .deletarRelacao(params.cliente_id, params.pessoa_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
