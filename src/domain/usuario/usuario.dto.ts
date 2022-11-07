import {
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CoreDto } from 'src/core/core.dto';

export class UsuarioDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(60)
  login: string;

  @ApiProperty()
  @IsString()
  senha: string;

  @ApiProperty()
  @IsIn(['ADMINISTRADOR', 'CONSULTOR', 'MASTER'])
  permissao: 'ADMINISTRADOR' | 'CONSULTOR' | 'MASTER';

  @ApiProperty()
  @IsPositive()
  pessoa_id: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  avatar_id: number;

  @ApiProperty({ type: 'Pessoa' })
  pessoa;

  @ApiProperty({ type: 'Pessoa[]' })
  produtores;

  @ApiProperty({ type: 'Cliente[]' })
  clientes;
}
