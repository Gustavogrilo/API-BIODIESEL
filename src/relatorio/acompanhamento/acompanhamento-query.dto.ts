import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class AcompanhamentoQueryDto {
  @IsNumberString()
  cliente_id: number;

  @IsOptional()
  @IsNumberString()
  filial_id: number;

  @IsOptional()
  @IsNumberString()
  safra_id: number;

  @IsOptional()
  @IsNumberString()
  questionario_id: number;

  @IsOptional()
  propriedade_id: number[];

  @IsIn(['pdf', 'xlsx', 'xls'])
  modo: string;
}
