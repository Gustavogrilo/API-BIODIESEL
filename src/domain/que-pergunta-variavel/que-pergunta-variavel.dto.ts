import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, MaxLength } from 'class-validator';

export class QuePerguntaVariavelDto {
  @ApiProperty()
  @IsPositive()
  pergunta_id: number;

  @ApiProperty()
  @IsPositive()
  pergunta_referenciada_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(45)
  nome_variavel: number;
}
