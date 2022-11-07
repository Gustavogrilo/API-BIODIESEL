import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueSubtemaPerguntaController } from './que-subtema-pergunta.controller';
import { QueSubtemaPerguntaService } from './que-subtema-pergunta.service';
import { QueSubtemaPergunta } from './que-subtema-pergunta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueSubtemaPergunta])],
  controllers: [QueSubtemaPerguntaController],
  providers: [QueSubtemaPerguntaService],
})
export class QueSubtemaPerguntaModule {}
