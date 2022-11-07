import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  senha: string;
}
