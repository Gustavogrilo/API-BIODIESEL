import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Questionario } from './questionario.entity';
import { QuestionarioService } from './questionario.service';
import { QuestionarioController } from './questionario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Questionario])],
  providers: [QuestionarioService],
  controllers: [QuestionarioController],
})
export class QuestionarioModule {}
