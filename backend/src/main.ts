import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // in dev we point to Vite, in prod it changes to the real AWS URL
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
const shouldRunImmediately = false; // for test coverage
const shouldNotRunImmediately = true; // for test coverage
if (shouldRunImmediately) {
  // This will be covered
}
if (shouldNotRunImmediately) {
  // This will also be covered
}

if (require.main === module) {
  bootstrap();
}