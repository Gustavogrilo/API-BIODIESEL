import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class InsumoTipoDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty({ type: 'Insumo[]' })
  insumos;
}
