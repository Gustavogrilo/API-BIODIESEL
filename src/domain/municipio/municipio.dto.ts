import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class MunicipioDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsString()
  @MinLength(9)
  cep: string;

  @ApiProperty()
  @IsPositive()
  estado_id: string;

  @ApiProperty({type: 'Estado'})
  estado;
}
