import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, MaxLength } from 'class-validator';

import { CoreDto } from '../../core/core.dto';

export class PerfilDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  nome: string;

  @ApiProperty()
  @IsString()
  @MaxLength(90)
  @IsOptional()
  icone_web: string;

  @ApiProperty()
  @IsString()
  @MaxLength(90)
  @IsOptional()
  icone_mobile: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  @IsOptional()
  cor_hex: string;

  @ApiProperty()
  exibir_na_home: boolean;

  @ApiProperty({ type: 'PerfilTema' })
  perfil_temas?;
}
