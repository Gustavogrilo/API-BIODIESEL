import { Module } from '@nestjs/common';

import { ImagensSafraController } from './imagens-safra.controller';
import { ImagensSafraService } from './imagens-safra.service';

import { QueRespostaModule } from 'src/domain/que-resposta/que-resposta.module';
import { CroquiPropriedadeModule } from 'src/domain/croqui-propriedade/croqui-propriedade.module';

@Module({
  controllers: [ImagensSafraController],
  providers: [ImagensSafraService],
  imports: [QueRespostaModule, CroquiPropriedadeModule],
})
export class ImagensSafraModule {}
