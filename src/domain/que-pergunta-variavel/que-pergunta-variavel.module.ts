import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuePerguntaVariavel } from 'src/domain/que-pergunta-variavel/que-pergunta-variavel.entity';
import { QuePerguntaVariavelController } from './que-pergunta-variavel.controller';
import { QuePerguntaVariavelService } from './que-pergunta-variavel.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuePerguntaVariavel])],
  controllers: [QuePerguntaVariavelController],
  providers: [QuePerguntaVariavelService],
})
export class QuePerguntaVariavelModule {}
