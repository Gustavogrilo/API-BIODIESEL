import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class QueSubtemaDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsPositive()
  cliente_id: number;

  @ApiProperty({ type: 'QuePergunta[]' })
  perguntas;
}
