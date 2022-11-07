import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';

import { mailerConfig } from './mailer.config';

@Module({
  imports: [NestMailerModule.forRoot(mailerConfig)],
})
export class MailerModule {}
