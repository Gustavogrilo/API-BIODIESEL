import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class InsumoDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsIn(['KG', 'LT'])
  unidade_medida: string;

  @ApiProperty()
  @IsPositive()
  tipo_id: number;

  @ApiProperty({ type: 'InsumoTipo' })
  tipo;
}
