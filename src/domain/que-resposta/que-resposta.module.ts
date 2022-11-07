import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueResposta } from './que-respostas.entity';
import { QueRespostaController } from './que-resposta.controller';
import { QueRespostaService } from './que-resposta.service';

@Module({
  imports: [TypeOrmModule.forFeature([QueResposta])],
  controllers: [QueRespostaController],
  providers: [QueRespostaService],
  exports: [QueRespostaService],
})
export class QueRespostaModule {}
