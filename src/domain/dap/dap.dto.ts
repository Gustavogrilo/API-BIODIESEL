import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class DapDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(25)
  id: string;

  @ApiProperty()
  @IsPositive()
  propriedade_id: number;

  @ApiProperty({type: 'Propriedade'})
  propriedade;
}
