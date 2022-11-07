import { ApiProperty } from '@nestjs/swagger';

export abstract class CoreDto {
  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  criado_em: Date;

  @ApiProperty()
  atualizado_em: Date;
}
