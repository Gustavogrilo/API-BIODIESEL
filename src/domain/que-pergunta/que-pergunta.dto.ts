import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class QuePerguntaDto extends CoreDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsIn([
    'TEXTO',
    'NUMERO',
    'INSUMO',
    'LISTA SIMPLES',
    'LISTA COMPOSTA',
    'EXPRESSAO',
    'DATA',
    'MUNICIPIO',
    'IMAGEM',
  ])
  tipo: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  expressao: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(90)
  validacao: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  mensagem_validacao: string;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  insumo_tipo_id: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  lista_id: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  pergunta_referencia_id: number;

  @ApiProperty()
  @IsPositive()
  cliente_id: number;

  @ApiProperty()
  @IsOptional()
  @IsIn([0, 1, true, false])
  possui_quantidade: boolean;

  @ApiProperty()
  @IsOptional()
  @IsIn([0, 1, true, false])
  imprimir: boolean;

  @ApiProperty({ type: 'InsumoTipo' })
  tipo_insumo;

  @ApiProperty({ type: 'QueLista' })
  lista;

  @ApiProperty({ type: 'QuePergunta' })
  pergunta_referencia;
}
