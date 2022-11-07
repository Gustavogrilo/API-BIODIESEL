import { Module } from '@nestjs/common';

import { AcompanhamentoLaudo3Service } from './acompanhamento-laudo-3.service';
import { AcompanhamentoLaudo3Controller } from './acompanhamento-laudo-3.controller';
import { QueDiagnosticoModule } from '../../domain/que-diagnostico/que-diagnostico.module';
import { DispositivoModule } from '../../domain/dispositivo/dispositivo.module';

@Module({
  controllers: [AcompanhamentoLaudo3Controller],
  providers: [AcompanhamentoLaudo3Service],
  imports: [QueDiagnosticoModule, DispositivoModule],
})
export class AcompanhamentoLaudo3Module {}
