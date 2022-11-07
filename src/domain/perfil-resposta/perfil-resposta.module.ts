import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilResposta } from './perfil-resposta.entity';
import { PerfilRespostaService } from './perfil-resposta.service';
import { PerfilRespostaController } from './perfil-resposta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilResposta])],
  providers: [PerfilRespostaService],
  controllers: [PerfilRespostaController],
})
export class PerfilRespostaModule {}
