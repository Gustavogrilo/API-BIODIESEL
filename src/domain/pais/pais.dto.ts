import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class PaisDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsString()
  @Length(2, 3)
  sigla: string;
}
