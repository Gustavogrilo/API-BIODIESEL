import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

enum Tipo {
  QUANTITATIVO = 'QUANTITATIVO',
  QUALITATIVO = 'QUALITATIVO',
}

export class PerfilSubtemaDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  nome: string;

  @ApiProperty()
  @IsEnum(Tipo)
  tipo: 'QUANTITATIVO' | 'QUALITATIVO';

  @ApiProperty()
  @IsPositive()
  ordem?: number;

  @ApiProperty()
  @IsPositive()
  perfil_tema_id: number;

  @ApiProperty({ type: 'PerfilItem' })
  perfil_itens?;

  @ApiProperty({ type: 'PerfilResposta' })
  perfil_respostas?;

  @ApiProperty({ type: 'PerfilTemaEntity' })
  perfil_tema?;
}
