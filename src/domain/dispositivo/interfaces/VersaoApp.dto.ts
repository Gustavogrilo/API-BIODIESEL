import { ApiProperty } from '@nestjs/swagger';

import {
  IsDateString,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class VersaoAppDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(90)
  nome?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  descricao?: string | null;

  @ApiProperty()
  @IsString()
  link_apk?: string;

  @ApiProperty()
  data_lancamento?: string;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  criado_por?: number | null;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  atualizado_por?: number | null;

  @ApiProperty({ type: 'Dispositivo[]' })
  @IsObject()
  @IsOptional()
  dispositivos?: any[];

  @ApiProperty({ type: 'Usuario' })
  @IsObject()
  @IsOptional()
  criado_por_usuario?;

  @ApiProperty({ type: 'Usuario' })
  @IsObject()
  @IsOptional()
  atualizado_por_usuario?;

  @ApiProperty({ type: 'VersaoAppInstrucao[]' })
  @IsObject()
  @IsOptional()
  instrucoes_sql?: any[];

  constructor(init?: Partial<VersaoAppDto>) {
    super();
    Object.assign(this, init);
  }
}
