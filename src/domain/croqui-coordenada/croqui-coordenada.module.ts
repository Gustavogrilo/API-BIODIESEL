import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CroquiCoordenada } from './croqui-coordenada.entity';
import { CroquiCoordenadaController } from './croqui-coordenada.controller';
import { CroquiCoordenadaService } from './croqui-coordenada.service';

@Module({
  imports: [TypeOrmModule.forFeature([CroquiCoordenada])],
  controllers: [CroquiCoordenadaController],
  providers: [CroquiCoordenadaService],
  exports: [CroquiCoordenadaService],
})
export class CroquiCoordenadaModule {}
