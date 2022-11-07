import { IsIn, IsNumberString, IsOptional, IsPositive } from 'class-validator';

export class ImagensSafraQueryDto {
  @IsNumberString()
  cliente_id: number;

  @IsOptional()
  @IsNumberString()
  filial_id: number;

  @IsNumberString()
  safra_id: number;

  @IsNumberString()
  questionario_id: number;

  @IsIn(['pdf', 'zip'])
  modo: string;
}
