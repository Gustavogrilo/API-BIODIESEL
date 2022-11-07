import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class QueDiagnosticoDto extends CoreDto {
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  propriedade_id: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  consultor_id: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  questionario_id: number;

  @ApiProperty({ type: 'Propriedade' })
  propriedade;

  @ApiProperty({ type: 'Consultor' })
  consultor;

  @ApiProperty({ type: 'Questionario' })
  questionario;

  @ApiProperty({ type: 'QueResposta[]' })
  respostas;
}
