import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtendimentoController } from './atendimento.controller';
import { Atendimento } from './entities/atendimento.entity';
import { AtendimentoService } from './atendimento.service';

@Module({
  imports: [TypeOrmModule.forFeature([Atendimento])],
  providers: [AtendimentoService],
  controllers: [AtendimentoController],
})
export class AtendimentoModule {}
