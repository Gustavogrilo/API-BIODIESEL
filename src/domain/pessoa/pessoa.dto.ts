import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CoreDto } from 'src/core/core.dto';

export class PessoaDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  sobrenome: string;

  @ApiProperty()
  @IsString()
  @Length(14, 14)
  cpf: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  crea: string;

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
  @IsPositive()
  municipio_id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  consultor: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  produtor: boolean;

  @ApiProperty({type: 'Municipio'})
  municipio;
}
