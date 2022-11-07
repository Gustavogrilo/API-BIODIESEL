import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pais } from './pais.entity';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pais])],
  providers: [PaisService],
  controllers: [PaisController],
})
export class PaisModule {}
