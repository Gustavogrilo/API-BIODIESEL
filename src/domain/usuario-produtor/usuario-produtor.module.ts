import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioProdutorService } from './usuario-produtor.service';
import { UsuarioProdutorController } from './usuario-produtor.controller';
import { UsuarioProdutor } from './usuario-produtor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioProdutor])],
  providers: [UsuarioProdutorService],
  controllers: [UsuarioProdutorController],
})
export class UsuarioProdutorModule {}
