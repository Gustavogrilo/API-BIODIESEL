import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DomainModule } from './domain/domain.module';
import { AuthModule } from './auth/auth.module';
import { RelatorioModule } from './relatorio/relatorio.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    DomainModule,
    RelatorioModule,
    MailerModule,
  ],
})
export class AppModule {}
