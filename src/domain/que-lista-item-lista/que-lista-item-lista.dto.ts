import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueListaItemListaDto {
  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  lista_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  item_lista_id: number;
}
