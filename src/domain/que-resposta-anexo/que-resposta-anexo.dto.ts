import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class QueRespostaAnexoDto {
  @ApiProperty()
  @IsPositive()
  resposta_id: number;

  @ApiProperty()
  @IsPositive()
  anexo_id: number;
}
