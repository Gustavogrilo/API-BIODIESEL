import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import * as appInsights from 'applicationinsights';

import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  setAzureInsights();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const opcoesSwagger = new DocumentBuilder().setTitle('API Biodiesel').build();
  const document = SwaggerModule.createDocument(app, opcoesSwagger);
  SwaggerModule.setup('', app, document);

  await app.listen(+process.env.NESTJS_PORT, () =>
    logger.log('API escutando na porta ' + process.env.NESTJS_PORT),
  );

  function setAzureInsights(): void {
    const key = process.env.AZURE_APP_INSIGHTS_KEY;

    appInsights
      .setup(key)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(false)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(true)
      .start();

    logger.debug(`Azure AppInsights started. Key: ${key}`);
  }
}
bootstrap();
