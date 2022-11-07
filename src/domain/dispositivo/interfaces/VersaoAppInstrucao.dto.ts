import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class VersaoAppInstrucaoDto extends CoreDto {
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  versao_app_id?: number;

  @ApiProperty()
  @IsString()
  instrucao?: string;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  criado_por?: number | null;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  atualizado_por?: number | null;

  @ApiProperty({ type: 'Usuario' })
  @IsObject()
  @IsOptional()
  criado_por_usuario?;

  @ApiProperty({ type: 'Usuario' })
  @IsObject()
  @IsOptional()
  atualizado_por_usuario?;

  @ApiProperty({ type: 'VersaoApp' })
  @IsObject()
  @IsOptional()
  versao_app?;

  @ApiProperty({ type: 'VersaoAppInstrucaoUsuario[]' })
  @IsArray()
  @IsOptional()
  usuarios?;

  constructor(init?: Partial<VersaoAppInstrucaoDto>) {
    super();
    Object.assign(this, init);
  }
}
