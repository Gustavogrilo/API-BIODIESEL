import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

import { CoreDto } from 'src/core/core.dto';
import { Safra } from '../safra/safra.entity';

export class PropriedadeDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(254)
  logradouro: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(45)
  bairro: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(45)
  atividade: string;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  area_total: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  area_contratada: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  @IsPositive()
  produtor_id: number;

  @ApiProperty()
  @IsPositive()
  municipio_id: number;

  @ApiProperty({ type: 'Pessoa' })
  produtor;

  @ApiProperty({ type: 'Municipio' })
  municipio;

  @ApiProperty({ type: 'Dap[]' })
  daps;

  @ApiProperty({ type: 'Cliente[]' })
  clientes;

  @ApiProperty({ type: 'Filial[]' })
  filiais;

  @ApiProperty({ type: 'CroquiPropriedade[]' })
  croquis;

  @ApiProperty({ type: 'Safra[]' })
  safras: Safra[];
}
