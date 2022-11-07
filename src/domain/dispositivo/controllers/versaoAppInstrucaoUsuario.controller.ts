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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VersaoAppInstrucaoUsuarioService } from '../services/versaoAppInstrucaoUsuario.service';
import { VersaoAppInstrucaoUsuarioDto } from '../interfaces/VersaoAppInstrucaoUsuario.dto';

@Controller('versao-app-instrucao-usuario')
export class VersaoAppInstrucaoUsuarioController extends CoreController<
  VersaoAppInstrucaoUsuarioService
> {
  constructor(protected service: VersaoAppInstrucaoUsuarioService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: VersaoAppInstrucaoUsuarioDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: VersaoAppInstrucaoUsuarioDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: VersaoAppInstrucaoUsuarioDto, @Res() response) {
    return this.save(dto, response);
  }

  @UseGuards(JwtAuthGuard)
  @Put('concluir-instrucao/:idInstrucao/usuario/:idUsuario')
  salvarExecucao(
    @Param('idInstrucao') id_instrucao: number,
    @Param('idUsuario') id_usuario: number,
    @Res() response
  ) {
    return this.service
      .salvarExecucao(id_instrucao, id_usuario)
      .then((res) => {
        return res.affected
          ? response.status(204).send()
          : response.status(404).send();
      })
      .catch((e) => response.status(500).send(e.message));
  }

  @Delete('instrucao/:versao_app_instrucao_id/usuario/:usuario_id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params: VersaoAppInstrucaoUsuarioDto, @Res() response) {
    return this.service
      .deletarRelacao(params.versao_app_instrucao_id, params.usuario_id)
      .then(res => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch(e => response.status(500).send(e.message));
  }
}
