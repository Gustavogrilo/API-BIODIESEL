import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface dataFormatadaParametros {
  data?: Date;
  formato: string;
}

export function dataFormatada(
  parametros: dataFormatadaParametros = {
    data: new Date(),
    formato: 'dd/MM/yyyy',
  },
) {
  return format(parametros.data, parametros.formato, {
    locale: ptBR,
  }).toUpperCase();
}
