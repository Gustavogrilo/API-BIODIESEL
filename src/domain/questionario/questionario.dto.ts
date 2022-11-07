import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class QuestionarioDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsPositive()
  safra_id: number;

  @ApiProperty()
  @IsPositive()
  cliente_id: number;

  @ApiProperty({ type: 'Safra' })
  safra;

  @ApiProperty({ type: 'Cliente' })
  cliente;

  @ApiProperty({ type: 'QueTema[]' })
  temas;
}
