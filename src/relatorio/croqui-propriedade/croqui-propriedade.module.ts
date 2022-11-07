import { Module } from '@nestjs/common';

import { CroquiPropriedadeModule as CroquiPropriedadeEntityModule } from '../../domain/croqui-propriedade/croqui-propriedade.module';
import { RelatorioCroquiPropriedadeController } from './croqui-propriedade.controller';
import { RelatorioCroquiPropriedadeService } from './croqui-propriedade.service';

@Module({
  controllers: [RelatorioCroquiPropriedadeController],
  providers: [RelatorioCroquiPropriedadeService],
  imports: [CroquiPropriedadeEntityModule],
})
export class CroquiPropriedadeModule {}
