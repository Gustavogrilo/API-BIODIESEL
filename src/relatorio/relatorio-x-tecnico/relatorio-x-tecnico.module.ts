import { Module } from '@nestjs/common';
import { RelatorioXTecnicoController } from './relatorio-x-tecnico.controller';
import { RelatorioXTecnicoService } from './relatorio-x-tecnico.service';
import { EstadoModule } from '../../domain/estado/estado.module';
import { FilialModule } from '../../domain/filial/filial.module';

@Module({  controllers: [RelatorioXTecnicoController],
  providers: [RelatorioXTecnicoService],
  imports: [EstadoModule, FilialModule],
})
export class RelatorioXTecnicoModule {}
