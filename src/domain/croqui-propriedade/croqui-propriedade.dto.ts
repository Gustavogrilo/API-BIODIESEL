import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class CroquiPropriedadeDto extends CoreDto {
  @ApiProperty()
  @IsPositive()
  propriedade_id: number;

  @ApiProperty()
  @IsPositive()
  safra_id: number;

  @ApiProperty()
  @IsPositive()
  anexo_id: number;

  @ApiProperty({ type: 'Propriedade' })
  propriedade;

  @ApiProperty({ type: 'Safra' })
  safra;

  @ApiProperty({ type: 'Anexo' })
  anexo;
}
