import { ApiProperty } from '@nestjs/swagger';
import {
  IsPositive,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class EstadoDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsString()
  @Length(2, 3)
  sigla: string;

  @ApiProperty()
  @IsPositive()
  pais_id: string;

  @ApiProperty({ type: 'Pais' })
  pais;
}
