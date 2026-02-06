import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api/v1';
  const corsOrigin = configService.get<string>('app.corsOrigin') ?? 'http://localhost:5173';

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HR Management API')
    .setDescription(
      'HR Management System with Subscription Model - API Documentation',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Auth endpoints')
    .addTag('Users', 'User management')
    .addTag('Organizations', 'Organization management')
    .addTag('Plans', 'Subscription plan management (Admin)')
    .addTag('Subscriptions', 'Subscription management')
    .addTag('Departments', 'Department management')
    .addTag('Employees', 'Employee management')
    .addTag('Leave Management', 'Leave types & requests')
    .addTag('Attendance', 'Clock-in/out & records')
    .addTag('Payroll', 'Payroll processing')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);

  logger.log(`Application running on: http://localhost:${port}`);
  logger.log(`API Prefix: /${apiPrefix}`);
  logger.log(`Swagger Docs: http://localhost:${port}/docs`);
}

bootstrap();
