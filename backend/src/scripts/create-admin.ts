import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const usersService = app.get(UsersService);

    try {
        const adminUser = await usersService.create({
            email: 'admin@petshop.com',
            password: 'admin123',
            role: 'admin',
        });

        console.log('Admin user created:', adminUser);
    } catch (error) {
        console.error('Failed to create admin user:', error.message);
    }

    await app.close();
}

bootstrap();