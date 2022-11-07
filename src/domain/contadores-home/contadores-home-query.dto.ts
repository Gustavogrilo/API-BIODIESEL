import { IsNumberString } from 'class-validator';

export class ContadoresHomeQueryDto {
  @IsNumberString()
  cliente_id: number;
}
