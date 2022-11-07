import { Module } from '@nestjs/common';
import { PlanilhaLaudosService } from './planilha-laudos.service';
import { PlanilhaLaudosController } from './planilha-laudos.controller';

@Module({
  controllers: [PlanilhaLaudosController],
  providers: [PlanilhaLaudosService]
})
export class PlanilhaLaudosModule {}
