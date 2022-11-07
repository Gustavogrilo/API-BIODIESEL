import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilItem } from './perfil-item.entity';
import { PerfilItemService } from './perfil-item.service';
import { PerfilItemController } from './perfil-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilItem])],
  providers: [PerfilItemService],
  controllers: [PerfilItemController],
})
export class PerfilItemModule {}
