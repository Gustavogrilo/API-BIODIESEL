import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionarioTema } from './questionario-tema.entity';
import { QuestionarioTemaService } from './questionario-tema.service';
import { QuestionarioTemaController } from './questionario-tema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionarioTema])],
  providers: [QuestionarioTemaService],
  controllers: [QuestionarioTemaController],
})
export class QuestionarioTemaModule {}
