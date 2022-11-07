import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Filial } from './filial.entity';
import { FilialController } from './filial.controller';
import { FilialService } from './filial.service';

@Module({
  imports: [TypeOrmModule.forFeature([Filial])],
  controllers: [FilialController],
  providers: [FilialService],
  exports: [FilialService],
})
export class FilialModule {}
