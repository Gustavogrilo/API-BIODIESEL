import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class QuestionarioTemaDto {
  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  questionario_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  tema_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  item: number;

  @ApiProperty({ type: 'Questionario' })
  questionario;

  @ApiProperty({ type: 'QueTema' })
  tema;
}
