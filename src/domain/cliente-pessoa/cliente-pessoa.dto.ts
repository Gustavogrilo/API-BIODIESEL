import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class ClientePessoaDto {
  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  cliente_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  pessoa_id: number;

  @ApiProperty({ type: 'Cliente' })
  cliente;

  @ApiProperty({ type: 'Pessoa' })
  Pessoa;
}
