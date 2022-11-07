import { ApiProperty } from '@nestjs/swagger';

import {
  IsDateString,
  IsIn,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class DispositivoDto extends CoreDto {
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  versao_app_id?: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  cliente_id?: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  usuario_id?: number;

  @ApiProperty({ type: "'PHONE' | 'TABLET'" })
  @IsIn(['PHONE', 'TABLET'])
  tipo?: 'PHONE' | 'TABLET';

  @ApiProperty()
  @IsString()
  @MaxLength(90)
  modelo?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  imei?: string;

  @ApiProperty({ type: "'ANDROID' | 'IOS'" })
  @IsIn(['ANDROID', 'IOS'])
  sistema?: 'ANDROID' | 'IOS';

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  versao_sistema?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  versao_sdk?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  resolucao?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  escala_resolucao?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  data_ultima_atualizacao_app?: Date | null;

  @ApiProperty({ type: 'Cliente' })
  @IsObject()
  @IsOptional()
  cliente?;

  @ApiProperty({ type: 'Usuario' })
  @IsObject()
  @IsOptional()
  usuario?;

  @ApiProperty({ type: 'VersaoApp' })
  @IsObject()
  @IsOptional()
  versao_app?;

  constructor(init?: Partial<DispositivoDto>) {
    super();
    Object.assign(this, init);
  }
}
