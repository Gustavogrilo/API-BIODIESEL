import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { CoreDto } from 'src/core/core.dto';
import { Propriedade } from '../propriedade/propriedade.entity';

export class SafraDto extends CoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descricao: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(45)
  contrato: string;

  @ApiProperty()
  @IsISO8601()
  data_inicio: Date;

  @ApiProperty()
  @IsISO8601()
  data_termino: Date;

  @ApiProperty()
  @IsPositive()
  cliente_id: number;

  @ApiProperty({ type: 'Cliente' })
  cliente;

  @ApiProperty({ type: 'Propriedade[]'})
  propriedades: Propriedade[];
}
