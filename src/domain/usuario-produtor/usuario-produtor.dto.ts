import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class UsuarioProdutorDto {
  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  usuario_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  produtor_id: number;

  @ApiProperty({ type: 'Usuario' })
  usuario;

  @ApiProperty({ type: 'Pessoa' })
  produtor;
}
