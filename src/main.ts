import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from '@hey-api/openapi-ts'
import * as express from 'express';
import { Reflector } from '@nestjs/core';

const logger = new Logger('Main')
function simplifyOperationId(obj) {
  const operationIdPattern =
    /^(getOne|updateOne|replaceOne|deleteOne|getMany|createOne|createMany)(Base)?[A-Za-z]+Controller([A-Za-z]+)$/

  function simplify(id) {
    return id.replace(operationIdPattern, '$1$3')
  }

  Object.keys(obj).forEach((path) => {
    const methods = obj[path]
    Object.keys(methods).forEach((method) => {
      const operation = methods[method]
      if (operation.operationId) {
        operation.operationId = simplify(operation.operationId)
      }
    })
  })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true,
      // forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: false,
    }),
  );
  app.setGlobalPrefix('api')
  const configService = app.get(ConfigService)

  // Only run development operations in non-production environment
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SnapSphere API')
      .setDescription('SnapSphere API')
      .setVersion('1.0')
      .addTag('ss')
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    })

    // rewrite all method name
    simplifyOperationId(document.paths)
    SwaggerModule.setup('api', app, document)
    logger.debug('Swagger API is up on http://localhost:3001/api')

    // save the json file
    const fs = require('fs')
    fs.writeFileSync('./openapi.json', JSON.stringify(document))
    logger.log('openapi.json file has been created')

    createClient({
      client: '@hey-api/client-axios',
      input: './openapi.json',
      output: configService.getOrThrow('SWAGGER_CODEGEN_OUTPUT'),
      services: { asClass: true },
    })

    logger.debug('codegen completed')
  }

  app.enableCors({
    origin: ['https://fyp.yuzhes.com'], // 允许你的前端地址
    credentials: true,                  // 如果你要传 cookie 或 token
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap()
