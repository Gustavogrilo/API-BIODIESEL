import { Module } from '@nestjs/common';

import { AcompanhamentoController } from './acompanhamento.controller';
import { AcompanhamentoService } from './acompanhamento.service';

import { EstadoModule } from 'src/domain/estado/estado.module';
import { FilialModule } from 'src/domain/filial/filial.module';
import { DispositivoModule } from './../../domain/dispositivo/dispositivo.module';

@Module({
  controllers: [AcompanhamentoController],
  providers: [AcompanhamentoService],
  imports: [DispositivoModule, EstadoModule, FilialModule],
})
export class AcompanhamentoModule {}
