import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilSubtema } from './perfil-subtema.entity';
import { PerfilSubtemaService } from './perfil-subtema.service';
import { PerfilSubtemaController } from './perfil-subtema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilSubtema])],
  providers: [PerfilSubtemaService],
  controllers: [PerfilSubtemaController],
})
export class PerfilSubtemaModule {}
