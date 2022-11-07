import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioClienteService } from './usuario-cliente.service';
import { UsuarioClienteController } from './usuario-cliente.controller';
import { UsuarioCliente } from './usuario-cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioCliente])],
  providers: [UsuarioClienteService],
  controllers: [UsuarioClienteController],
})
export class UsuarioClienteModule {}
