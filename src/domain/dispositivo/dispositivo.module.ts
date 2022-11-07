import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Dispositivo } from './entities/Dispositivo.entity';
import { VersaoApp } from './entities/VersaoApp.entity';
import { VersaoAppInstrucao } from './entities/VersaoAppInstrucao.entity';
import { VersaoAppInstrucaoUsuario } from './entities/VersaoAppInstrucaoUsuario.entity';

import { DispositivoController } from './controllers/dispositivo.controller';
import { VersaoAppController } from './controllers/versaoApp.controller';
import { VersaoAppInstrucaoController } from './controllers/versaoAppInstrucao.controller';
import { VersaoAppInstrucaoUsuarioController } from './controllers/versaoAppInstrucaoUsuario.controller';

import { DispositivoService } from './services/dispositivo.service';
import { VersaoAppService } from './services/versaoApp.service';
import { VersaoAppInstrucaoService } from './services/versaoAppInstrucao.service';
import { VersaoAppInstrucaoUsuarioService } from './services/versaoAppInstrucaoUsuario.service';

const services = [
  DispositivoService,
  VersaoAppService,
  VersaoAppInstrucaoService,
  VersaoAppInstrucaoUsuarioService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dispositivo,
      VersaoApp,
      VersaoAppInstrucao,
      VersaoAppInstrucaoUsuario,
    ]),
  ],
  controllers: [
    DispositivoController,
    VersaoAppController,
    VersaoAppInstrucaoController,
    VersaoAppInstrucaoUsuarioController,
  ],
  providers: [...services],
  exports: [...services],
})
export class DispositivoModule {}
