import { Controller } from '@nestjs/common';
import { CoreController } from 'src/core';
import { CroquiCoordenadaService } from './croqui-coordenada.service';
  
  @Controller('croqui-coordenada')
  export class CroquiCoordenadaController extends CoreController<CroquiCoordenadaService> {
    constructor(protected service: CroquiCoordenadaService) {
      super(service);
    }
  }
  