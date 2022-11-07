import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class FilialDto extends CoreDto{
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsPositive()
  cliente_id: number;

  @ApiProperty()
  @IsPositive()
  municipio_id: number;

  @ApiProperty({type: 'Cliente'})
  cliente;

  @ApiProperty({type: 'Municipio'})
  municipio;
}
