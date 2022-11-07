import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueDiagnostico } from './que-diagnostico.entity';
import { QueDiagnosticoController } from './que-diagnostico.controller';
import { QueDiagnosticoService } from './que-diagnostico.service';

@Module({
  imports: [TypeOrmModule.forFeature([QueDiagnostico])],
  controllers: [QueDiagnosticoController],
  providers: [QueDiagnosticoService],
  exports: [QueDiagnosticoService],
})
export class QueDiagnosticoModule {}
