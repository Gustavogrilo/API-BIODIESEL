import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientePessoa } from './cliente-pessoa.entity';
import { ClientePessoaController } from './cliente-pessoa.controller';
import { ClientePessoaService } from './cliente-pessoa.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientePessoa])],
  controllers: [ClientePessoaController],
  providers: [ClientePessoaService],
})
export class ClientePessoaModule {}
