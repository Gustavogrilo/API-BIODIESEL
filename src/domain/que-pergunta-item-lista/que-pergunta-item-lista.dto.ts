import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class QuePerguntaItemListaDto {
  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  pergunta_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  item_lista_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsOptional()
  @IsPositive()
  pergunta_referenciada_id: number;

  @ApiProperty({ type: 'QuePergunta' })
  pergunta;

  @ApiProperty({ type: 'QueItemLista' })
  item_lista;

  @ApiProperty({ type: 'QuePergunta' })
  pergunta_referenciada;
}
