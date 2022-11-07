import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueSubtemaPerguntaDto {
  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  questionario_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  subtema_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  pergunta_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  item: number;
}
