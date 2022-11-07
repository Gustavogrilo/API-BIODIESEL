import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class ClientePropriedadeDto {
  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  cliente_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  filial_id: number;

  @ApiProperty()
  @Transform(parseInt)
  @IsPositive()
  propriedade_id: number;

  @ApiProperty({type: 'Cliente'})
  cliente;

  @ApiProperty({type: 'Filial'})
  filial;

  @ApiProperty({type: 'Propriedade'})
  propriedade;
}
