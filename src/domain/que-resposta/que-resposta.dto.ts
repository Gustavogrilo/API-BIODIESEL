import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class QueRespostaDto extends CoreDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  resultado: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  justificativa: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  qual: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  unidade_medida: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  quantidade: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  pergunta_id: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  diagnostico_id: number;

  @ApiProperty({ type: 'QueDiagnostico' })
  diagnostico;

  @ApiProperty({ type: 'QuePergunta' })
  pergunta;

  @ApiProperty({ type: 'QueRespostaInsumo[]' })
  insumos;

  @ApiProperty({ type: 'QueItemLista[]' })
  itensDeLista;

  @ApiProperty({ type: 'Anexo[]' })
  anexos;
}
