import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilTema } from './perfil-tema.entity';
import { PerfilTemaService } from './perfil-tema.service';
import { PerfilTemaController } from './perfil-tema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilTema])],
  providers: [PerfilTemaService],
  controllers: [PerfilTemaController],
})
export class PerfilTemaModule {}
