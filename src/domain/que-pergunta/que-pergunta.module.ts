import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuePergunta } from './que-pergunta.entity';
import { QuePerguntaService } from './que-pergunta.service';
import { QuePerguntaController } from './que-pergunta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuePergunta])],
  providers: [QuePerguntaService],
  controllers: [QuePerguntaController],
})
export class QuePerguntaModule {}
