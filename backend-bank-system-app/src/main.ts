import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get configuration
  const port = process.env.PORT || 3000;
  const apiPrefix = process.env.API_PREFIX || 'api';
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';

  // Set global prefix for all routes
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin: corsOrigin.split(','), // Support multiple origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response transformer
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Bank Saving System API')
    .setDescription(
      'RESTful API for managing bank customers, accounts, deposito types, and transactions with automatic interest calculation.',
    )
    .setVersion('1.0')
    .addTag('Customers', 'Customer management endpoints')
    .addTag('Deposito Types', 'Deposito type management endpoints')
    .addTag('Accounts', 'Account management endpoints')
    .addTag('Transactions', 'Transaction endpoints (deposit/withdraw)')
    .addServer(`http://localhost:${port}`, 'Local Development')
    .addServer('https://ec2-instance.com', 'AWS Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    customSiteTitle: 'Bank Saving System API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces for AWS

  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  logger.log(
    `📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`,
  );
  logger.log(`🌍 CORS enabled for: ${corsOrigin}`);
  logger.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
}

void bootstrap();
