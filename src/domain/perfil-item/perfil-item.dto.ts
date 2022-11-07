import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class PerfilItemDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  valor: string;

  @ApiProperty()
  @IsPositive()
  perfil_subtema_id: number;

  @ApiProperty({ type: 'PerfilSubtema' })
  perfil_subtema?;

  @ApiProperty({ type: 'PerfilResposta' })
  perfil_respostas?;
}
