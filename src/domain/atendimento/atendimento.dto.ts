import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString } from 'class-validator';

export class AtendimentoDto {
  @ApiProperty()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsPositive()
  diagnostico_id: number;

  @ApiProperty()
  @IsPositive()
  safra_id: number;

  @ApiProperty()
  @IsPositive()
  consultor_id: number;

  @ApiProperty()
  @IsPositive()
  questionario_id: number;

  @ApiProperty()
  @IsPositive()
  tema_id: number;

  @ApiProperty()
  @IsPositive()
  propriedade_id: number;

  @ApiProperty()
  @IsPositive()
  produtor_id: number;

  @ApiProperty()
  @IsPositive()
  municipio_id: number;

  @ApiProperty()
  @IsPositive()
  estado_id: number;

  @ApiProperty()
  @IsString()
  questionario: string;

  @ApiProperty()
  @IsString()
  laudo: string;

  @ApiProperty()
  @IsString()
  propriedade: string;

  @ApiProperty()
  @IsString()
  produtor: string;

  @ApiProperty()
  @IsString()
  data_atendimento: string;

  @ApiProperty()
  @IsPositive()
  perguntas: number;

  @ApiProperty()
  @IsPositive()
  respostas: number;

  @ApiProperty()
  @IsPositive()
  concluido: number;
}
