import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  uid: number;

  @ApiProperty()
  access_token: string;
}
