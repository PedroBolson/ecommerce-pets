import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // in dev we point to Vite; in prod, to the real AWS URL
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Only set up Swagger if we're not in a test environment
  if (process.env.NODE_ENV !== 'test') {
    // Configure Swagger
    const config = new DocumentBuilder()
      .setTitle('Pet E-commerce API')
      .setDescription('API documentation for pet e-commerce platform')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization'
        },
        'access-token'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    console.log(`📚 Swagger documentation available at http://localhost:${process.env.PORT || 3000}/api`);
  }

  // ensure it's always output as a number
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;
  await app.listen(port);
  console.log(`🚀 Backend running in http://localhost:${port}`);
}

// When executed directly (not in tests), triggers bootstrap
if (require.main === module) {
  bootstrap();
}