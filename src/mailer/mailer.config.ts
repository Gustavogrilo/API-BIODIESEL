import * as path from 'path';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailerConfig = {
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'nao-responda@biosistemico.com.br',
      pass: 'ibs@@2021',
    },
  },
  template: {
    dir: path.resolve(__dirname, '..', '..', 'templates'),
    adapter: new HandlebarsAdapter(),
  },
};
