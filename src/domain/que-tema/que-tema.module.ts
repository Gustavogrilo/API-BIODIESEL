import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueTema } from './que-tema.entity';
import { QueTemaService } from './que-tema.service';
import { QueTemaController } from './que-tema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QueTema])],
  providers: [QueTemaService],
  controllers: [QueTemaController],
})
export class QueTemaModule {}
