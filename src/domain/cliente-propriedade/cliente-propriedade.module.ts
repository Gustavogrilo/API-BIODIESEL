import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientePropriedade } from './cliente-propriedade.entity';
import { ClientePropriedadeController } from './cliente-propriedade.controller';
import { ClientePropriedadeService } from './cliente-propriedade.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientePropriedade])],
  controllers: [ClientePropriedadeController],
  providers: [ClientePropriedadeService],
})
export class ClientePropriedadeModule {}
