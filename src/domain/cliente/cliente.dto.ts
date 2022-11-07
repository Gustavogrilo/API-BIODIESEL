import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import { CoreDto } from 'src/core/core.dto';

export class ClienteDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsString()
  @Length(18, 18)
  cnpj: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(13, 20)
  telefone: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email: string;

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
  @IsIn(['LEITE', 'SOJA', 'CORTE'])
  atividade: string;

  @ApiProperty()
  @IsPositive()
  municipio_id: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  logo_id: number;

  @ApiProperty({ type: 'Municipio' })
  municipio;

  @ApiProperty({ type: 'Filial[]' })
  filiais;

  @ApiProperty({ type: 'Safra[]' })
  safras;

  @ApiProperty({ type: 'Pessoa[]' })
  pessoas;

  @ApiProperty({ type: 'Propriedade[]' })
  propriedades;

  @ApiProperty({ type: 'Usuario[]' })
  usuarios;
}
