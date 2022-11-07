import { Module } from '@nestjs/common';

import { ImagensSafraModule } from './imagens-safra/imagens-safra.module';
import { AcompanhamentoModule } from './acompanhamento/acompanhamento.module';
import { AcompanhamentoLaudo3Module } from './acompanhamento-laudo-3/acompanhamento-laudo-3.module';
import { PlanilhaLaudosModule } from './planilha-laudos/planilha-laudos.module';
import { RelatorioXTecnicoModule } from './relatorio-x-tecnico/relatorio-x-tecnico.module';
import { CroquiPropriedadeModule } from './croqui-propriedade/croqui-propriedade.module';

@Module({
  imports: [
    ImagensSafraModule,
    AcompanhamentoModule,
    AcompanhamentoLaudo3Module,
    PlanilhaLaudosModule,
    RelatorioXTecnicoModule,
    CroquiPropriedadeModule
  ],
  providers: [],
  controllers: [],
})
export class RelatorioModule {}
