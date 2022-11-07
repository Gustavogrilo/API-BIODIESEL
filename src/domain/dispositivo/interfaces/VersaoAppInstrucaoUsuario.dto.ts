import { ApiProperty } from '@nestjs/swagger';

import {
  IsDateString,
  IsObject,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class VersaoAppInstrucaoUsuarioDto {
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  versao_app_instrucao_id?: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  usuario_id?: number;

  @ApiProperty()
  @IsDateString()
  executado_em?: Date | null;

  @ApiProperty({ type: 'Usuario' })
  @IsObject()
  @IsOptional()
  usuario?;

  @ApiProperty({ type: 'VersaoAppInstrucaoDto' })
  @IsObject()
  @IsOptional()
  instrucao?;

  constructor(init?: Partial<VersaoAppInstrucaoUsuarioDto>) {
    Object.assign(this, init);
  }
}
