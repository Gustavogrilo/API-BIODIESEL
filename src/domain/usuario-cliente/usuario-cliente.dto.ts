import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class UsuarioClienteDto {
  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  usuario_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  cliente_id: number;

  @ApiProperty({ type: 'Cliente' })
  cliente;

  @ApiProperty({ type: 'Usuario' })
  usuario;
}
