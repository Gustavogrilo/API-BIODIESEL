import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsPositive } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class PerfilRespostaDto extends CoreDto {
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  resultado_qualitativo: number | null;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  resultado_quantitativo: string | null;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  perfil_subtema_id: number;

  @ApiProperty()
  @IsPositive()
  cliente_id: number;

  @ApiProperty()
  @IsPositive()
  safra_id: number;

  @ApiProperty()
  @IsPositive()
  consultor_id: number;

  @ApiProperty()
  @IsPositive()
  propriedade_id: number;

  @ApiProperty({ type: 'PerfilItem' })
  perfil_item?;

  @ApiProperty({ type: 'Cliente' })
  cliente?;

  @ApiProperty({ type: 'Pessoa' })
  consultor?;

  @ApiProperty({ type: 'PerfilSubtema' })
  perfil_subtema?;

  @ApiProperty({ type: 'Propriedade' })
  propriedade?;

  @ApiProperty({ type: 'Safra' })
  safra?;
}
