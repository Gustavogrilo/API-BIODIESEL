import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InsumoTipo } from './insumo-tipo.entity';
import { InsumoTipoController } from './insumo-tipo.controller';
import { InsumoTipoService } from './insumo-tipo.service';

@Module({
  imports: [TypeOrmModule.forFeature([InsumoTipo])],
  controllers: [InsumoTipoController],
  providers: [InsumoTipoService],
})
export class InsumoTipoModule {}
