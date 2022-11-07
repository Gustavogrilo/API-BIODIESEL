import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class AnexoDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(254)
  nome: string;

  @ApiProperty()
  @IsString()
  @MaxLength(45)
  tipo: string;

  @ApiProperty()
  tamanho: number;

  @ApiProperty({ type: 'Buffer' })
  @IsBase64()
  arquivo;

  @ApiProperty({ type: 'CroquiPropriedade' })
  croquiPropriedade;
}
