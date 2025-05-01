import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // em dev apontamos pro Vite, em prod troca para a URL real da Vercel/AWS
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend running in http://localhost:${port}`);
}

// Execute bootstrap only when running directly (not when imported in tests)
if (require.main === module) {
  bootstrap();
}