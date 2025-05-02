import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // em dev apontamos para o Vite; em prod, para a URL real da AWS
  const frontendUrl = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // garantir que sempre sai como número
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;
  await app.listen(port);
  console.log(`🚀 Backend running in http://localhost:${port}`);
}

// Quando executado diretamente (não em testes), dispara o bootstrap
if (require.main === module) {
  bootstrap();
}