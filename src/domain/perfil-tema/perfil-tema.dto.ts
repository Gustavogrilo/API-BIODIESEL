import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class PerfilTemaDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  nome: string;

  @ApiProperty()
  @IsPositive()
  ordem?: number;

  @ApiProperty()
  @IsPositive()
  perfil_id: number;

  @ApiProperty({ type: 'PerfilSubtema' })
  perfil_subtemas?;

  @ApiProperty({ type: 'Perfil' })
  perfil?;
}
